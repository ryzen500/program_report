<?php

// global_functions.php

// Function to handle JSON response
function sendResponse($status, $data = null) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}

?>
