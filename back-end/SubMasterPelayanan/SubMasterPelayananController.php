<?php
// Fungsi untuk mendapatkan semua submaster_pelayanan
function getAllSubPelayanan() {
    global $conn;

    $sql = "SELECT master_pelayanan.nama_pelayanan as nama_pelayanan,master_pelayanan.pelayanan_id,submaster_pelayanan.nama_subpelayanan,submaster_pelayanan.subpelayanan_id FROM submaster_pelayanan LEFT JOIN master_pelayanan ON submaster_pelayanan.pelayanan_id =master_pelayanan.pelayanan_id";
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
function getSubPelayananDetail($subpelayanan_id) {
    global $conn;

    $sql = "SELECT master_pelayanan.nama_pelayanan as nama_pelayanan,master_pelayanan.pelayanan_id,submaster_pelayanan.nama_subpelayanan,submaster_pelayanan.subpelayanan_id FROM submaster_pelayanan LEFT JOIN master_pelayanan ON submaster_pelayanan.pelayanan_id =master_pelayanan.pelayanan_id WHERE subpelayanan_id = $subpelayanan_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $subPelayanan = $result->fetch_assoc();
        sendResponse(200, $subPelayanan);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
}


// Fungsi untuk mendapatkan detail submaster_pelayanan berdasarkan ID
function getSubPelayananDetailPerPoli($pelayanan_id) {
    global $conn;

    $sql = "SELECT master_pelayanan.nama_pelayanan AS nama_pelayanan, master_pelayanan.pelayanan_id, submaster_pelayanan.nama_subpelayanan, submaster_pelayanan.subpelayanan_id 
            FROM submaster_pelayanan 
            LEFT JOIN master_pelayanan ON submaster_pelayanan.pelayanan_id = master_pelayanan.pelayanan_id 
            WHERE master_pelayanan.pelayanan_id = $pelayanan_id";
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


function addSubPelayanan() {
    global $conn;

    // Ambil data dari input JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (!$input) {
        sendResponse(400, array('error' => 'Invalid JSON input'));
        return;
    }

    if (!isset($input['nama_subpelayanan']) || !isset($input['pelayanan_id'])) {
        sendResponse(400, array('error' => 'Missing required fields'));
        return;
    }

    $nama_subpelayanan = $input['nama_subpelayanan'];
    $pelayanan_id = $input['pelayanan_id'];

    // Query untuk menambah data baru
    $sql = "INSERT INTO submaster_pelayanan (nama_subpelayanan, pelayanan_id) VALUES ('$nama_subpelayanan', $pelayanan_id)";
    
    if ($conn->query($sql) === TRUE) {
        sendResponse(201, array('message' => 'Data inserted successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to insert data: ' . $conn->error));
    }
}

// Fungsi untuk memperbarui submaster_pelayanan berdasarkan ID
function updateSubPelayanan($subpelayanan_id) {
    global $conn;

    // Ambil data dari input JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    $nama_subpelayanan = $input['nama_subpelayanan'];
    $pelayanan_id = $input['pelayanan_id'];

    // Query untuk memperbarui data
    $sql = "UPDATE submaster_pelayanan SET nama_subpelayanan = '$nama_subpelayanan', pelayanan_id = $pelayanan_id WHERE subpelayanan_id = $subpelayanan_id";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Data updated successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to update data'));
    }
}

// Fungsi untuk menghapus submaster_pelayanan berdasarkan ID
function deleteSubPelayanan($subpelayanan_id) {
    global $conn;

    // Query untuk menghapus data
    $sql = "DELETE FROM submaster_pelayanan WHERE subpelayanan_id = $subpelayanan_id";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Data deleted successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to delete data'));
    }
}
?>

