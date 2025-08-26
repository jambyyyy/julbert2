<?php
require __DIR__ . '/config.php';

$body = json_decode(file_get_contents('php://input'), true);
$email = trim($body['email'] ?? '');
$password = (string)($body['password'] ?? '');

if ($email === '' || $password === '') {
  echo json_encode(['ok' => false, 'error' => 'Email and password are required.']);
  exit;
}

$stmt = $pdo->prepare('SELECT customer_id, full_name, email, password FROM customer WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
  echo json_encode(['ok' => false, 'error' => 'Invalid credentials.']);
  exit;
}

session_regenerate_id(true);
$_SESSION['customer_id'] = (int)$user['customer_id'];
$_SESSION['customer_name'] = $user['full_name'];
$_SESSION['customer_email'] = $user['email'];

echo json_encode(['ok' => true, 'message' => 'Logged in.', 'customer' => [
  'id' => (int)$user['customer_id'],
  'full_name' => $user['full_name'],
  'email' => $user['email']
]]);
