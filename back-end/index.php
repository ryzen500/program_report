<?php

// index.php

// Load configuration and database connection (if needed)
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
require_once 'functions.php';
require_once 'router.php';

// Handle the request
routeRequest();

?>
