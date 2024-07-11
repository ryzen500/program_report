<?php

// Database configuration and connection (if not already included in config.php)
require_once 'noformulir_generator.php';
// Function to generate and return the noformulir
function getNoFormulir() {
    global $conn;

    // Get JSON input
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (!$input) {
        sendResponse(400, array('error' => 'Invalid JSON input'));
        return;
    }

    $kode_rumahsakit = $input['kode_rumahsakit'];

    // Generate the noformulir
    $noformulir = generateNoFormulir($kode_rumahsakit);

    // if (!$noformulir) {
    //     sendResponse(404, array('error' => 'Failed to generate noformulir'));
    //     return;
    // }

    // Return the generated noformulir
    sendResponse(200, array('noformulir' => $noformulir));
}


// Function to add a new transaction
function addTransaksi() {
    global $conn;

    // Get JSON input
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (!$input) {
        sendResponse(400, array('error' => 'Invalid JSON input'));
        return;
    }


echo "<pre>";var_dump($input);die;
    $kode_rumahsakit = $input['kode_rumahsakit'];
    $tanggal_transaksi = $input['tanggal_transaksi'];
    $keterangan = $input['keterangan'];
    $details = $input['details'];

    // Generate the noformulir
    $noformulir = generateNoFormulir($kode_rumahsakit);

    // Return the generated noformulir
    // sendResponse(200, array('noformulir' => $noformulir));

    // Insert the transaction and get the last insert id
    $sql = "INSERT INTO transaksi_pelayanan (noformulir, kode_rumahsakit, tanggal_transaksi, keterangan) VALUES ('$noformulir', $kode_rumahsakit, '$tanggal_transaksi', '$keterangan')";
    if ($conn->query($sql) === TRUE) {
        $transaksi_id = $conn->insert_id;

        // Insert transaction details
        foreach ($details as $detail) {
            $subpelayanan_id = $detail['subpelayanan_id'];
            $pelayanan_id = $detail['pelayanan_id'];
            $detail_tanggal_transaksi = $detail['tanggal_transaksi'];
            $jumlah = $detail['jumlah'];
            $detail_keterangan = '-';

            $sql = "INSERT INTO transaksidetail_pelayanan (transaksi_id, subpelayanan_id, pelayanan_id, tanggal_transaksi, jumlah, keterangan, kode_rumahsakit) VALUES ($transaksi_id, $subpelayanan_id, $pelayanan_id, '$detail_tanggal_transaksi', $jumlah, '$detail_keterangan', $kode_rumahsakit)";
            if ($conn->query($sql) !== TRUE) {
                sendResponse(500, array('error' => 'Failed to insert transaction detail: ' . $conn->error));
                return;
            }
        }

        sendResponse(201, array('message' => 'Transaction added successfully', 'noformulir' => $noformulir));
    } else {
        sendResponse(500, array('error' => 'Failed to insert transaction: ' . $conn->error));
    }
}

?>
