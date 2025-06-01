create database cosinfoDatabase;
USE cosinfoDatabase;

-- 사용자 테이블
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE,
    username VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
select * from users;
-- 성분 테이블
CREATE TABLE ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 검색어 테이블
CREATE TABLE search_terms (
    term_id INT AUTO_INCREMENT PRIMARY KEY,
    term VARCHAR(255),
    search_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 관련 키워드 테이블
CREATE TABLE related_keywords (
    base_term_id INT,
    related_term_id INT,
    relevance_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (base_term_id, related_term_id),
    FOREIGN KEY (base_term_id) REFERENCES search_terms(term_id),
    FOREIGN KEY (related_term_id) REFERENCES search_terms(term_id)
);

-- 사용자-검색어 연결 테이블
CREATE TABLE user_search_terms (
    user_id INT,
    term_id INT,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, term_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (term_id) REFERENCES search_terms(term_id)
);

-- 최근 검색어 테이블
CREATE TABLE recent_searches (
    search_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    search_term VARCHAR(255),
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    -- search_term은 VARCHAR라 FK 생략
);

-- 인기 검색어 테이블
CREATE TABLE popular_searches (
    term VARCHAR(255) PRIMARY KEY,
    search_count INT
    -- term은 search_terms.term과 논리적 연결만 고려
);

-- 채팅 응답 테이블
CREATE TABLE chat_responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    query_text TEXT,
    response_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 북마크 테이블
CREATE TABLE bookmarked_responses (
    bookmark_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    response_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (response_id) REFERENCES chat_responses(response_id)
);

-- 사용자-성분 연결 테이블
CREATE TABLE user_ingredients (
    user_id INT,
    ingredient_id INT,
    PRIMARY KEY (user_id, ingredient_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);

-- 계정 로그 테이블
CREATE TABLE user_account_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
