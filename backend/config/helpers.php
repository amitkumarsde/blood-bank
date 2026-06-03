<?php

// helpers.php — Small functions used everywhere in the app. //


// 1. RESPONSE HELPERS ---------------------------------------------------

function send_json(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit; // Stop here — nothing more to send.
}

function send_error(string $message, int $status = 400): void
{
    send_json(['message' => $message], $status);
}


// 2. REQUEST HELPER -----------------------------------------------------

function get_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}


// 3. JWT (JSON Web Token) — stateless authentication --------------------

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_create(array $payload): string
{
    $header = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));

    $payload['iat'] = time();
    $payload['exp'] = time() + (60 * 60 * 24);

    $body = base64url_encode(json_encode($payload));

    $signature = base64url_encode(
        hash_hmac('sha256', "$header.$body", env('JWT_SECRET'), true)
    );

    return "$header.$body.$signature";
}

function jwt_read(string $token): ?array
{
    $parts = explode('.', $token);

    if (count($parts) !== 3) {
        return null;
    }

    [$header, $body, $signature] = $parts;

    $expected = base64url_encode(
        hash_hmac('sha256', "$header.$body", env('JWT_SECRET'), true)
    );

    if (!hash_equals($expected, $signature)) {
        return null;
    }

    $payload = json_decode(base64url_decode($body), true);

    if (!is_array($payload)) {
        return null;
    }

    if (isset($payload['exp']) && time() > $payload['exp']) {
        return null;
    }

    return $payload;
}


// 4. AUTH GUARD ---------------------------------------------------------

function require_auth(string $role): array
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if ($header === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $key => $value) {
            if (strtolower($key) === 'authorization') {
                $header = $value;
                break;
            }
        }
    }

    if (!str_starts_with($header, 'Bearer ')) {
        send_error('You must be logged in', 401);
    }

    $token = substr($header, 7);
    $user  = jwt_read($token);

    if ($user === null) {
        send_error('Invalid or expired token. Please log in again.', 401);
    }

    if ($user['role'] !== $role) {
        send_error('You do not have permission to do this', 403);
    }

    return $user;
}