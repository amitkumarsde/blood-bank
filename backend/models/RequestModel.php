<?php

// RequestModel.php — Queries for the `blood_requests` table. //


// Create a new blood request. Returns the new request id.
function request_create(int $sampleId, int $receiverId): int
{
    $stmt = get_db()->prepare(
        'INSERT INTO blood_requests (sample_id, receiver_id) VALUES (?, ?)'
    );
    $stmt->execute([$sampleId, $receiverId]);

    return (int) get_db()->lastInsertId();
}

// Get all requests made against a specific hospital's blood samples.
function request_list_for_hospital(int $hospitalId): array
{
    $sql = 'SELECT
                r.id,
                r.status,
                r.created_at,
                s.blood_group,
                rec.name  AS receiver_name,
                rec.phone AS receiver_phone
            FROM blood_requests r
            JOIN blood_samples s  ON s.id  = r.sample_id
            JOIN receivers rec    ON rec.id = r.receiver_id
            WHERE s.hospital_id = ?
            ORDER BY r.created_at DESC';

    $stmt = get_db()->prepare($sql);
    $stmt->execute([$hospitalId]);
    return $stmt->fetchAll();
}

// Get all requests a specific receiver has made.
function request_list_for_receiver(int $receiverId): array
{
    $sql = 'SELECT
                r.id,
                r.status,
                r.created_at,
                s.blood_group,
                h.name    AS hospital_name,
                h.address AS hospital_address
            FROM blood_requests r
            JOIN blood_samples s ON s.id = r.sample_id
            JOIN hospitals h     ON h.id = s.hospital_id
            WHERE r.receiver_id = ?
            ORDER BY r.created_at DESC';

    $stmt = get_db()->prepare($sql);
    $stmt->execute([$receiverId]);
    return $stmt->fetchAll();
}

// Find a single request, also fetching the sample's hospital_id and units.
function request_find_with_sample(int $requestId): ?array
{
    $sql = 'SELECT
                r.id,
                r.status,
                r.sample_id,
                s.hospital_id,
                s.units
            FROM blood_requests r
            JOIN blood_samples s ON s.id = r.sample_id
            WHERE r.id = ?';

    $stmt = get_db()->prepare($sql);
    $stmt->execute([$requestId]);
    return $stmt->fetch() ?: null;
}

// Update the status of a request to 'approved' or 'rejected'.
function request_update_status(int $requestId, string $status): void
{
    get_db()->prepare('UPDATE blood_requests SET status = ? WHERE id = ?')
            ->execute([$status, $requestId]);
}