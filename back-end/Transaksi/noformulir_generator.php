<?php

function generateNoFormulir($kode_rumahsakit) {
    global $conn;

    // Fetch the hospital name
    $sql = "SELECT nama_rumahsakit FROM rumah_sakit WHERE kode_rumahsakit = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $kode_rumahsakit);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        error_log("Hospital not found for kode_rumahsakit: $kode_rumahsakit");
        return null; // Hospital not found
    }

    $row = $result->fetch_assoc();
    $nama_rumahsakit = $row['nama_rumahsakit'];
    $stmt->close();

    // Get the current date
    $bulan = date('m');
    $tahun = date('Y');

    // Get the current maximum transaksi_id
    $sql = "SELECT MAX(transaksi_id) AS max_id FROM transaksi_pelayanan";
    $result = $conn->query($sql);

    if ($result->num_rows == 0) {
        error_log("Could not fetch max_id value for table transaksi_pelayanan");
        return null; // Could not fetch max id value
    }

    $row = $result->fetch_assoc();
    $next_increment = $row['max_id'] + 1;

    // Generate the noformulir
    $noformulir = "FORMLKP{$next_increment}/{$nama_rumahsakit}/{$bulan}/{$tahun}";
    error_log("Generated noformulir: $noformulir");

    return $noformulir;
}

?>
