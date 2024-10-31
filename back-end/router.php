<?php

require_once 'Transaksi/TransaksiPelayananSDMController.php';
require_once 'config.php'; // Assuming db_connection.php contains the DB connection setup



header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Credentials: true");
if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
   die();
 }



// router.php

function routeRequest() {
    $request_uri = $_SERVER['REQUEST_URI'];
    $request_method = $_SERVER['REQUEST_METHOD'];
    global $conn;

    // Split the URI into components
    $uri_parts = explode('/', $request_uri);
    
    // Example: POST /api/login
    // var_dump($uri_parts[5]);die;
    if ($request_method === 'POST' && $uri_parts[4] === 'api' && $uri_parts[5] === 'login') {
        handleLogin();
    } elseif ($request_method === 'POST' && $uri_parts[4] === 'api' && $uri_parts[5] === 'register') {
        handleRegister();
    } else {


          $headers = getallheaders();

// error_log(print_r($headers, true));  // Log all headers for debugging
// die;
          // echo "$headers";
       
           if ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'data_rumah_sakit') {
            readRumahSakit();
            } 

        if (!isset($headers['Authorization'])) {
            sendResponse(401, array('error' => 'No token provided'));
            return;
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);

        // var_dump($headers['Authorization']);die;
        if (!validateToken($token)) {
            sendResponse(401, array('error' => 'Invalid token','validasi'=>!validateToken($token)));
            return;
        }

        if ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'hak_akses') {
            $input = json_decode(file_get_contents('php://input'), true);
            createHakAkses($input);
        }elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'hak_akses' &&  !empty($uri_parts[6]) ) {
            $id = $uri_parts[6];
            readHakAksesDetail($id,$input);
        }elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'hak_akses') {
            readHakAkses();
        }
         elseif ($request_method === 'PUT' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'hak_akses') {
            $id = $uri_parts[6];
            $input = json_decode(file_get_contents('php://input'), true);
            updateHakAkses($id, $input);
        } elseif ($request_method === 'DELETE' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'hak_akses') {
            $id = $uri_parts[6];
            deleteHakAkses($id);

        }
        elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'rumah_sakit' &&  !empty($uri_parts[6]) ) {
            $id = $uri_parts[6];
            readRumahSakitDetail($id);
        }
         elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'rumah_sakit') {
            readRumahSakit();
        } 
        elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'rumah_sakit') {
            $input = json_decode(file_get_contents('php://input'), true);
            createRumahSakit($input);
            // echo "1";
        } elseif ($request_method === 'PUT' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'rumah_sakit') {
            $id = $uri_parts[6];
            $input = json_decode(file_get_contents('php://input'), true);
            updateRumahSakit($id, $input);
        } elseif ($request_method === 'DELETE' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'rumah_sakit') {
            $id = $uri_parts[6];
            deleteRumahSakit($id);

        }

        elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'master_pelayanan' &&  !empty($uri_parts[6]) ) {
            $id = $uri_parts[6];
            getAllPelayananDetail($id);
        }
         elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'master_pelayanan') {
            getAllPelayanan();
        } 
        elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'master_pelayanan') {
            // $input = json_decode(file_get_contents('php://input'), true);
            addPelayanan();
            // echo "1";
        } elseif ($request_method === 'PUT' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'master_pelayanan') {
            $id = $uri_parts[6];
            // $input = json_decode(file_get_contents('php://input'), true);
            updatePelayanan($id);
        } elseif ($request_method === 'DELETE' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'master_pelayanan'  && !empty($uri_parts[6])) {
            $id = $uri_parts[6];
            deletePelayanan($id);

        }
        elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'submaster_pelayananDetail' &&  !empty($uri_parts[6]) ) {
            $id = $uri_parts[6];
            // echo "$id";
            getSubPelayananDetailPerPoli($id);
        }

          elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'submaster_pelayanan' &&  !empty($uri_parts[6]) ) {
            $id = $uri_parts[6];
            getSubPelayananDetail($id);
        }
         elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'submaster_pelayanan') {
            getAllSubPelayanan();
        } 
        elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'submaster_pelayanan') {
            // $input = json_decode(file_get_contents('php://input'), true);
            addSubPelayanan();
            // echo "1";
        } elseif ($request_method === 'PUT' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'submaster_pelayanan') {
            $id = $uri_parts[6];
            // $input = json_decode(file_get_contents('php://input'), true);
            updateSubPelayanan($id);
        } elseif ($request_method === 'DELETE' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'submaster_pelayanan'  && !empty($uri_parts[6])) {
            $id = $uri_parts[6];
            deleteSubPelayanan($id);

        }
         elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'getFormulir') {
            getNoFormulir();

        } 

         elseif ($request_method === 'PUT' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'transaksi_pelayanan' && !empty($uri_parts[6])) {
            $transaksi_id = $uri_parts[6];
            editTransaksi($transaksi_id);

        }
        elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'transaksi_pelayanan') {
            addTransaksi();

        }

         elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'transaksi_pelayanan') {
            readTransaksiPelayanan();

        }
         elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'totalpoliKlinik') {
            // addTransaksi();
            addTotalPoliKlinik();

        }

         elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'totalpoliIGD') {
            // addTransaksi();
            addTotalPoliIGD();

        }

           elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'totalFisio') {
            // addTransaksi();
            addTotalPoliFisio();

        }
        elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'weekly_chart') {
            // addTransaksi();
            getWeeklyChartData();
        }

        elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'pie_chart') {
            // addTransaksi();
            getPieChartData();
        }

           elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'chart') {
            // addTransaksi();
            getChartData();
        }
            elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'report_data'  && !empty($uri_parts[6])  && !empty($uri_parts[7])) {
            $year = $uri_parts[6];
            $transaksiId=  $uri_parts[7];
            // echo "Ok";
        getReportDataByTransaksiId($year,$transaksiId);
        }

            elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'editPoli_transaksi'  && !empty($uri_parts[6])  && !empty($uri_parts[7])) {
            $year = $uri_parts[6];
            $transaksiId=  $uri_parts[7];
            // echo "Ok";
        getSubTransaksiPelayananDetailPerPoli($year,$transaksiId);
        }
          elseif ($request_method === 'PUT' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'transaksi_pelayananHapus'  && !empty($uri_parts[6])) {
            $id = $uri_parts[6];
            softDeleteHapusTransaksiPelayanan($id);
        }
          elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'report_data'  && !empty($uri_parts[6])) {
            $year = $uri_parts[6];
            getReportData($year);
        }

        // softDeleteHapusTransaksiPelayanan
        elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'master_kualifikasi' &&  !empty($uri_parts[6]) ) {
            $id = $uri_parts[6];
            getKualifikasiDetail($id);
        }
         elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'master_kualifikasi') {
            getAllKualifikasi();
        } 
        elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'master_kualifikasi') {
            // $input = json_decode(file_get_contents('php://input'), true);
            addKualifikasi();
            // echo "1";
        } elseif ($request_method === 'PUT' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'master_kualifikasi') {
            $id = $uri_parts[6];
            // $input = json_decode(file_get_contents('php://input'), true);
            updateKualifikasi($id);
        } elseif ($request_method === 'DELETE' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'master_kualifikasi'  && !empty($uri_parts[6])) {
            $id = $uri_parts[6];
            deleteKualifikasi($id);

        }


         elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'subMaster_Kualifikasi' &&  !empty($uri_parts[6]) ) {
            $id = $uri_parts[6];
            // echo "$id";
            getSubKualifikasiDetailPerPoli($id);
        }

          elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'subMaster_Kualifikasi' &&  !empty($uri_parts[6]) ) {
            $id = $uri_parts[6];
            getSubKualifikasiDetail($id);
        }
         elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'subMaster_Kualifikasi') {
            getAllSubKualifikasi();
        } 
        elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'subMaster_Kualifikasi') {
            // $input = json_decode(file_get_contents('php://input'), true);
            addSubKualifikasi();
            // echo "1";
        } elseif ($request_method === 'PUT' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'subMaster_Kualifikasi') {
            $id = $uri_parts[6];
            // $input = json_decode(file_get_contents('php://input'), true);
            updateSubKualifikasi($id);
        } elseif ($request_method === 'DELETE' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'subMaster_Kualifikasi'  && !empty($uri_parts[6])) {
            $id = $uri_parts[6];
            deleteSubKualifikasi($id);

        }

            elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'detail_data' && !empty($uri_parts[6])) {
            $id = $uri_parts[6];

            // var_dump($id);die;
            $transaksiController = new TransaksiPelayananSDM($conn);
            $transaksiController->readTransaksiPelayananSDMDetail($id);

        }


        elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'noformulirsdm') {
                    $input = json_decode(file_get_contents('php://input'), true);
                    $kode_rumahsakit = $input['kode_rumahsakit'];

                if ($kode_rumahsakit) {
                    $transaksiController = new TransaksiPelayananSDM($conn);
                    $transaksiController->getNoFormulirSDM($kode_rumahsakit);  // Panggil fungsi yang sesuai
                } else {
                    echo "Kode Rumah Sakit tidak ada.";
                }
        }

        elseif($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'laporan_sdm'){
            $transaksiController = new TransaksiPelayananSDM($conn);
            $transaksiController->readTransaksiPelayananSDM();
        }

        elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'create_laporan_sdm') {
                    $input = json_decode(file_get_contents('php://input'), true);
                    // $kode_rumahsakit = $input['kode_rumahsakit'];

                if ($input) {
                    $transaksiController = new TransaksiPelayananSDM($conn);
                    $transaksiController->createLaporanSDM($input);  // Panggil fungsi yang sesuai
                } else {
                    echo "Kode Rumah Sakit tidak ada.";
                }
        }

        elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'update_data_sdm' && !empty($uri_parts[6])) {
            $id = $uri_parts[6];
            $input = json_decode(file_get_contents('php://input'), true);

            // var_dump($id);die;
            $transaksiController = new TransaksiPelayananSDM($conn);
            $transaksiController->updateSDMLaporanAndDetail($id,$input);

        }


          elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'delete_data_sdm' && !empty($uri_parts[6])) {
            $id = $uri_parts[6];
            $input = json_decode(file_get_contents('php://input'), true);

            // var_dump($id);die;
            $transaksiController = new TransaksiPelayananSDM($conn);
            $transaksiController->softDeleteTransaksi($id);

        }




        







    }
}

?>
