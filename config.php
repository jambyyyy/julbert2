<?php
$db_host = '127.0.0.1';
$db_name = 'julbert_ordering';
$db_user = 'root';
$db_pass = ''; 

$dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4";
$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
  $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Database connection failed.']);
  exit;
}

if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

header('Content-Type: application/json; charset=utf-8');
