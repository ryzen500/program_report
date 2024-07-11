<?php
// Function to create a new hak_akses entry
function createHakAkses($data) {
    global $conn;

    $nama_hak_akses = $conn->real_escape_string($data['nama_hak_akses']);
    $nama_lain_hak_akses = $conn->real_escape_string($data['nama_lain_hak_akses']);
    $create = $data['create'] ? 1 : 0;
    $read = $data['read'] ? 1 : 0;
    $update = $data['update'] ? 1 : 0;
    $delete = $data['delete'] ? 1 : 0;

    $sql = "INSERT INTO hak_akses (nama_hak_akses, nama_lain_hak_akses, `create`, `read`, `update`, `delete`) 
            VALUES ('$nama_hak_akses', '$nama_lain_hak_akses', $create, $read, $update, $delete)";

    if ($conn->query($sql) === TRUE) {
        sendResponse(201, array('message' => 'hak_akses created successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to create hak_akses: ' . $conn->error));
    }
}
// Function to read hak_akses entries
function readHakAkses() {
    global $conn;

    $sql = "SELECT * FROM hak_akses";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = array();
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        sendResponse(200, $data);
    } else {
        sendResponse(404, array('error' => 'No hak_akses found'));
    }
}

// Function to read hak_akses entries
function readHakAksesDetail($id) {
    global $conn;

    $sql = "SELECT * FROM hak_akses WHERE hak_akses_id = $id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = array();
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        sendResponse(200, $data);
    } else {
        sendResponse(404, array('error' => 'No hak_akses found'));
    }
}


function updateHakAkses($id, $data) {
    global $conn;

    $nama_hak_akses = $conn->real_escape_string($data['nama_hak_akses']);
    $nama_lain_hak_akses = $conn->real_escape_string($data['nama_lain_hak_akses']);
    $create = $data['create'] ? 1 : 0;
    $read = $data['read'] ? 1 : 0;
    $update = $data['update'] ? 1 : 0;
    $delete = $data['delete'] ? 1 : 0;

    $sql = "UPDATE hak_akses SET 
                nama_hak_akses='$nama_hak_akses', 
                nama_lain_hak_akses='$nama_lain_hak_akses',
                `create`=$create, 
                `read`=$read, 
                `update`=$update, 
                `delete`=$delete 
            WHERE hak_akses_id=$id";

    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'hak_akses updated successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to update hak_akses: ' . $conn->error));
    }
}

// Function to delete a hak_akses entry
function deleteHakAkses($id) {
    global $conn;

    $sql = "DELETE FROM hak_akses WHERE hak_akses_id=$id";

    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'hak_akses deleted successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to delete hak_akses: ' . $conn->error));
    }
}


 ?>