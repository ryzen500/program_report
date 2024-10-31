<?php

// API endpoint untuk menampilkan semua data master_kualifikasi
function getAllKualifikasi() {
    global $conn;

    $sql = "SELECT * FROM master_kualifikasi";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $kualifikasi = array();
        while ($row = $result->fetch_assoc()) {
            $kualifikasi[] = $row;
        }
        sendResponse(200, $kualifikasi);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
}

// API endpoint untuk menampilkan detail kualifikasi berdasarkan kualifikasi_id
function getKualifikasiDetail($kualifikasi_id) {
    global $conn;

    $sql = "SELECT * FROM master_kualifikasi WHERE kualifikasi_id = $kualifikasi_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $kualifikasi = $result->fetch_assoc();
        sendResponse(200, $kualifikasi);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
}

// API endpoint untuk menambah data baru ke master_kualifikasi
function addKualifikasi() {
    global $conn;

    // Ambil data dari input JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    $nama_kualifikasi = $input['nama_kualifikasi'];

    // Query untuk menambah data baru
    $sql = "INSERT INTO master_kualifikasi (nama_kualifikasi) VALUES ('$nama_kualifikasi')";
    if ($conn->query($sql) === TRUE) {
        sendResponse(201, array('message' => 'Data inserted successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to insert data'));
    }
}

// API endpoint untuk memperbarui data pada master_kualifikasi berdasarkan kualifikasi_id
function updateKualifikasi($kualifikasi_id) {
    global $conn;

    // Ambil data dari input JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    $nama_kualifikasi = $input['nama_kualifikasi'];

    // Query untuk memperbarui data
    $sql = "UPDATE master_kualifikasi SET nama_kualifikasi = '$nama_kualifikasi' WHERE kualifikasi_id = $kualifikasi_id";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Data updated successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to update data'));
    }
}

// API endpoint untuk menghapus data pada master_kualifikasi berdasarkan kualifikasi_id
function deleteKualifikasi($kualifikasi_id) {
    global $conn;

    // Query untuk menghapus data
    $sql = "DELETE FROM master_kualifikasi WHERE kualifikasi_id = $kualifikasi_id";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Data deleted successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to delete data'));
    }
}

?>
