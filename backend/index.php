<?php

// index.php — Entry point. Every API request starts here. //


// Load settings from the .env file (DB password, JWT secret, etc.)
require_once __DIR__ . '/config/env.php';
load_env(__DIR__ . '/.env');

// Load the database connection
require_once __DIR__ . '/config/database.php';

// Load shared helper functions (send response, read request body, JWT)
require_once __DIR__ . '/config/helpers.php';

// Load all models (one file per database table)
require_once __DIR__ . '/models/UserModel.php';
require_once __DIR__ . '/models/HospitalModel.php';
require_once __DIR__ . '/models/ReceiverModel.php';
require_once __DIR__ . '/models/SampleModel.php';
require_once __DIR__ . '/models/RequestModel.php';

// Load all controllers (one file per feature)
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/SampleController.php';
require_once __DIR__ . '/controllers/RequestController.php';

// Send CORS headers so the frontend (on a different port) can talk to this API.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// The browser sends an OPTIONS "preflight" request before POST/PUT.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load and run the routes
require_once __DIR__ . '/routes/api.php';