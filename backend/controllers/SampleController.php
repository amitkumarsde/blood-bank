<?php

// SampleController.php — Browse blood samples and add new stock. //


// GET /api/samples — Public. No login required.
function get_samples(): void
{
    $samples = sample_get_all_available();
    send_json($samples);
}


// POST /api/samples — Hospital only.
function add_sample(): void
{
    // 
    $user = require_auth('hospital');

    $body        = get_body();
    $blood_group = trim($body['bloodGroup'] ?? ''); 
    $units       = (int) ($body['units'] ?? 0);

    if (!in_array($blood_group, VALID_BLOOD_GROUPS, true)) {
        send_error('Invalid blood group');
    }

    if ($units < 1) {
        send_error('Units must be at least 1');
    }
    // 
    $id = sample_create($user['profileId'], $blood_group, $units);

    send_json(['message' => 'Blood sample added', 'id' => $id], 201);
}