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

// Function to read hak_akses entries
function readTransaksiPelayanan() {
    global $conn;

    $sql = "SELECT  rs.nama_rumahsakit as nama_rumahsakit ,tp.* from transaksi_pelayanan tp left join rumah_sakit rs ON tp.kode_rumahsakit = rs.kode_rumahsakit WHERE is_deleted = false";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = array();
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        sendResponse(200, $data);
    } else {
        sendResponse(404, array('error' => 'Tidak Ada Transaksi Pelayanan yang ditemukan'));
    }
}

// Persentase Perubahan Bulanan:

// Persentase Perubahan=(previousMonthValuetotal_pemeriksaan−previousMonthValue​)×100

// Perbandingan Persentase Keseluruhan Antara Rumah Sakit:

// Overall Percentage Change=(totalExam1totalExam2−totalExam1​)×100
function getChartData() {
    global $conn;

    // Define the months (categories) to be included in the chart
    $months = [
        "01" => "JAN", "02" => "FEB", "03" => "MAR", 
        "04" => "APR", "05" => "MAY", "06" => "JUN", 
        "07" => "JUL", "08" => "AUG", "09" => "SEP", 
        "10" => "OCT", "11" => "NOV", "12" => "DEC"
    ];
    
    $tahun = date("Y");
    $query = "
        SELECT 
            rs.nama_rumahsakit AS nama_rumahsakit,
            DATE_FORMAT(tp.tanggal_transaksi, '%Y-%m') AS bulan,
            COUNT(tp.transaksidetail_pelayanan_id) AS total_pemeriksaan
        FROM 
            transaksidetail_pelayanan tp
        JOIN 
            rumah_sakit rs ON tp.kode_rumahsakit = rs.kode_rumahsakit
              WHERE YEAR(tp.tanggal_transaksi) = '$tahun'
        GROUP BY 
            rs.nama_rumahsakit, bulan
        ORDER BY 
            bulan, rs.nama_rumahsakit;
    ";

    $result = $conn->query($query);
    $data = [];

    if ($result->num_rows > 0) {
        // Initialize array to store combined data
        $combinedData = [];
        $totalExaminations = [];

        while ($row = $result->fetch_assoc()) {
            $nama_rumahsakit = $row['nama_rumahsakit'];
            $bulan = $row['bulan'];
            $monthNumber = substr($bulan, 5, 2);
            $total_pemeriksaan = (int)$row['total_pemeriksaan'];

            // Initialize data with zeros for all months if not set
            if (!isset($combinedData[$nama_rumahsakit])) {
                $combinedData[$nama_rumahsakit] = [
                    'name' => $nama_rumahsakit,
                    'data' => array_fill(0, count($months), 0),
                    'changes' => array_fill(0, count($months), 0)
                ];
                $totalExaminations[$nama_rumahsakit] = 0;
            }

            // Find the index of the current month and set the total pemeriksaan
            $monthIndex = array_search($months[$monthNumber], array_values($months));
            if ($monthIndex !== false) {
                $combinedData[$nama_rumahsakit]['data'][$monthIndex] = $total_pemeriksaan;

                // Calculate the percentage change from the previous month
                if ($monthIndex > 0) {
                    $previousMonthValue = $combinedData[$nama_rumahsakit]['data'][$monthIndex - 1];
                    if ($previousMonthValue != 0) {
                        $percentageChange = (($total_pemeriksaan - $previousMonthValue) / $previousMonthValue) * 100;
                        $combinedData[$nama_rumahsakit]['changes'][$monthIndex] = round($percentageChange, 2);
                    }
                }

                // Accumulate total examinations for comparison
                $totalExaminations[$nama_rumahsakit] += $total_pemeriksaan;
            }
        }

        // Calculate the overall percentage comparison between hospitals
        $hospitalNames = array_keys($totalExaminations);
        if (count($hospitalNames) >= 2) {
            $totalExam1 = $totalExaminations[$hospitalNames[0]];
            $totalExam2 = $totalExaminations[$hospitalNames[1]];

            if ($totalExam1 != 0) {
                $overallPercentageChange = (($totalExam2 - $totalExam1) / $totalExam1) * 100;
            } else {
                $overallPercentageChange = ($totalExam2 > 0) ? 100 : 0;
            }
        } else {
            $overallPercentageChange = 0;
        }

        // Convert associative array to numeric array for proper ordering
        $data = array_values($combinedData);

        sendResponse(200, [
            'categories' => array_values($months), 
            'series' => $data,
            'overall_percentage_change' => round($overallPercentageChange, 2)
        ]);
    } else {
        sendResponse(404, ['error' => 'Data not found']);
    }
}

