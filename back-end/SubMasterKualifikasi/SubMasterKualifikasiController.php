<?php
// Fungsi untuk mendapatkan semua submaster_pelayanan
function getAllSubKualifikasi() {
    global $conn;

    $sql = "SELECT master_kualifikasi.nama_kualifikasi as nama_kualifikasi,master_kualifikasi.kualifikasi_id,submaster_kualifikasi.nama_subkualifikasi,submaster_kualifikasi.subkualifikasi_id FROM submaster_kualifikasi LEFT JOIN master_kualifikasi ON submaster_kualifikasi.kualifikasi_id =master_kualifikasi.kualifikasi_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $subPelayanan = array();
        while ($row = $result->fetch_assoc()) {
            $subPelayanan[] = $row;
        }
        sendResponse(200, $subPelayanan);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
}

// Fungsi untuk mendapatkan detail submaster_pelayanan berdasarkan ID
function getSubKualifikasiDetail($subkualifikasi_id) {
    global $conn;

    $sql = "SELECT master_kualifikasi.nama_kualifikasi as nama_kualifikasi,master_kualifikasi.kualifikasi_id,submaster_kualifikasi.nama_subkualifikasi,submaster_kualifikasi.subkualifikasi_id FROM submaster_kualifikasi LEFT JOIN master_kualifikasi ON submaster_kualifikasi.kualifikasi_id =master_kualifikasi.kualifikasi_id WHERE subkualifikasi_id = $subkualifikasi_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $subPelayanan = $result->fetch_assoc();
        sendResponse(200, $subPelayanan);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
}


// Fungsi untuk mendapatkan detail submaster_pelayanan berdasarkan ID
function getSubKualifikasiDetailPerPoli($kualifikasi_id) {
    global $conn;

    $sql = "SELECT master_kualifikasi.nama_kualifikasi as nama_kualifikasi,master_kualifikasi.kualifikasi_id,submaster_kualifikasi.nama_subkualifikasi,submaster_kualifikasi.subkualifikasi_id FROM submaster_kualifikasi LEFT JOIN master_kualifikasi ON submaster_kualifikasi.kualifikasi_id =master_kualifikasi.kualifikasi_id

            WHERE master_kualifikasi.kualifikasi_id = $kualifikasi_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $subPelayananList = array();
        while ($row = $result->fetch_assoc()) {
            $subPelayananList[] = $row;
        }
        sendResponse(200, $subPelayananList);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
}


function addSubKualifikasi() {
    global $conn;

    // Ambil data dari input JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (!$input) {
        sendResponse(400, array('error' => 'Invalid JSON input'));
        return;
    }

    if (!isset($input['nama_subkualifikasi']) || !isset($input['kualifikasi_id'])) {
        sendResponse(400, array('error' => 'Missing required fields'));
        return;
    }

    $nama_subkualifikasi = $input['nama_subkualifikasi'];
    $kualifikasi_id = $input['kualifikasi_id'];

    // Query untuk menambah data baru
    $sql = "INSERT INTO submaster_kualifikasi (nama_subkualifikasi, subkualifikasi_id) VALUES ('$nama_subkualifikasi', $subkualifikasi_id)";
    
    if ($conn->query($sql) === TRUE) {
        sendResponse(201, array('message' => 'Data inserted successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to insert data: ' . $conn->error));
    }
}

// Fungsi untuk memperbarui submaster_pelayanan berdasarkan ID
function updateSubKualifikasi($subpelayanan_id) {
    global $conn;

    // Ambil data dari input JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

     $nama_subkualifikasi = $input['nama_subkualifikasi'];
    $kualifikasi_id = $input['kualifikasi_id'];
    // Query untuk memperbarui data
    $sql = "UPDATE submaster_kualifikasi SET nama_subkualifikasi = '$nama_subkualifikasi', subkualifikasi_id = $subkualifikasi_id WHERE subkualifikasi_id = $subkualifikasi_id";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Data updated successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to update data'));
    }
}

// Fungsi untuk menghapus submaster_pelayanan berdasarkan ID
function deleteSubKualifikasi($subkualifikasi_id) {
    global $conn;

    // Query untuk menghapus data
    $sql = "DELETE FROM submaster_kualifikasi WHERE subkualifikasi_id = $subkualifikasi_id";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Data deleted successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to delete data'));
    }
}
?>

