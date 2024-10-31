<?php

// require '../helpers.php';
require 'Helper/helpers.php';
require_once 'noformulir_generator.php';

// require_once 'config.php'; // Assuming db_connection.php contains the DB connection setup

class TransaksiPelayananSDM {
    private $conn;

    public function __construct($dbConnection) {
        $this->conn = $dbConnection;
    }

    public  function getNoFormulirSDM($kode_rumahsakit) {
        // $kode_rumahsakit = "2";
        // var_dump($kode_rumahsakit);die;
       $noformulir = generateNoFormulirSDM($kode_rumahsakit);
       // var_dump($noformulir);die;
        sendResponse(200, ['noformulir' => $noformulir]);
    }




    public  static function laporandetail() {
        
           global $conn;

    $sql = "SELECT * from sdm_laporan_detail";
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

    public function readTransaksiPelayananSDM() {
        $sql = "SELECT rs.nama_rumahsakit, tp.* FROM sdm_laporan tp 
                LEFT JOIN rumah_sakit rs ON tp.kode_rumahsakit = rs.kode_rumahsakit 
                ";
        $result = $this->conn->query($sql);

        $outputs;
        if ($result->num_rows > 0) {
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $outputs = sendResponse(200, $data);
        } else {
           $outputs = sendResponse(404, ['error' => 'Tidak Ada Transaksi Pelayanan yang ditemukan']);
        }

        return $outputs;
    }

public function readTransaksiPelayananSDMDetail($id) {
    // Query untuk mendapatkan data parent dan child
    $sql = "SELECT 
                rs.nama_rumahsakit, 
                tp.sdm_laporan_id, 
                tp.kode_rumahsakit, 
                tp.total_biaya, 
                tp.tanggal_transaksi, 
                tp.status, 
                tp.noformulir_sdm,
                sdm_laporan_detail.sdm_laporan_detail_id, 
                sdm_laporan_detail.nama_detail, 
                sdm_laporan_detail.category, 
                sdm_laporan_detail.tanggal_transaksi AS detail_tanggal_transaksi, 
                sdm_laporan_detail.jumlah, 
                sdm_laporan_detail.keterangan AS detail_keterangan, 
                sdm_laporan_detail.kode_rumahsakit AS detail_kode_rumahsakit
            FROM sdm_laporan tp 
            LEFT JOIN rumah_sakit rs ON tp.kode_rumahsakit = rs.kode_rumahsakit 
            LEFT JOIN sdm_laporan_detail ON tp.sdm_laporan_id = sdm_laporan_detail.sdm_laporan_id
            WHERE tp.sdm_laporan_id = $id";
    
    $result = $this->conn->query($sql);
    
    $outputs;
    
    if ($result->num_rows > 0) {
        // Inisialisasi variabel untuk menyimpan parent dan child
        $parent = null;
        $children = [];
        
        // Loop untuk memproses setiap baris hasil query
        while ($row = $result->fetch_assoc()) {
            // Jika parent belum diisi, maka isi dengan data dari tabel sdm_laporan dan rumah_sakit
            if (!$parent) {
                $parent = [
                    "sdm_laporan_id" => $row['sdm_laporan_id'],
                    "nama_rumahsakit" => $row['nama_rumahsakit'],
                    "kode_rumahsakit" => $row['kode_rumahsakit'],
                    "total_biaya" => $row['total_biaya'],
                    "tanggal_transaksi" => $row['tanggal_transaksi'],
                    "status" => $row['status'],
                    "noformulir_sdm" => $row['noformulir_sdm'],
                    "details" => [] // Ini akan menampung child
                ];
            }
            
            // Menambahkan data dari tabel sdm_laporan_detail sebagai child
            if (!is_null($row['sdm_laporan_detail_id'])) { // Pastikan ada detail
                $children[] = [
                    "sdm_laporan_detail_id" => $row['sdm_laporan_detail_id'],
                    "nama_detail" => $row['nama_detail'],
                    "category" => $row['category'],
                    "tanggal_transaksi" => $row['detail_tanggal_transaksi'],
                    "jumlah" => $row['jumlah'],
                    "keterangan" => $row['detail_keterangan'],
                    "kode_rumahsakit" => $row['detail_kode_rumahsakit']
                ];
            }
        }
        
        // Menyusun child ke dalam parent
        if ($parent) {
            $parent['details'] = $children;
        }
        
        // Mengirimkan respons dengan parent dan child
        $outputs = $this->sendResponse(200, $parent);
    } else {
        $outputs = $this->sendResponse(404, ['error' => 'Tidak Ada Transaksi Pelayanan yang ditemukan']);
    }

    return $outputs;
}




       // Method untuk menambahkan data ke sdm_laporan dan sdm_laporan_detail
    public function createLaporanSDM($data) {

        // $this->conn->begin_transaction(); // Mulai transaksi
        Helper::beginTransaction($this->conn);

        try {
            // Insert ke tabel sdm_laporan
            $stmtLaporan = $this->conn->prepare("
                INSERT INTO sdm_laporan (kode_rumahsakit, total_biaya, tanggal_transaksi, status, noformulir_sdm) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmtLaporan->bind_param("idsss", $data['kode_rumahsakit'], $data['total_biaya'], $data['tanggal_transaksi'], $data['status'], $data['noformulir_sdm']);
            $stmtLaporan->execute();

            // Ambil ID dari laporan yang baru saja dimasukkan
            $sdm_laporan_id = $this->conn->insert_id;

            // Insert ke tabel sdm_laporan_detail
            foreach ($data['details'] as $detail) {
                $stmtDetail = $this->conn->prepare("
                    INSERT INTO sdm_laporan_detail (sdm_laporan_id, nama_detail, category, tanggal_transaksi, jumlah, keterangan, kode_rumahsakit) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                $stmtDetail->bind_param(
                    "isssdsi",
                    $sdm_laporan_id, 
                    $detail['nama_detail'], 
                    $detail['category'], 
                    $detail['tanggal_transaksi'], 
                    $detail['jumlah'], 
                    $detail['keterangan'], 
                    $detail['kode_rumahsakit']
                );
                $stmtDetail->execute();
            }

            // Commit transaksi jika semua sukses
            // $this->conn->commit();
            Helper::commitTransaction($this->conn);

            sendResponse(200, ['message' => 'Data berhasil disimpan', 'sdm_laporan_id' => $sdm_laporan_id]);
        } catch (Exception $e) {
            // Rollback jika ada error
            // $this->conn->rollback();
            Helper::rollbackTransaction($this->conn);
            sendResponse(500, ['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }

      // Fungsi untuk mengupdate data `sdm_laporan` dan `sdm_laporan_detail`
    public function updateSDMLaporanAndDetail($id, $data) {

        Helper::beginTransaction($this->conn);

        try {
            // Update data di tabel sdm_laporan
            $sqlLaporan = "UPDATE sdm_laporan SET 
                            kode_rumahsakit = ?, 
                            total_biaya = ?, 
                            tanggal_transaksi = ?, 
                            status = ?, 
                            noformulir_sdm = ? 
                          WHERE sdm_laporan_id = ?";
            $stmtLaporan = $this->conn->prepare($sqlLaporan);
            $stmtLaporan->bind_param(
                "idsssi", 
                $data['kode_rumahsakit'], 
                $data['total_biaya'], 
                $data['tanggal_transaksi'], 
                $data['status'], 
                $data['noformulir_sdm'], 
                $id
            );
            if (!$stmtLaporan->execute()) {
                throw new Exception("Gagal mengupdate data SDM Laporan");
            }

            // Update data di tabel sdm_laporan_detail (jika ada)
            if (isset($data['detail']) && is_array($data['detail'])) {
                foreach ($data['detail'] as $detail) {
                    $sqlDetail = "UPDATE sdm_laporan_detail SET 
                                    nama_detail = ?, 
                                    category = ?, 
                                    tanggal_transaksi = ?, 
                                    jumlah = ?, 
                                    keterangan = ?, 
                                    kode_rumahsakit = ? 
                                  WHERE sdm_laporan_detail_id = ?";
                    $stmtDetail = $this->conn->prepare($sqlDetail);
                    $stmtDetail->bind_param(
                        "sssdsii", 
                        $detail['nama_detail'], 
                        $detail['category'], 
                        $detail['tanggal_transaksi'], 
                        $detail['jumlah'], 
                        $detail['keterangan'], 
                        $detail['kode_rumahsakit'], 
                        $detail['sdm_laporan_detail_id']
                    );
                    if (!$stmtDetail->execute()) {
                        throw new Exception("Gagal mengupdate data SDM Laporan Detail");
                    }
                }
            }

            Helper::commitTransaction($this->conn);
            return $this->sendResponse(200, ['message' => 'Data berhasil diupdate']);
        } catch (Exception $e) {
            Helper::rollbackTransaction($this->conn);
            return sendResponse(500, ['error' => $e->getMessage()]);
        }
    }

    public function softDeleteTransaksi($id) {
        $sql = "UPDATE sdm_laporan SET status = 'deleted' WHERE sdm_laporan_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $id);
        if ($stmt->execute()) {
            sendResponse(200, ['message' => 'Soft Delete Transaksi Pelayanan SDM']);
        } else {
            sendResponse(500, ['error' => 'Failed to update: ' . $this->conn->error]);
        }
    }

}

// Usage Example:
// Initialize DB connection
$transaksiPelayanan = new TransaksiPelayananSDM($conn);

// Example of getting NoFormulir
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);


// Example of adding total for Poli Klinik or IGD


?>