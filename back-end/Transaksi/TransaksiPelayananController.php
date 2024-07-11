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

    sendResponse(200, array('noformulir' => $noformulir));
}

function addTotalPoliKlinik(){
    global $conn;

    $sql = "SELECT count(jumlah) as total from transaksidetail_pelayanan tp WHERE pelayanan_id  = 3 ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $totalpoli = array();
        while ($row = $result->fetch_assoc()) {
            $totalpoli[] = $row;
        }
        sendResponse(200, $totalpoli);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
}


function addTotalPoliIGD(){
    global $conn;

    $sql = "SELECT count(jumlah) as total from transaksidetail_pelayanan tp WHERE pelayanan_id  = 8 ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $totalpoli = array();
        while ($row = $result->fetch_assoc()) {
            $totalpoli[] = $row;
        }
        sendResponse(200, $totalpoli);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
}

// Fungsi untuk mengambil data grafik
function getChartData() {
    global $conn;

    $query = "
        SELECT 
            rs.nama_rumahsakit AS nama_rumahsakit,
            DATE_FORMAT(tp.tanggal_transaksi, '%Y-%m') AS bulan,
            COUNT(tp.transaksidetail_pelayanan_id) AS total_pemeriksaan
        FROM 
            transaksidetail_pelayanan tp
        JOIN 
            rumah_sakit rs ON tp.kode_rumahsakit = rs.kode_rumahsakit
        GROUP BY 
            rs.nama_rumahsakit, bulan
        ORDER BY 
            bulan, rs.nama_rumahsakit;
    ";
    
    $result = $conn->query($query);
    $data = [];

    if ($result->num_rows > 0) {
        // Inisialisasi array untuk menyimpan data yang digabungkan
        $combinedData = [];

        while ($row = $result->fetch_assoc()) {
            $nama_rumahsakit = $row['nama_rumahsakit'];
            $bulan = $row['bulan'];
            $total_pemeriksaan = (int)$row['total_pemeriksaan'];

            // Jika sudah ada data untuk rumah sakit ini, tambahkan total pemeriksaan ke bulan yang sesuai
            if (isset($combinedData[$nama_rumahsakit])) {
                $combinedData[$nama_rumahsakit]['data'][] = $total_pemeriksaan;
            } else {
                // Jika belum ada data untuk rumah sakit ini, buat entri baru
                $combinedData[$nama_rumahsakit] = [
                    'name' => $nama_rumahsakit,
                    'data' => [$total_pemeriksaan]
                ];
            }
        }

        // Ubah array asosiatif ke array numerik untuk memastikan urutan yang benar
        $data = array_values($combinedData);

        sendResponse(200, $data);
    } else {
        sendResponse(404, ['error' => 'Data not found']);
    }
}


