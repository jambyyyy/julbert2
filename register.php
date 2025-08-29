<?php
require __DIR__ . '/config.php';
json_header();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$body = read_json_body();
$full_name       = trim((string)($body['full_name'] ?? ''));
$username        = trim((string)($body['username'] ?? ''));
$email           = trim((string)($body['email'] ?? ''));
$contact_number  = trim((string)($body['contact_number'] ?? ''));
$password        = (string)($body['password'] ?? '');
$confirm         = (string)($body['confirm_password'] ?? '');

if ($full_name === '' || $username === '' || $email === '' || $password === '' || $confirm === '') {
  echo json_encode(['ok' => false, 'error' => 'All fields are required.']);
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

$stmt = $mysqli->prepare("SELECT customer_id FROM customer WHERE email = ? OR username = ? LIMIT 1");
$stmt->bind_param("ss", $email, $username);
$stmt->execute();
if ($stmt->get_result()->fetch_assoc()) {
  echo json_encode(['ok' => false, 'error' => 'Email or Username already exists.']);
  exit;
}
$stmt->close();

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $mysqli->prepare("INSERT INTO customer (email, full_name, password, contact_number, username) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $email, $full_name, $hash, $contact_number, $username);
$stmt->execute();
$stmt->close();

session_regenerate_id(true);
$_SESSION['customer_id']       = $mysqli->insert_id;
$_SESSION['customer_name']     = $full_name;
$_SESSION['customer_email']    = $email;
$_SESSION['customer_username'] = $username;

echo json_encode(['ok' => true, 'message' => 'Account created successfully.']);
