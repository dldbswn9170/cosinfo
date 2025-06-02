// mysql2 라이브러리 불러오기
const mysql = require('mysql2');

// 데이터베이스 연결 설정
const pool = mysql.createPool({
  host: 'localhost',       // 데이터베이스 주소 (보통 로컬)
  user: 'root',            // MySQL 사용자 이름
  password: '1234',    // 너의 MySQL 비밀번호
  database: 'cosinfodatabase',     // 사용할 데이터베이스 이름
  waitForConnections: true,
  connectionLimit: 10,     // 동시에 몇 개의 연결을 허용할지
  queueLimit: 0
});

// 이 pool을 다른 파일에서 사용할 수 있게 내보냄
module.exports = pool.promise(); // Promise 기반으로 사용 가능하게
