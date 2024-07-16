<?php

// config.php

$servername = "localhost";
$username = "damartek_tsany"; // Ganti dengan username database Anda
$password = "Shinigami193"; // Ganti dengan password database Anda
$dbname = "laporan"; // Ganti dengan nama database Anda

// Buat koneksi ke database
 $conn = new mysqli($servername, $username, $password, $dbname);

// Periksa koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
