<?php
// DB 연결
require 'db_connect.php';

// POST로 받은 이메일과 비밀번호 가져오기
$email = $_POST['email'];
$password = $_POST['password'];

// 이메일로 사용자 검색
$sql = "SELECT * FROM users WHERE email='$email'";
$result = $conn->query($sql);

// 사용자가 존재하는지 확인
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // 비밀번호가 일치하는지 확인
    if ($row['password'] === $password) {
        echo "로그인 성공!";
    } else {
        echo "비밀번호가 틀렸습니다.";
    }
} else {
    echo "존재하지 않는 이메일입니다.";
}

$conn->close();
?>
