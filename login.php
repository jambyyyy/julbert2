<?php
require __DIR__ . '/config.php';
json_header();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$body     = read_json_body();
$email    = trim((string)($body['email'] ?? ''));
$password = (string)($body['password'] ?? '');

if ($email === '' || $password === '') {
  echo json_encode(['ok' => false, 'error' => 'Email and password are required.']);
  exit;
}

$stmt = $mysqli->prepare(
  "SELECT customer_id, full_name, email, password, username
   FROM customer
   WHERE email = ?
   LIMIT 1"
);
$stmt->bind_param("s", $email);
$stmt->execute();

$user = null;
if (method_exists($stmt, 'get_result')) {
  $res  = $stmt->get_result();
  $user = $res ? $res->fetch_assoc() : null;
} else {
  $stmt->store_result();
  $stmt->bind_result($cid, $fname, $em, $pw, $uname);
  if ($stmt->num_rows === 1 && $stmt->fetch()) {
    $user = [
      'customer_id' => $cid,
      'full_name'   => $fname,
      'email'       => $em,
      'password'    => $pw,
      'username'    => $uname,
    ];
  }
}
$stmt->close();

if (!$user || !password_verify($password, $user['password'])) {
  echo json_encode(['ok' => false, 'error' => 'Invalid email or password.']);
  exit;
}

session_regenerate_id(true);
$_SESSION['customer_id']        = $user['customer_id'];
$_SESSION['customer_name']      = $user['full_name'];
$_SESSION['customer_email']     = $user['email'];
$_SESSION['customer_username']  = $user['username'];

echo json_encode(['ok' => true]);