function getWeeklyChartData() {
    global $conn;

    // Define the months (categories) to be included in the chart
    $months = [
        "01" => "JAN", "02" => "FEB", "03" => "MAR", 
        "04" => "APR", "05" => "MAY", "06" => "JUN", 
        "07" => "JUL", "08" => "AUG", "09" => "SEP", 
        "10" => "OCT", "11" => "NOV", "12" => "DEC"
    ];
    
    $query = "
        SELECT 
            sp.nama_subpelayanan AS nama_subpelayanan,
            rs.nama_rumahsakit AS nama_rumahsakit,
            DATE_FORMAT(tp.tanggal_transaksi, '%Y-%m') AS bulan,
            SUM(tp.jumlah) AS total_transaksi  
        FROM 
            transaksidetail_pelayanan tp
        JOIN 
            submaster_pelayanan sp ON tp.subpelayanan_id = sp.subpelayanan_id
        JOIN 
            master_pelayanan mp ON sp.pelayanan_id = mp.pelayanan_id
        JOIN 
            rumah_sakit rs ON tp.kode_rumahsakit = rs.kode_rumahsakit

                        WHERE YEAR(tp.tanggal_transaksi) = '2024' AND soft_delete is false

        GROUP BY 
            sp.nama_subpelayanan, rs.nama_rumahsakit, DATE_FORMAT(tp.tanggal_transaksi, '%Y-%m')
        ORDER BY 
            DATE_FORMAT(tp.tanggal_transaksi, '%Y-%m'), sp.nama_subpelayanan;
    ";
    
    $result = $conn->query($query);
    $data = [];

    if ($result->num_rows > 0) {
        // Initialize array for combined data
        $combinedData = [];

        while ($row = $result->fetch_assoc()) {
            $nama_subpelayanan = $row['nama_subpelayanan'];
            $nama_rumahsakit = $row['nama_rumahsakit'];
            $bulan = $row['bulan'];
            $monthNumber = substr($bulan, 5, 2);
            $total_transaksi = (float) $row['total_transaksi'];

            // If data for this subpelayanan exists, add total_transaksi to the corresponding month
            if (!isset($combinedData[$nama_subpelayanan])) {
                // Initialize data with zeros for all months
                $combinedData[$nama_subpelayanan] = [
                    'name' => $nama_subpelayanan,
                    'data' => array_fill(0, count($months), 0)
                ];
            }

            // Find the index of the current month and set the total_transaksi
            $monthIndex = array_search($months[$monthNumber], array_values($months));
            if ($monthIndex !== false) {
                $combinedData[$nama_subpelayanan]['data'][$monthIndex] += $total_transaksi;
            }
        }

        // Convert associative array to numeric array to ensure correct order
        $data = array_values($combinedData);

        // Prepare response with categories (rumah sakit) and series (data)
        $categories = array_values(array_unique(array_column($data, 'nama_rumahsakit')));
        $series = [];

        foreach ($data as $item) {
            $series[] = [
                'name' => $item['name'],
                'data' => $item['data']
            ];
        }

        sendResponse(200, ['categories' => $categories, 'series' => $series]);
    } else {
        sendResponse(404, ['error' => 'Data not found']);
    }
}

function getPieChartData() {
   global $conn;

    $query = "
        SELECT 
            mp.nama_pelayanan AS pelayanan,
            COUNT(tp.transaksidetail_pelayanan_id) AS total
        FROM 
            transaksidetail_pelayanan tp
        JOIN 
            master_pelayanan mp ON tp.pelayanan_id = mp.pelayanan_id
        GROUP BY 
            mp.nama_pelayanan
    ";

    $result = $conn->query($query);
    $data = [];

    if ($result->num_rows > 0) {
        $labels = [];
        $series = [];

        while ($row = $result->fetch_assoc()) {
            $labels[] = $row['pelayanan'];
            $series[] = (int)$row['total'];
        }

        $data = [
            'labels' => $labels,
            'series' => $series
        ];

        sendResponse(200, $data);
    } else {
        sendResponse(404, ['error' => 'Data not found']);
    }
}


