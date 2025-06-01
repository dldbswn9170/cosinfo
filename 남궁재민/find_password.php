<?php
// DB 연결
require 'db_connect.php';

$email = $_POST['email'] ?? '';

if (!$email) {
    echo "이메일을 입력해주세요.";
    exit;
}

// user_id로 비밀번호 조회
$sql = "SELECT password FROM users WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "당신의 비밀번호는: " . $row['password'];
} else {
    echo "해당 이메일로 가입된 계정이 없어요.";
}

$stmt->close();
$conn->close();
?>
