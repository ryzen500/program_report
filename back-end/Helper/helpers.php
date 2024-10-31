<?php

class Helper {

    // Begin a database transaction
    public static function beginTransaction($conn) {
        $conn->begin_transaction();
    }

    // Commit a database transaction
    public static function commitTransaction($conn) {
        $conn->commit();
    }

    // Rollback a database transaction
    public static function rollbackTransaction($conn) {
        $conn->rollback();
    }
}
