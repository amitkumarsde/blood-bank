<?php

// HospitalModel.php — Queries for the `hospitals` table. //


// Create a hospital profile after registration. Returns the new hospital id.
function hospital_create(int $userId, string $name, string $address, string $phone): int
{
    $stmt = get_db()->prepare(
        'INSERT INTO hospitals (user_id, name, address, phone) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$userId, $name, $address, $phone]);

    return (int) get_db()->lastInsertId();
}

// Find a hospital's profile using their user_id.
function hospital_find_by_user(int $userId): ?array
{
    $stmt = get_db()->prepare('SELECT * FROM hospitals WHERE user_id = ?');
    $stmt->execute([$userId]);
    return $stmt->fetch() ?: null;
}