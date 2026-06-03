-- Blood Bank — Database Schema


-- users -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INT          AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(150) NOT NULL UNIQUE,       -- UNIQUE prevents duplicate accounts
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('hospital', 'receiver') NOT NULL,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);


-- hospitals -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hospitals (
    id      INT          AUTO_INCREMENT PRIMARY KEY,
    user_id INT          NOT NULL UNIQUE,             -- UNIQUE = one profile per user
    name    VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone   VARCHAR(20)  NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- receivers -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS receivers (
    id          INT          AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL UNIQUE,
    name        VARCHAR(150) NOT NULL,
    phone       VARCHAR(20)  NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- blood_samples ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS blood_samples (
    id          INT  AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT  NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    units       INT  NOT NULL DEFAULT 1,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);


-- blood_requests --------------------------------------------------------
CREATE TABLE IF NOT EXISTS blood_requests (
    id          INT  AUTO_INCREMENT PRIMARY KEY,
    sample_id   INT  NOT NULL,
    receiver_id INT  NOT NULL,
    status      ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY one_request_per_sample (sample_id, receiver_id), -- prevent duplicates
    FOREIGN KEY (sample_id)   REFERENCES blood_samples(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES receivers(id)     ON DELETE CASCADE
);