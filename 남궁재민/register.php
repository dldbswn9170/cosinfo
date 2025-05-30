<?php
// DB 연결 정보
$host = 'localhost';
$db = 'cosinfoDatabase';
$user = 'root';
$pass = '1234';

// DB 연결
$conn = new mysqli($host, $user, $pass, $db);

// 연결 확인
if ($conn->connect_error) {
    die("연결 실패: " . $conn->connect_error);
}

// POST 데이터 가져오기
$email = $_POST['email'];
$password = $_POST['password'];

// 정보들이 입력되어 있는지 확인
if (empty($email) || empty($password)) {
    die("모든 값을 입력하세요.");
}

// 중복 확인
$stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) { // 중복되는 튜플이 1개라도 있는지 확인
    die("이미 가입된 이메일입니다.");
}

// 회원가입
$stmt = $conn->prepare("INSERT INTO users (user_id, username, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $email, $password);  // username은 임시로 이메일과 동일하게
if ($stmt->execute()) {
    echo "회원가입 성공!";
} else {
    echo "회원가입 실패: " . $conn->error;
}

$conn->close();
?>
