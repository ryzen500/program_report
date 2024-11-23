<?php  

require 'vendor/autoload.php';
use PaginationLibrary\Pagination;


// Function to handle Rumah Sakit CRUD operations
function createRumahSakit($data) {
    global $conn;
    // $kode_rumahsakit = $conn->real_escape_string($data['kode_rumahsakit']);
    $nama_rumahsakit = $conn->real_escape_string($data['nama_rumahsakit']);
    $kode_bpjs_rumahsakit = $conn->real_escape_string($data['kode_bpjs_rumahsakit']);

    // $sql = "INSERT INTO rumah_sakit (kode_rumahsakit, nama_rumahsakit, kode_bpjs_rumahsakit) VALUES ('$kode_rumahsakit', '$nama_rumahsakit', '$kode_bpjs_rumahsakit')";


// var_dump($data);die;
      $sql = "INSERT INTO rumah_sakit (nama_rumahsakit, kode_bpjs_rumahsakit) VALUES ('$nama_rumahsakit', '$kode_bpjs_rumahsakit')";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Rumah Sakit created successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to create Rumah Sakit'));
    }
}


function readRumahSakitDetail($id) {
    global $conn;
    $sql = "SELECT * FROM rumah_sakit WHERE kode_rumahsakit = $id";
    $result = $conn->query($sql);

    $rumah_sakit = array();
    while ($row = $result->fetch_assoc()) {
        $rumah_sakit[] = $row;
    }

    sendResponse(200, $rumah_sakit);
}


function readRumahSakit($page = 2, $itemsPerPage = 1) {
    global $conn;

    // Hitung total item dari tabel rumah_sakit
    $countSql = "SELECT COUNT(*) AS total FROM rumah_sakit";
    $countResult = $conn->query($countSql);
    $totalItems = $countResult->fetch_assoc()['total'];

    // Inisialisasi pagination
    $pagination = new Pagination($totalItems, $itemsPerPage, $page);

    // Ambil data dengan offset dan limit sesuai halaman
    $offset = $pagination->getOffset();
    $limit = $pagination->getLimit();

    $sql = "SELECT * FROM rumah_sakit LIMIT $limit OFFSET $offset";
    $result = $conn->query($sql);

    $rumah_sakit = array();
    while ($row = $result->fetch_assoc()) {
        $rumah_sakit[] = $row;
    }

    // Response dengan data dan informasi pagination
    $response = [
        'pagination' => $pagination->getPaginationInfo(),
        'data' => $rumah_sakit,
    ];

    sendResponse(200, $response);
}


function updateRumahSakit($kode_rumahsakit, $data) {
    global $conn;
    $nama_rumahsakit = $conn->real_escape_string($data['nama_rumahsakit']);
    $kode_bpjs_rumahsakit = $conn->real_escape_string($data['kode_bpjs_rumahsakit']);

    $sql = "UPDATE rumah_sakit SET nama_rumahsakit='$nama_rumahsakit', kode_bpjs_rumahsakit='$kode_bpjs_rumahsakit' WHERE kode_rumahsakit='$kode_rumahsakit'";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Rumah Sakit updated successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to update Rumah Sakit'));
    }
}

function deleteRumahSakit($kode_rumahsakit) {
    global $conn;
    $sql = "DELETE FROM rumah_sakit WHERE kode_rumahsakit=$kode_rumahsakit";
    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Rumah Sakit deleted successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to delete Rumah Sakit'));
    }
}

?>