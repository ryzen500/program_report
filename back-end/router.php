<?php
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

        } elseif ($request_method === 'POST' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'transaksi_pelayanan') {
            addTransaksi();

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

           elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'chart') {
            // addTransaksi();
            getChartData();
        }  elseif ($request_method === 'GET' && isset($uri_parts[4]) && $uri_parts[4] === 'api' && $uri_parts[5] === 'report_data'  && !empty($uri_parts[6])) {
            $year = $uri_parts[6];
            getReportData($year);
        }






        







    }
}

?>
