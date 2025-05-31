<?php
// DB 연결
require 'db_connect.php';

// POST 데이터 가져오기
$email = $_POST['email'];
$password = $_POST['password'];

// 정보들이 입력되어 있는지 확인
if (empty($email) || empty($password)) {
    die("모든 값을 입력하세요.");
}

// 중복 확인
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) { // 중복되는 튜플이 1개라도 있는지 확인
    die("이미 가입된 이메일입니다.");
}

// 회원가입
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$sql = "INSERT INTO users (email, password) VALUES ('$email', '$hashed_password')";

if ($conn->query($sql) === TRUE) {
    echo "회원가입 성공!";
} else {
    echo "회원가입 실패: " . $conn->error;
}

$conn->close();
?>
