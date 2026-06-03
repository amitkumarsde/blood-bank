<?php

// RequestController.php — Blood sample requests. //


// POST /api/requests/{sampleId} — Receiver only.
function create_request(int $sampleId): void
{
    $user = require_auth('receiver');
    // 1. Make sure the sample exists
    $sample = sample_find_by_id($sampleId);
    if (!$sample) {
        send_error('Blood sample not found', 404);
    }
    // 2. Make sure there are units available
    if ((int) $sample['units'] < 1) {
        send_error('This blood sample is out of stock');
    }
    // 3. Try to insert the request row.
    try {
        $id = request_create($sampleId, (int) $user['profileId']);
    } 
    catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            send_error('You have already requested this blood sample');
        }
        send_error('Could not submit request. Please try again.', 500);
    }

    send_json(['message' => 'Request submitted successfully', 'id' => $id], 201);
}


// GET /api/requests — Hospital only.
function get_hospital_requests(): void
{
    $user = require_auth('hospital');
    // 
    $requests = request_list_for_hospital((int) $user['profileId']);
    send_json($requests);
}


// GET /api/my-requests — Receiver only.
function get_receiver_requests(): void
{
    $user = require_auth('receiver');

    $requests = request_list_for_receiver((int) $user['profileId']);
    send_json($requests);
}


// PUT /api/requests/{requestId} — Hospital only.
function update_request_status(int $requestId): void
{
    $user   = require_auth('hospital');
    $body   = get_body();
    $status = strtolower(trim($body['status'] ?? ''));

    if (!in_array($status, ['approved', 'rejected'], true)) {
        send_error('Status must be "approved" or "rejected"');
    }
    // 
    $request = request_find_with_sample($requestId);

    if (!$request) {
        send_error('Request not found', 404);
    }
    // 
    if ((int) $request['hospital_id'] !== (int) $user['profileId']) {
        send_error('You do not have permission to update this request', 403);
    }
    // 
    if ($request['status'] !== 'pending') {
        send_error('This request has already been ' . $request['status']);
    }
    // 
    $db = get_db();
    $db->beginTransaction();

    if ($status === 'approved') {
        if ((int) $request['units'] < 1) {
            $db->rollBack();
            send_error('No units left to approve for this sample');
        }
        sample_decrement_units((int) $request['sample_id']);
    }

    request_update_status($requestId, $status);

    $db->commit();

    send_json(['message' => "Request has been $status", 'status' => $status]);
}