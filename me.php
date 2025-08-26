<?php
require __DIR__ . '/config.php';

if (!empty($_SESSION['customer_id'])) {
  echo json_encode([
    'ok' => true,
    'customer' => [
      'id' => (int)$_SESSION['customer_id'],
      'full_name' => $_SESSION['customer_name'] ?? '',
      'email' => $_SESSION['customer_email'] ?? ''
    ]
  ]);
} else {
  echo json_encode(['ok' => false]);
}
