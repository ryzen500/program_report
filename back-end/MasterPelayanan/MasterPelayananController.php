<?php

// API endpoint untuk menampilkan semua data master_pelayanan

function getAllPelayananDetail($id) {
    global $conn;

    $sql = "SELECT * FROM master_pelayanan WHERE pelayanan_id = $id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $pelayanan = array();
        while ($row = $result->fetch_assoc()) {
            $pelayanan[] = $row;
        }
        sendResponse(200, $pelayanan);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
}

function getAllPelayanan() {
    global $conn;

    $sql = "SELECT * FROM master_pelayanan";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $pelayanan = array();
        while ($row = $result->fetch_assoc()) {
            $pelayanan[] = $row;
        }
        sendResponse(200, $pelayanan);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
}


// API endpoint untuk menambah data baru ke master_pelayanan
function addPelayanan() {
    global $conn;

    // Ambil data dari input JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    $nama_pelayanan = $input['nama_pelayanan'];

    // Query untuk menambah data baru
    $sql = "INSERT INTO master_pelayanan (nama_pelayanan) VALUES ('$nama_pelayanan')";
    if ($conn->query($sql) === TRUE) {
        sendResponse(201, array('message' => 'Data inserted successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to insert data'));
    }
}


// API endpoint untuk memperbarui data pada master_pelayanan berdasarkan pelayanan_id
function updatePelayanan($pelayanan_id) {
    global $conn;

    // Ambil data dari input JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    $nama_pelayanan = $input['nama_pelayanan'];

    // Query untuk memperbarui data
    $sql = "UPDATE master_pelayanan SET nama_pelayanan = '$nama_pelayanan' WHERE pelayanan_id = $pelayanan_id";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Data updated successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to update data'));
    }
}



// API endpoint untuk menghapus data pada master_pelayanan berdasarkan pelayanan_id
function deletePelayanan($pelayanan_id) {
    global $conn;

    // Query untuk menghapus data
    $sql = "DELETE FROM master_pelayanan WHERE pelayanan_id = $pelayanan_id";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Data deleted successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to delete data'));
    }
}


 ?>