<?php

// api.php — The complete list of all API endpoints //


$method = $_SERVER['REQUEST_METHOD'];

$uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
if ($scriptDir !== '' && str_starts_with($uriPath, $scriptDir)) {
    $uriPath = substr($uriPath, strlen($scriptDir));
}

$path = '/' . trim($uriPath, '/');

$id   = null;
$base = preg_replace_callback('/\/(\d+)/', function ($match) use (&$id) {
    $id = (int) $match[1]; 
    return '/{id}';
}, $path);

match ("$method $base") {

    // Health check ------------------------------------------------------
    'GET /' => send_json(['message' => 'Blood Bank API is running']),

    // Auth (public — no login needed) -----------------------------------
    'POST /api/auth/register/hospital' => register_hospital(),

    'POST /api/auth/register/receiver' => register_receiver(),

    'POST /api/auth/login' => login(),

    // Blood samples -----------------------------------------------------
    'GET /api/samples' => get_samples(),  

    'POST /api/samples' => add_sample(),                        // hospital only

    // Blood requests ----------------------------------------------------
    'GET /api/requests' => get_hospital_requests(),             // hospital sees its own requests

    'GET /api/my-requests' => get_receiver_requests(),          // receiver sees their own requests — MUST be before the {id} route

    'POST /api/requests/{id}' => create_request($id),           // receiver requests a sample

    'PUT /api/requests/{id}' => update_request_status($id),     // hospital approves or rejects

    // Fallback — nothing matched ----------------------------------------
    default
        => send_error('Route not found', 404),
};