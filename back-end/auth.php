<?php

function authenticateUser($username, $password) {
    global $conn;
    $username = $conn->real_escape_string($username);
    $password = $conn->real_escape_string($password);

    $sql = "SELECT * FROM user WHERE username='$username' AND password='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $token = base64_encode(random_bytes(64));
        $updateTokenSql = "UPDATE user SET token='$token' WHERE username='$username'";
        $conn->query($updateTokenSql);
        return $token;
    } else {
        return false;
    }
}


// Function to authenticate user and fetch access rights
function authenticateHakAkses($username, $password) {
    global $conn;

    $username = $conn->real_escape_string($username);
    $password = $conn->real_escape_string($password);

    // Query to get user data along with access rights
    $sql = "SELECT u.nama_user,u.id_user,u.rumahsakit_id,u.hak_akses_id, h.* FROM user u 
            LEFT JOIN hak_akses h ON u.hak_akses_id = h.hak_akses_id
            WHERE u.username='$username' AND u.password='$password'";
    
    $result = $conn->query($sql);

    // If user found, return user data including access rights
    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        return array(
            'user' => $user,
            'access_rights' => array(
                'nama_hak_akses' => $user['nama_hak_akses'],
                'nama_lain_hak_akses' => $user['nama_lain_hak_akses'],
                'create' => (bool)$user['create'],
                'read' => (bool)$user['read'],
                'update' => (bool)$user['update'],
                'delete' => (bool)$user['delete']
                // Adjust these keys based on your actual column names in hak_akses table
            )
        );
    } else {
        return false;
    }
}

function validateToken($token) {
    global $conn;
    $token = $conn->real_escape_string($token);


// var_dump($token);die;
    $sql = "SELECT * FROM user WHERE token='$token'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        return true;
    } else {
        return false;
    }
}

// Custom function to get all headers if getallheaders is not available
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}
?>