function softDeleteHapusTransaksiPelayanan($id) {
    global $conn;

    $sql = "UPDATE transaksi_pelayanan SET 
                is_deleted = true
            WHERE transaksi_id=$id";

            // $id

    if ($conn->query($sql) === TRUE) {
        sendResponse(200, array('message' => 'Soft Delete Transaksi Terhapus'));
    } else {
        sendResponse(500, array('error' => 'Failed to update hak_akses: ' . $conn->error));
    }
}

function getReportData($year) {
    global $conn;

    $query = $conn->prepare("
        SELECT td.subpelayanan_id, td.pelayanan_id, mp.nama_pelayanan, smp.nama_subpelayanan, td.tanggal_transaksi, td.jumlah, td.keterangan, td.kode_rumahsakit
        FROM transaksidetail_pelayanan td
        JOIN master_pelayanan mp ON td.pelayanan_id = mp.pelayanan_id
        JOIN submaster_pelayanan smp ON td.subpelayanan_id = smp.subpelayanan_id
        WHERE YEAR(td.tanggal_transaksi) = ? OR YEAR(td.tanggal_transaksi) = ? AND soft_delete is false
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



// Fungsi untuk mendapatkan detail submaster_pelayanan berdasarkan ID
function getSubTransaksiPelayananDetailPerPoli($pelayanan_id, $transaksi_id) {
    global $conn;

    $sql = "SELECT  *,submaster_pelayanan.nama_subpelayanan 
            FROM transaksidetail_pelayanan 
            LEFT JOIN master_pelayanan ON transaksidetail_pelayanan.pelayanan_id = master_pelayanan.pelayanan_id 
            LEFT JOIN submaster_pelayanan ON transaksidetail_pelayanan.subpelayanan_id = submaster_pelayanan.subpelayanan_id
            WHERE master_pelayanan.pelayanan_id = $pelayanan_id AND transaksidetail_pelayanan.transaksi_id = $transaksi_id AND soft_delete is false";
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


// function getReportDataByTransaksiId($year, $transaksiId) {
//     global $conn;

//     $query = $conn->prepare("
//         SELECT td.transaksi_id,td.subpelayanan_id, td.pelayanan_id, mp.nama_pelayanan, smp.nama_subpelayanan, td.tanggal_transaksi, td.jumlah, td.keterangan, td.kode_rumahsakit, tp.noformulir
//         FROM transaksidetail_pelayanan td
//         JOIN master_pelayanan mp ON td.pelayanan_id = mp.pelayanan_id
//         JOIN submaster_pelayanan smp ON td.subpelayanan_id = smp.subpelayanan_id
//         JOIN transaksi_pelayanan tp ON td.transaksi_id = tp.transaksi_id
//         WHERE (YEAR(td.tanggal_transaksi) = ? OR YEAR(td.tanggal_transaksi) = ?) AND td.transaksi_id = ?
//     ");

//       if (!$query) {
//         // Get the error message
//         $error = $conn->error;
//         sendResponse(500, ["error" => "Failed to prepare SQL query: $error"]);
//         return;
//     }
//     $nextYear = $year + 1;
//     $query->bind_param("iii", $year, $nextYear, $transaksiId);
//     $query->execute();
//     $result = $query->get_result();

//     $data = array();
//     while ($row = $result->fetch_assoc()) {
//         $data[] = $row;
//     }

//     $query->close();

//     // Structure the data
//     $groupedData = array();

//     foreach ($data as $row) {
//         $mainService = $row['nama_pelayanan'];
//         $subService = $row['nama_subpelayanan'];
//         $transaksiIds = $row['transaksi_id'];
//         $PelayananIDs = $row['pelayanan_id'];

//         $noFormulir = $row['noformulir'];  // Get noformulir from row data
//         if (!isset($groupedData[$mainService])) {
//             $groupedData[$mainService] = [];
//         }
//         if (!isset($groupedData[$mainService][$subService])) {
//             $groupedData[$mainService][$subService] = array(
//                 (string)$year => array('total' => 0, 'count' => 0),
//                 (string)$nextYear => array_fill(0, 12, 0),
//                 'jumlah' => 0,
//                 'noformulir' => $noFormulir  // Add noformulir to the structure
//             );
//         }

//         $date = new DateTime($row['tanggal_transaksi']);
//         if ($date->format('Y') == $year) {
//             $groupedData[$mainService][$subService][$year]['total'] += $row['jumlah'];
//             $groupedData[$mainService][$subService][$year]['count']++;
//         } elseif ($date->format('Y') == $nextYear) {
//             $month = (int)$date->format('m') - 1;
//             $groupedData[$mainService][$subService][$nextYear][$month] += $row['jumlah'];
//         }

//         $groupedData[$mainService][$subService]['jumlah'] += $row['jumlah'];
//     }

//     // Calculate average for the specified year
//     foreach ($groupedData as $mainService => &$subServices) {
//         foreach ($subServices as &$item) {
//             if ($item[$year]['count'] > 0) {
//                 $item[$year]['average'] = $item[$year]['total'] / $item[$year]['count'];
//             } else {
//                 $item[$year]['average'] = 0;
//             }
//         }
//     }

//     // Flatten the data
//     $flattenedData = array();
//     foreach ($groupedData as $mainService => $subServices) {
//         foreach ($subServices as $subService => $item) {
//             $flattenedData[] = array(
//                 'nama_pelayanan' => $mainService,
//                 'transaksi_id'=>$transaksiIds,
//                 'nama_subpelayanan' => $subService,
//                 'pelayanan_id'=>$PelayananIDs,
//                 'jumlahTahun' => $item[$year]['total'],
//                 'rataRataBulan' => $item[$year]['average'],
//                 'bulanTahunDepan' => $item[$nextYear],
//                 'jumlah' => $item['jumlah'],
//                 'noformulir' => $item['noformulir']  // Include noformulir in the response
//             );
//         }
//     }

//     sendResponse(201, $flattenedData);
// }


function getReportDataByTransaksiId($year, $transaksiId) {
    global $conn;

    $query = $conn->prepare("
        SELECT td.transaksi_id, td.subpelayanan_id, td.pelayanan_id, mp.nama_pelayanan, smp.nama_subpelayanan, td.tanggal_transaksi, td.jumlah, td.keterangan, td.kode_rumahsakit, tp.noformulir
        FROM transaksidetail_pelayanan td
        JOIN master_pelayanan mp ON td.pelayanan_id = mp.pelayanan_id
        JOIN submaster_pelayanan smp ON td.subpelayanan_id = smp.subpelayanan_id
        JOIN transaksi_pelayanan tp ON td.transaksi_id = tp.transaksi_id
        WHERE (YEAR(td.tanggal_transaksi) = ? OR YEAR(td.tanggal_transaksi) = ?) AND td.transaksi_id = ? AND soft_delete is false");

    if (!$query) {
        // Handle error if query preparation fails
        $error = $conn->error;
        sendResponse(500, ["error" => "Failed to prepare SQL query: $error"]);
        return;
    }

    $nextYear = $year + 1;
    $query->bind_param("iii", $year, $nextYear, $transaksiId);
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
        $tanggal_transaksi = $row['tanggal_transaksi'];
        $transaksiIds = $row['transaksi_id'];
        $PelayananIDs = $row['pelayanan_id'];
        $noFormulir = $row['noformulir'];  // Get noformulir from row data

        if (!isset($groupedData[$mainService])) {
            $groupedData[$mainService] = [];
        }

        if (!isset($groupedData[$mainService][$subService])) {
            $groupedData[$mainService][$subService] = array(
                'tahun_ini' => array('total' => 0, 'count' => 0),
                'tahun_depan' => array_fill(0, 12, 0),
                'jumlah' => 0,
                'noformulir' => $noFormulir  // Add noformulir to the structure
            );
        }

        $date = new DateTime($row['tanggal_transaksi']);
        if ($date->format('Y') == $year) {
            $groupedData[$mainService][$subService]['tahun_ini']['total'] += $row['jumlah'];
            $groupedData[$mainService][$subService]['tahun_ini']['count']++;
        } elseif ($date->format('Y') == $nextYear) {
            $month = (int)$date->format('m') - 1;
            $groupedData[$mainService][$subService]['tahun_depan'][$month] += $row['jumlah'];
        }

        $groupedData[$mainService][$subService]['jumlah'] += $row['jumlah'];

    }

    // Calculate average for the specified year
    foreach ($groupedData as $mainService => &$subServices) {
        foreach ($subServices as &$item) {
            if ($item['tahun_ini']['count'] > 0) {
                $item['tahun_ini']['average'] = $item['tahun_ini']['total'] / $item['tahun_ini']['count'];
            } else {
                $item['tahun_ini']['average'] = 0;
            }
        }
    }

// echo "<pre>";
    // Flatten the data for response
    $flattenedData = array();
        // var_dump($groupedData);

    foreach ($groupedData as $mainService => $subServicesA) {

        // var_dump($groupedData);

        foreach ($subServicesA as $subService => $items) {

            $flattenedData[] = array(
                'nama_pelayanan' => $mainService,
                'transaksi_id' => $transaksiIds, 
                'tanggal_transaksi'=> $tanggal_transaksi,
                'nama_subpelayanan' => $subService,
                'pelayanan_id' => $PelayananIDs,
                'jumlahTahun' => $items['tahun_ini']['total'],
                'rataRataBulan' => $items['tahun_ini']['average'],
                'bulanTahunDepan' => $items['tahun_depan'],
                'jumlah' => $items['jumlah'],
                'noformulir' => $items['noformulir']  
            );
        }
    }

    // Send the flattened data as API response
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

// Function to edit an existing transaction
function editTransaksi($transaksi_id) {
    global $conn;

    // Get JSON input
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (!$input) {
        sendResponse(400, array('error' => 'Invalid JSON input'));
        return;
    }

    // $transaksi_id = $input['transaksi_id'];
    $kode_rumahsakit = $input['kode_rumahsakit'];
    $tanggal_transaksi = $input['tanggal_transaksi'];
    $keterangan = $input['keterangan'];
    $details = $input['details'];

    // Update the main transaction record
    $sql = "UPDATE transaksi_pelayanan 
            SET  tanggal_transaksi = '$tanggal_transaksi', 
                keterangan = '$keterangan' 
            WHERE transaksi_id = $transaksi_id";

    if ($conn->query($sql) === TRUE) {
        // Soft delete existing transaction details
        $sql = "UPDATE transaksidetail_pelayanan SET soft_delete = 1 WHERE transaksi_id = $transaksi_id";
        if ($conn->query($sql) !== TRUE) {
            sendResponse(500, array('error' => 'Failed to soft delete existing transaction details: ' . $conn->error));
            return;
        }

        // Insert new transaction details
        foreach ($details as $detail) {
            if (is_null($detail)) {
                continue; // Skip null entries
            }

            $subpelayanan_id = $detail['subpelayanan_id'];
            $pelayanan_id = isset($detail['pelayanan_id']) ? $detail['pelayanan_id'] : 'NULL';
            $detail_tanggal_transaksi = $detail['tanggal_transaksi'];
            $jumlah = $detail['jumlah'];
            $detail_keterangan = isset($detail['keterangan']) ? $detail['keterangan'] : '-';

            $sql = "INSERT INTO transaksidetail_pelayanan 
                    (transaksi_id, subpelayanan_id, pelayanan_id, tanggal_transaksi, jumlah, keterangan, kode_rumahsakit, soft_delete) 
                    VALUES ($transaksi_id, $subpelayanan_id, $pelayanan_id, '$detail_tanggal_transaksi', $jumlah, '$detail_keterangan', $kode_rumahsakit, 0)";

            if ($conn->query($sql) !== TRUE) {
                sendResponse(500, array('error' => 'Failed to insert transaction detail: ' . $conn->error));
                return;
            }
        }

        sendResponse(200, array('message' => 'Transaction updated successfully'));
    } else {
        sendResponse(500, array('error' => 'Failed to update transaction: ' . $conn->error));
    }
}

?>
