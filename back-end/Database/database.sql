CREATE DATABASE IF NOT EXISTS rumah_sakit_db;
USE rumah_sakit_db;

-- Table: rumah_sakit
CREATE TABLE rumah_sakit (
    kode_rumahsakit VARCHAR(50) PRIMARY KEY,
    nama_rumahsakit VARCHAR(100) NOT NULL,
    kode_bpjs_rumahsakit VARCHAR(50)
);

-- Table: hak_akses
CREATE TABLE hak_akses (
    hak_akses_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_hak_akses VARCHAR(50) NOT NULL,
    nama_lain_hak_akses VARCHAR(50)
);

-- Table: user
CREATE TABLE user (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nama_user VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rumahsakit_id VARCHAR(50),
    hak_akses_id INT,
    FOREIGN KEY (rumahsakit_id) REFERENCES rumah_sakit(kode_rumahsakit),
    FOREIGN KEY (hak_akses_id) REFERENCES hak_akses(hak_akses_id)
);

-- Table: master_pelayanan
CREATE TABLE master_pelayanan (
    pelayanan_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pelayanan VARCHAR(100) NOT NULL
);

-- Table: submaster_pelayanan
CREATE TABLE submaster_pelayanan (
    subpelayanan_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_subpelayanan VARCHAR(100) NOT NULL,
    pelayanan_id INT,
    FOREIGN KEY (pelayanan_id) REFERENCES master_pelayanan(pelayanan_id)
);

-- Table: transaksi_pelayanan
CREATE TABLE transaksi_pelayanan (
    transaksi_id INT AUTO_INCREMENT PRIMARY KEY,
    subpelayanan_id INT,
    tanggal_transaksi DATE NOT NULL,
    jumlah FLOAT NOT NULL,
    keterangan VARCHAR(255),
    FOREIGN KEY (subpelayanan_id) REFERENCES submaster_pelayanan(subpelayanan_id)
);

-- laporan.transaksidetail_pelayanan definition

CREATE TABLE `transaksidetail_pelayanan` (
  `transaksidetail_pelayanan_id` int NOT NULL AUTO_INCREMENT,
  `subpelayanan_id` int DEFAULT NULL,
  `pelayanan_id` int DEFAULT NULL,
  `tanggal_transaksi` date NOT NULL,
  `jumlah` float NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `kode_rumahsakit` int DEFAULT NULL,
  `transaksi_id` INT,
  PRIMARY KEY (`transaksi_id`),
  KEY `subpelayanan_id` (`subpelayanan_id`),
  KEY `pelayanan_id` (`pelayanan_id`),
  KEY `kode_rumahsakit` (`kode_rumahsakit`),
  CONSTRAINT `transaksidetail_pelayanan_ibfk_1` FOREIGN KEY (`subpelayanan_id`) REFERENCES `submaster_pelayanan` (`subpelayanan_id`),
  CONSTRAINT `transaksidetail_pelayanan_ibfk_2` FOREIGN KEY (`pelayanan_id`) REFERENCES `master_pelayanan` (`pelayanan_id`),
  CONSTRAINT `transaksidetail_pelayanan_ibfk_3` FOREIGN KEY (`kode_rumahsakit`) REFERENCES `rumah_sakit` (`kode_rumahsakit`)
);

CREATE TABLE `sdm_laporan` (
  `sdm_laporan_id` int NOT NULL AUTO_INCREMENT,
  `kode_rumahsakit` int NOT NULL,
  `noformulir` varchar(255) DEFAULT null,
  `total_biaya` float NOT NULL,
  `tanggal_transaksi` datetime NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`sdm_laporan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE sdm_laporan_detail (
    sdm_laporan_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    sdm_laporan_id INT,
    nama_detail VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    tanggal_transaksi DATETIME NOT NULL,
    jumlah DOUBLE NOT NULL,
    keterangan TEXT,
    kode_rumahsakit INT,
    CONSTRAINT fk_sdm_laporan
        FOREIGN KEY (sdm_laporan_id) REFERENCES sdm_laporan(sdm_laporan_id)
        ON DELETE CASCADE
);