function getReportData($year) {
    global $conn;

    $query = $conn->prepare("
        SELECT td.subpelayanan_id, td.pelayanan_id, mp.nama_pelayanan, smp.nama_subpelayanan, td.tanggal_transaksi, td.jumlah, td.keterangan, td.kode_rumahsakit
        FROM transaksidetail_pelayanan td
        JOIN master_pelayanan mp ON td.pelayanan_id = mp.pelayanan_id
        JOIN submaster_pelayanan smp ON td.subpelayanan_id = smp.subpelayanan_id
        WHERE YEAR(td.tanggal_transaksi) = ? OR YEAR(td.tanggal_transaksi) = ? 
    ");
    $nextYear = $year + 1;
    $query->bind_param("ii", $year, $nextYear);
    $query->execute();
    $result = $query->get_result();

    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $query->close();

    // Structure the data
    $groupedData = array();

    foreach ($data as $row) {
        $mainService = $row['nama_pelayanan'];
        $subService = $row['nama_subpelayanan'];
        if (!isset($groupedData[$mainService])) {
            $groupedData[$mainService] = [];
        }
        if (!isset($groupedData[$mainService][$subService])) {
            $groupedData[$mainService][$subService] = array(
                (string)$year => array('total' => 0, 'count' => 0),
                (string)$nextYear => array_fill(0, 12, 0),
                'jumlah' => 0
            );
        }

        $date = new DateTime($row['tanggal_transaksi']);
        if ($date->format('Y') == $year) {
            $groupedData[$mainService][$subService][$year]['total'] += $row['jumlah'];
            $groupedData[$mainService][$subService][$year]['count']++;
        } elseif ($date->format('Y') == $nextYear) {
            $month = (int)$date->format('m') - 1;
            $groupedData[$mainService][$subService][$nextYear][$month] += $row['jumlah'];
        }

        $groupedData[$mainService][$subService]['jumlah'] += $row['jumlah'];
    }

    // Calculate average for the specified year
    foreach ($groupedData as $mainService => &$subServices) {
        foreach ($subServices as &$item) {
            if ($item[$year]['count'] > 0) {
                $item[$year]['average'] = $item[$year]['total'] / $item[$year]['count'];
            } else {
                $item[$year]['average'] = 0;
            }
        }
    }

    // Flatten the data
    $flattenedData = array();
    foreach ($groupedData as $mainService => $subServices) {
        foreach ($subServices as $subService => $item) {
            $flattenedData[] = array(
                'nama_pelayanan' => $mainService,
                'nama_subpelayanan' => $subService,
                'jumlahTahun' => $item[$year]['total'],
                'rataRataBulan' => $item[$year]['average'],
                'bulanTahunDepan' => $item[$nextYear],
                'jumlah' => $item['jumlah']
            );
        }
    }

    // header('Content-Type: application/json');
    // echo json_encode($flattenedData);

            sendResponse(201, $flattenedData);

}


function getReportDataNextYear($year) {
    global $conn;

    // Prepare query to fetch data for the specified year and the next year
    $query = $conn->prepare("
        SELECT td.subpelayanan_id, td.pelayanan_id, mp.nama_pelayanan, td.tanggal_transaksi, td.jumlah, td.keterangan, td.kode_rumahsakit
        FROM transaksidetail_pelayanan td
        JOIN master_pelayanan mp ON td.pelayanan_id = mp.pelayanan_id
        WHERE YEAR(td.tanggal_transaksi) = ? OR YEAR(td.tanggal_transaksi) = ?
    ");
    $nextYear = $year + 1;
    $query->bind_param("ii", $year, $nextYear);
    $query->execute();
    $result = $query->get_result();

    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $query->close();

    // Structure the data
    $groupedData = array();

    foreach ($data as $row) {
        $key = $row['nama_pelayanan'];
        if (!isset($groupedData[$key])) {
            $groupedData[$key] = array(
                (string)$year => array('total' => 0, 'count' => 0),
                (string)$nextYear => array_fill(0, 12, 0),
                'jumlah' => 0
            );
        }

        $date = new DateTime($row['tanggal_transaksi']);
        if ($date->format('Y') == $year) {
            $groupedData[$key][$year]['total'] += $row['jumlah'];
            $groupedData[$key][$year]['count']++;
        } elseif ($date->format('Y') == $nextYear) {
            $month = (int)$date->format('m') - 1;
            $groupedData[$key][$nextYear][$month] += $row['jumlah'];
        }

        $groupedData[$key]['jumlah'] += $row['jumlah'];
    }

    // Calculate average for the specified year
    foreach ($groupedData as &$item) {
        if ($item[$year]['count'] > 0) {
            $item[$year]['average'] = $item[$year]['total'] / $item[$year]['count'];
        } else {
            $item[$year]['average'] = 0;
        }
    }

    // Format the response
    $response = array();
    foreach ($groupedData as $key => $item) {
        $response[] = array(
            'nama_pelayanan' => $key,
            'jumlahTahun' => $item[$year]['total'],
            'rataRataBulan' => $item[$year]['average'],
            'bulanTahunDepan' => $item[$nextYear],
            'jumlah' => $item['jumlah']
        );
    }

    sendResponse(200, $response);
}

function addTotalPoliFisio(){
    global $conn;

    $sql = "SELECT count(jumlah) as total from transaksidetail_pelayanan tp WHERE pelayanan_id  = 9 ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $totalpoli = array();
        while ($row = $result->fetch_assoc()) {
            $totalpoli[] = $row;
        }
        sendResponse(200, $totalpoli);
    } else {
        sendResponse(404, array('error' => 'Data not found'));
    }
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

    // Debugging input JSON
    // echo "<pre>"; var_dump($input); die;

    $kode_rumahsakit = $input['kode_rumahsakit'];
    $tanggal_transaksi = $input['tanggal_transaksi'];
    $keterangan = $input['keterangan'];
    $details = $input['details'];

    // Generate the noformulir
    $noformulir = generateNoFormulir($kode_rumahsakit);

    // Insert the transaction and get the last insert id
    $sql = "INSERT INTO transaksi_pelayanan (noformulir, kode_rumahsakit, tanggal_transaksi, keterangan) VALUES ('$noformulir', $kode_rumahsakit, '$tanggal_transaksi', '$keterangan')";
        // echo "<pre>"; var_dump($sql); die;

    if ($conn->query($sql) === TRUE) {
        $transaksi_id = $conn->insert_id;

        // Insert transaction details
        foreach ($details as $detail) {
            if (is_null($detail)) {
                continue; // Skip null entries
            }

            $subpelayanan_id = $detail['subpelayanan_id'];
            $pelayanan_id = isset($detail['pelayanan_id']) ? $detail['pelayanan_id'] : 'NULL';
            $detail_tanggal_transaksi = $detail['tanggal_transaksi'];
            $jumlah = $detail['jumlah'];
            $detail_keterangan = isset($detail['keterangan']) ? $detail['keterangan'] : '-';

            $sql = "INSERT INTO transaksidetail_pelayanan (transaksi_id, subpelayanan_id, pelayanan_id, tanggal_transaksi, jumlah, keterangan, kode_rumahsakit) VALUES ($transaksi_id, $subpelayanan_id, $pelayanan_id, '$detail_tanggal_transaksi', $jumlah, '$detail_keterangan', $kode_rumahsakit)";
            
            // Debugging each SQL query
            // echo "<pre>"; var_dump($sql); die;


            if ($conn->query($sql) !== TRUE) {
                // echo "Fuck";die;
                sendResponse(500, array('error' => 'Failed to insert transaction detail: ' . $conn->error));
                return;
            }
        }

        sendResponse(201, array('message' => 'Transaction added successfully', 'noformulir' => $noformulir));
    } else {
        // echo "Tes";die;
        sendResponse(500, array('error' => 'Failed to insert transaction: ' . $conn->error));
    }
}

?>
