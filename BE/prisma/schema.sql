-- Tạo schema
CREATE SCHEMA IF NOT EXISTS english_academic;
SET search_path TO english_academic;

-- Bảng người dùng
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'admin'))
);

-- Bảng chủ đề
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Bảng bài học ngữ pháp
CREATE TABLE grammar_lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    video_url VARCHAR(255)
);

-- Bảng flashcard từ vựng
CREATE TABLE flashcards (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    vocabulary VARCHAR(255) NOT NULL,
    phonetics VARCHAR(255),
    example TEXT
);

-- Bảng câu hỏi trắc nghiệm
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(10) NOT NULL CHECK (content_type IN ('topic', 'grammar')),
    content_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option1 VARCHAR(255) NOT NULL,
    option2 VARCHAR(255) NOT NULL,
    option3 VARCHAR(255) NOT NULL,
    option4 VARCHAR(255) NOT NULL,
    correct_answer SMALLINT NOT NULL CHECK (correct_answer BETWEEN 1 AND 4)
);

-- Bảng tiến trình học
CREATE TABLE user_progress (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(10) NOT NULL CHECK (content_type IN ('topic', 'grammar')),
    content_id INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, content_type, content_id)
);

-- Bảng lịch sử làm bài
CREATE TABLE quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(10) NOT NULL CHECK (content_type IN ('topic', 'grammar')),
    content_id INTEGER NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    score SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 20)
);

-- Bảng chi tiết đáp án
CREATE TABLE quiz_attempt_answers (
    attempt_id INTEGER NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option SMALLINT NOT NULL CHECK (selected_option BETWEEN 1 AND 4),
    PRIMARY KEY (attempt_id, question_id)
);

-- Tạo indexes
CREATE INDEX idx_flashcards_topic ON flashcards(topic_id);
CREATE INDEX idx_questions_content ON questions(content_type, content_id);
CREATE INDEX idx_user_progress ON user_progress(user_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);