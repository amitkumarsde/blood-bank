<?php

// UserModel.php — Queries for the `users` table. //


// Check if an email is already registered.
function user_email_taken(string $email): bool
{
    $stmt = get_db()->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    return (bool) $stmt->fetch();
}

// Find a user by email. Returns the full row, or null if not found.
function user_find_by_email(string $email): ?array
{
    $stmt = get_db()->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    return $stmt->fetch() ?: null;
}

// Create a new user account. Returns the new user's id.
function user_create(string $email, string $password, string $role): int
{
    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = get_db()->prepare(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)'
    );
    $stmt->execute([$email, $hash, $role]);

    return (int) get_db()->lastInsertId();
}