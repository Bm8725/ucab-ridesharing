<?php
header("Content-Type: application/json");
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["error" => "JSON invalid"]);
    exit;
}

$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
$role = $input['role'] ?? '';
$carModel = $input['carModel'] ?? '';
$plateNumber = $input['plateNumber'] ?? '';
$vehicle = $input['vehicle'] ?? '';

// TODO: Conectare DB MySQL
$mysqli = new mysqli("localhost", "user", "pass", "rideshare");
if ($mysqli->connect_errno) {
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

// Hash parola
$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $mysqli->prepare("INSERT INTO users (name,email,password,role,carModel,plateNumber,vehicle) VALUES (?,?,?,?,?,?,?,?)");
$stmt->bind_param("ssssssss", $name, $email, $hash, $role, $carModel, $plateNumber, $vehicle);

if ($stmt->execute()) {
    echo json_encode(["message" => "Cont creat cu succes!"]);
} else {
    echo json_encode(["error" => "Eroare la crearea contului"]);
}

$stmt->close();
$mysqli->close();
?>
