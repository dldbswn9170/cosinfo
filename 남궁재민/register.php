<?php
// DB 연결
require 'db_connect.php';

// POST 데이터 가져오기
$email = $_POST['email'];
$password = $_POST['password'];
$confirm_Password = $_POST['confirm-password'];

// 정보들이 입력되어 있는지 확인
if (!$email || !$password || !$confirm_Password) {
    echo "모든 항목을 입력하세요.";
    exit;
}

// 비밀번호 확인
if ($password !== $confirm_Password) {
    echo "비밀번호가 일치하지 않습니다.";
    exit;
}

// 중복 확인
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) { // 중복되는 튜플이 1개라도 있는지 확인
    echo "이미 가입된 이메일입니다.";
    exit;
}

// 회원가입
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$sql = "INSERT INTO users (email, password) VALUES ('$email', '$hashed_password')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $hashed_password);

if ($stmt->execute()) {
    echo "회원가입 성공!";
} else {
    echo "회원가입 실패";
}

$stmt->close();
$conn->close();
?>
