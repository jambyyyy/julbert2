<?php
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

$DB_HOST = 'localhost';            
$DB_PORT = 3306;
$DB_USER = 'root';
$DB_PASS = '';                     
$DB_NAME = 'julbert_ordering';    

mysqli_report(MYSQLI_REPORT_OFF);
$mysqli = @new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);
if ($mysqli->connect_errno) {
  header('Content-Type: application/json');
  http_response_code(500);
  echo json_encode([
    'ok' => false,
    'error' => 'DB connection failed.',
    'dev' => 'Err ' . $mysqli->connect_errno . ': ' . $mysqli->connect_error
  ]);
  exit;
}
$mysqli->set_charset('utf8mb4');

if (!function_exists('json_header')) {
  function json_header(): void { header('Content-Type: application/json'); }
}
if (!function_exists('read_json_body')) {
  function read_json_body(): array {
    $raw  = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
  }
}
