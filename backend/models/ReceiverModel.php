<?php

// ReceiverModel.php — Queries for the `receivers` table. //


// Create a receiver profile after registration. Returns the new receiver id.
function receiver_create(int $userId, string $name, string $phone, string $bloodGroup): int
{
    $stmt = get_db()->prepare(
        'INSERT INTO receivers (user_id, name, phone, blood_group) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$userId, $name, $phone, $bloodGroup]);

    return (int) get_db()->lastInsertId();
}

// Find a receiver's profile using their user_id.
function receiver_find_by_user(int $userId): ?array
{
    $stmt = get_db()->prepare('SELECT * FROM receivers WHERE user_id = ?');
    $stmt->execute([$userId]);
    return $stmt->fetch() ?: null;
}

// Find a receiver's profile by the receiver id (not user_id).
function receiver_find_by_id(int $id): ?array
{
    $stmt = get_db()->prepare('SELECT * FROM receivers WHERE id = ?');
    $stmt->execute([$id]);
    return $stmt->fetch() ?: null;
}