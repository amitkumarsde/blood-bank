<?php

// SampleModel.php — Queries for the `blood_samples` table. //


// Return all blood samples that are still in stock (units > 0).
function sample_get_all_available(): array
{
    $sql = 'SELECT
                s.id,
                s.blood_group,
                s.units,
                s.created_at,
                h.name    AS hospital_name,
                h.address AS hospital_address
            FROM blood_samples s
            JOIN hospitals h ON h.id = s.hospital_id
            WHERE s.units > 0
            ORDER BY s.created_at DESC';

    return get_db()->query($sql)->fetchAll();
}

// Find a single blood sample by its id.
function sample_find_by_id(int $id): ?array
{
    $stmt = get_db()->prepare('SELECT * FROM blood_samples WHERE id = ?');
    $stmt->execute([$id]);
    return $stmt->fetch() ?: null;
}

// Add a new blood sample entry for a hospital. Returns the new sample id.
function sample_create(int $hospitalId, string $bloodGroup, int $units): int
{
    $stmt = get_db()->prepare(
        'INSERT INTO blood_samples (hospital_id, blood_group, units) VALUES (?, ?, ?)'
    );
    $stmt->execute([$hospitalId, $bloodGroup, $units]);

    return (int) get_db()->lastInsertId();
}

// Reduce the unit count by 1 when a request is approved.
function sample_decrement_units(int $id): void
{
    get_db()->prepare('UPDATE blood_samples SET units = units - 1 WHERE id = ?')
            ->execute([$id]);
}