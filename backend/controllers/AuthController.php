<?php

// AuthController.php — Handles registration and login. //


// Valid blood groups — used to validate receiver registration.
const VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];


// POST /api/auth/register/hospital
function register_hospital(): void
{
    $body = get_body();
    // 
    foreach (['email', 'password', 'name', 'address', 'phone'] as $field) {
        if (empty($body[$field])) {
            send_error("$field is required");
        }
    }
    // 
    if (user_email_taken($body['email'])) {
        send_error('This email is already registered');
    }
    // 
    $db = get_db();
    $db->beginTransaction();

    $userId = user_create($body['email'], $body['password'], 'hospital');
    hospital_create($userId, $body['name'], $body['address'], $body['phone']);

    $db->commit();

    send_json(['message' => 'Hospital registered successfully'], 201);
}


// POST /api/auth/register/receiver
function register_receiver(): void
{
    $body = get_body();
    // 
    foreach (['email', 'password', 'name', 'phone', 'bloodGroup'] as $field) {
        if (empty($body[$field])) {
            send_error("$field is required");
        }
    }
    // 
    if (!in_array($body['bloodGroup'], VALID_BLOOD_GROUPS, true)) {
        send_error('Invalid blood group. Use one of: A+, A-, B+, B-, AB+, AB-, O+, O-');
    }

    if (user_email_taken($body['email'])) {
        send_error('This email is already registered');
    }

    $db = get_db();
    $db->beginTransaction();

    $userId = user_create($body['email'], $body['password'], 'receiver');
    receiver_create($userId, $body['name'], $body['phone'], $body['bloodGroup']); // use camelCase key

    $db->commit();

    send_json(['message' => 'Receiver registered successfully'], 201);
}


// POST /api/auth/login
function login(): void
{
    $body = get_body();

    if (empty($body['email']) || empty($body['password'])) {
        send_error('Email and password are required');
    }

    $user = user_find_by_email($body['email']);
    // 
    if (!$user || !password_verify($body['password'], $user['password_hash'])) {
        send_error('Incorrect email or password', 401);
    }
    // 
    if ($user['role'] === 'hospital') {
        $profile = hospital_find_by_user((int) $user['id']);
    } else {
        $profile = receiver_find_by_user((int) $user['id']);
    }
    // 
    $token = jwt_create([
        'user_id'   => (int) $user['id'],
        'role'      => $user['role'],
        'profileId' => (int) $profile['id'],
    ]);

    send_json([
        'token' => $token,
        'user'  => [
            'id'         => (int) $user['id'],
            'email'      => $user['email'],
            'role'       => $user['role'],
            'name'       => $profile['name'],
            'profileId'  => (int) $profile['id'],
            'blood_group' => $profile['blood_group'] ?? null,
        ],
    ]);
}