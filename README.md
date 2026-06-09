# BloodBank

A full-stack blood bank platform that connects **hospitals** (who list blood
inventory) with **receivers** (who request units). Every request is validated
against the standard blood-group transfusion compatibility table.

- **Frontend** — [Next.js 16](https://nextjs.org) (App Router) + React 19 + Tailwind CSS 4
- **Backend** — **Core PHP** (no framework) REST API + MySQL, hand-written JWT auth

```
blood-bank/
├── frontend/   # Next.js app (the UI)
└── backend/    # Core PHP JSON API
```

> Built for educational purposes — the code is intentionally simple, heavily
> commented, and easy to explain in an interview.

---

## Features

- Two roles: **hospital** and **receiver**, separated by JWT-based auth.
- Hospitals add blood units (group + quantity) to their inventory.
- Receivers browse public availability and request compatible units.
- **Compatibility enforced** — a receiver can only request a group their own
  blood group can safely receive.
- Duplicate requests are blocked (app-level check **and** a DB unique constraint).
- Hospitals approve/reject incoming requests; approving consumes one unit.

---

## Prerequisites

- **Node.js** 18+ and npm (for the frontend)
- **PHP** 8.1+ with the `pdo_mysql` extension (for the backend)
- **MySQL** 5.7+ / MariaDB (XAMPP bundles both PHP and MySQL — easiest on Windows)

---

## 1. Backend setup (`backend/`)

The backend is plain PHP — **no Composer, no framework, nothing to install**.
You only need PHP and MySQL running.

```bash
cd backend

# 1. Create the database + tables (run once):
Get-Content sql/database.sql | mysql -u root -p

# 2. Create your .env from the template and fill in real values:
cp .env.example .env

# 3. Start the API on port 8080 (index.php is the single entry point):
php -S localhost:8080 index.php
```

The API now runs at **http://localhost:8080**. Quick check:

```bash
curl http://localhost:8080/
# {"message":"Blood Bank API running"}
```

> **Using XAMPP/Apache instead of `php -S`?** Point a vhost (or an `htdocs`
> subfolder) at `backend/`. The included `.htaccess` rewrites every request to
> `index.php` and blocks direct access to `.env`.

### Backend folder structure (and why)

```
backend/
├── config/
│   └── database.php        # PDO connection (shared singleton)
├── controllers/            # handle a request: validate -> call model -> respond
│   ├── AuthController.php
│   ├── SampleController.php
│   └── RequestController.php
├── models/                 # all SQL lives here, one model per table
│   ├── UserModel.php
│   ├── HospitalModel.php
│   ├── ReceiverModel.php
│   ├── SampleModel.php
│   └── RequestModel.php
├── middleware/             # code that runs before a handler
│   ├── CorsMiddleware.php  # cross-origin headers + preflight
│   └── AuthMiddleware.php  # verify JWT + enforce role
├── helpers/                # small reusable utilities
│   ├── env.php             # read .env
│   ├── response.php        # send_json(), send_error(), read_json_body()
│   ├── jwt.php             # jwt_encode(), jwt_decode()
│   ├── blood.php           # blood groups + compatibility rules
│   └── Router.php          # tiny URL router
├── routes/
│   └── api.php             # the single, readable list of all endpoints
├── sql/
│   └── database.sql        # database schema
├── .htaccess               # Apache rewrite rules (+ .env protection)
├── .env.example            # template for your secrets
└── index.php               # ENTRY POINT (front controller)
```

**Why this layout?** It is the same **Controller → Model** separation every PHP
framework uses, reduced to its essentials so each part is visible:

- **One entry point** (`index.php`) means routing, CORS, and bootstrapping live in
  one obvious place — and (under Apache) only well-formed requests reach our code.
- **Controllers stay thin**: they validate input, apply business rules, and
  choose a response. They never write SQL directly.
- **Models hold the SQL**: one file per table, so every query is easy to find.
- **Middleware** keeps cross-cutting concerns (auth, CORS) out of the controllers.
- **Helpers** are plain functions reused everywhere (consistent JSON responses, etc).

**Request flow:**
`browser → index.php → CorsMiddleware → Router → Controller → (AuthMiddleware) → Model → send_json()`

### API endpoints

| Method | Path                          | Auth     | Purpose                                   |
| ------ | ----------------------------- | -------- | ----------------------------------------- |
| GET    | `/`                           | public   | Health check                              |
| POST   | `/api/auth/register/hospital` | public   | Register a hospital                       |
| POST   | `/api/auth/register/receiver` | public   | Register a receiver                       |
| POST   | `/api/auth/login`             | public   | Log in → returns `{ token, user }`        |
| GET    | `/api/samples`                | public   | List available blood units                |
| POST   | `/api/samples`                | hospital | Add a blood sample                        |
| POST   | `/api/requests/{sampleId}`    | receiver | Request a sample (compatibility-checked)  |
| GET    | `/api/requests`               | hospital | List requests for the hospital            |
| GET    | `/api/my-requests`            | receiver | List the receiver's own requests          |
| PUT    | `/api/requests/{id}`          | hospital | Approve / reject a request                |

Authenticated requests send `Authorization: Bearer <token>`.
Every error returns the matching HTTP status with `{ "message": "..." }`.

---

## 2. Frontend setup (`frontend/`)

```bash
cd frontend
npm install

# .env.local is already provided and points at the backend:
#   NEXT_PUBLIC_API_URL=http://localhost:8080

npm run dev
```

Open **http://localhost:3000**.

### Pages

| Route        | Description                                                                       |
| ------------ | --------------------------------------------------------------------------------- |
| `/`          | Homepage — hero, features, live availability                                      |
| `/samples`   | Public blood listing; receivers can request units                                 |
| `/register`  | Sign up as a hospital or receiver                                                 |
| `/login`     | Log in                                                                            |
| `/dashboard` | Role-based: hospitals manage inventory & requests, receivers track their requests |

The frontend stores the JWT + user in `localStorage` via a small `AuthProvider`
context (`src/lib/auth.tsx`) and talks to the API through a typed client
(`src/lib/api.ts`).

---

## Blood-group compatibility

| Receiver | Can receive from               |
| -------- | ------------------------------ |
| O−       | O−                             |
| O+       | O−, O+                         |
| A−       | O−, A−                         |
| A+       | O−, O+, A−, A+                 |
| B−       | O−, B−                         |
| B+       | O−, O+, B−, B+                 |
| AB−      | O−, A−, B−, AB−                |
| AB+      | everyone (universal recipient) |

---

## Error handling & edge cases (interview talking points)

- **Validation** — every required field is checked; blood groups must be one of the 8 valid values.
- **Duplicate email** — checked in code *and* enforced by a `UNIQUE` column in the DB.
- **Login privacy** — "wrong email" and "wrong password" return the *same* message, so attackers can't discover which emails exist.
- **SQL injection** — every query uses PDO prepared statements, so user input is never executed as SQL.
- **Transactions** — register (user + profile) and approve (reduce stock + set status) run inside a DB transaction: all-or-nothing, never half-done.
- **Duplicate request race** — a `UNIQUE(sample_id, receiver_id)` index means even two simultaneous clicks can't create two requests; we catch the DB error (SQLSTATE `23000`) and reply nicely.
- **Blood compatibility** — a receiver can only request blood their group can safely accept.
- **Out of stock** — can't request or approve a sample with `units < 1`.
- **Ownership** — a hospital can only approve/reject requests for *its own* samples (checked via the token's `profileId`).
- **Decide once** — a request that is already approved/rejected can't be changed again.
- **Token safety** — signatures are verified with `hash_equals` (timing-safe); expired tokens (24h) are rejected.
- **No leaking internals** — raw DB/exception messages are never sent to the client (generic 500 instead).
