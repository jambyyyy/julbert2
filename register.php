<?php
require __DIR__ . '/config.php';

$body = json_decode(file_get_contents('php://input'), true);

$full_name = trim($body['full_name'] ?? '');
$email = trim($body['email'] ?? '');
$password = (string)($body['password'] ?? '');
$confirm  = (string)($body['confirm_password'] ?? '');
$username = trim($body['username'] ?? '');          
$contact_number = trim($body['contact_number'] ?? ''); 

if ($full_name === '' || $email === '' || $password === '' || $confirm === '' || $username === '') {
  echo json_encode(['ok' => false, 'error' => 'Full name, email, password, and username are required.']);
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(['ok' => false, 'error' => 'Invalid email.']);
  exit;
}
if ($password !== $confirm) {
  echo json_encode(['ok' => false, 'error' => 'Passwords do not match.']);
  exit;
}
if (strlen($password) < 6) {
  echo json_encode(['ok' => false, 'error' => 'Password must be at least 6 characters.']);
  exit;
}
if ($contact_number !== '' && !preg_match('/^[+0-9][0-9\s\-()]{6,}$/', $contact_number)) {
  echo json_encode(['ok' => false, 'error' => 'Invalid contact number.']);
  exit;
}

$stmt = $pdo->prepare('SELECT customer_id FROM customer WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
  echo json_encode(['ok' => false, 'error' => 'Email already in use.']);
  exit;
}

$stmt = $pdo->prepare('SELECT customer_id FROM customer WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
if ($stmt->fetch()) {
  echo json_encode(['ok' => false, 'error' => 'Username already taken.']);
  exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('
  INSERT INTO customer (email, full_name, password, contact_number, username)
  VALUES (?, ?, ?, ?, ?)
');
$stmt->execute([$email, $full_name, $hash, $contact_number !== '' ? $contact_number : null, $username]);

$id = (int)$pdo->lastInsertId();

$_SESSION['customer_id'] = $id;
$_SESSION['customer_name'] = $full_name;
$_SESSION['customer_email'] = $email;
$_SESSION['customer_username'] = $username;
$_SESSION['customer_contact'] = $contact_number;

echo json_encode([
  'ok' => true,
  'message' => 'Account created.',
  'customer' => [
    'id' => $id,
    'full_name' => $full_name,
    'email' => $email,
    'username' => $username,
    'contact_number' => $contact_number
  ]
]);
