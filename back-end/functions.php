<?php



require_once 'config.php';
// Include global functions
require_once 'global_functions.php';

require_once 'auth.php';

require_once 'Login/LoginController.php';

require_once 'Register/RegisterController.php';

// Add more functions for CRUD operations on users, other master tables, etc.

require_once 'Hak_Akses/HakAksesController.php';

require_once 'Rumah_Sakit/RumahSakitController.php';

require_once 'MasterPelayanan/MasterPelayananController.php';

require_once 'SubMasterPelayanan/SubMasterPelayananController.php';


require_once 'Transaksi/TransaksiPelayananController.php';

?>
