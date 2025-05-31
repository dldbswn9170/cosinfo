<?php
$host = "localhost";
$user = "root";
$pass = "1234";
$db = "cosinfoDatabase";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("연결 실패: ". $conn->connect_error);
}
?>