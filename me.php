<?php
require __DIR__ . '/config.php';
json_header();

if (!isset($_SESSION['customer_id'])) {
  echo json_encode(['ok' => false, 'error' => 'Not logged in']);
  exit;
}

echo json_encode([
  'ok' => true,
  'customer' => [
    'customer_id' => $_SESSION['customer_id'],
    'full_name' => $_SESSION['customer_name'] ?? '',
    'email' => $_SESSION['customer_email'] ?? '',
    'username' => $_SESSION['customer_username'] ?? ''
  ]
]);
?>
