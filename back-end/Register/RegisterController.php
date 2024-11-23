<?php


// Function to handle registration request
function handleRegister() {
    global $conn;

    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(405, array('error' => 'Method Not Allowed'));
        return;
    }

    // Parse input data
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['nama_user']) || !isset($input['username']) || !isset($input['password']) || !isset($input['rumahsakit_id']) || !isset($input['hak_akses_id'])) {
        sendResponse(400, array('error' => 'Invalid data format'));
        return;
    }

    // Sanitize and prepare data for insertion
    $nama_user = $conn->real_escape_string($input['nama_user']);
    $username = $conn->real_escape_string($input['username']);
    $password = $conn->real_escape_string($input['password']);
    $rumahsakit_id = (int) ($input['rumahsakit_id']); // Assuming rumahsakit_id is integer
    $hak_akses_id = (int)$input['hak_akses_id']; // Assuming hak_akses_id is integer

    // Perform insertion into database
    $sql = "INSERT INTO user (nama_user, username, password, rumahsakit_id, hak_akses_id) 
            VALUES ('$nama_user', '$username', '$password', $rumahsakit_id, $hak_akses_id)";

    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'User registered successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to register user: ' . $conn->error));
    }
}

 ?>