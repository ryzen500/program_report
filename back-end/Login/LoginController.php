<?php

// Function to handle login request
function handleLogin() {
    global $conn;

    // Process login request
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'];
    $password = $input['password'];

    // Authenticate user and fetch access rights
    $authResult = authenticateHakAkses($username, $password);

    // If authentication successful, proceed with response
    if ($authResult !== false) {
        $token = authenticateUser($username, $password); // Assuming this function generates a token
        $response = array(
            'token' => $token,
            'user' => $authResult['user'], // Access rights retrieved from authenticateHakAkses
            'hak_akses' => $authResult['access_rights'] // Access rights retrieved from authenticateHakAkses
        );
        sendResponse(200, $response);
    } else {
        sendResponse(401, array('error' => 'Authentication failed'));
    }
}
 ?>