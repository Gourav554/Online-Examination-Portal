-- Run this file once to create the database and Phase 1 tables.
CREATE DATABASE IF NOT EXISTS exam_portal;
USE exam_portal;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher', 'student') NOT NULL,
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_token_expiry DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Phase 2: Teacher module

CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  subject VARCHAR(100) DEFAULT NULL,
  duration_minutes INT NOT NULL,
  passing_marks INT NOT NULL DEFAULT 0,
  negative_marks DECIMAL(4,2) NOT NULL DEFAULT 0,
  randomize_questions BOOLEAN NOT NULL DEFAULT FALSE,
  randomize_options BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('mcq', 'true_false', 'descriptive') NOT NULL,
  options JSON DEFAULT NULL,
  correct_answer VARCHAR(255) DEFAULT NULL,
  marks INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- Phase 3: Student module

CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT NOT NULL,
  student_id INT NOT NULL,
  paper_snapshot JSON NOT NULL,
  status ENUM('in_progress', 'submitted') NOT NULL DEFAULT 'in_progress',
  total_marks DECIMAL(6,2) DEFAULT NULL,
  obtained_marks DECIMAL(6,2) DEFAULT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY unique_attempt (exam_id, student_id),
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL,
  question_id INT NOT NULL,
  answer_text TEXT DEFAULT NULL,
  is_correct BOOLEAN DEFAULT NULL,
  marks_obtained DECIMAL(6,2) DEFAULT NULL,
  UNIQUE KEY unique_answer (submission_id, question_id),
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Phase 4: Result module

CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL UNIQUE,
  exam_id INT NOT NULL,
  student_id INT NOT NULL,
  student_name VARCHAR(100) NOT NULL,
  exam_name VARCHAR(150) NOT NULL,
  total_marks DECIMAL(6,2) NOT NULL,
  obtained_marks DECIMAL(6,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  passing_marks INT NOT NULL,
  passed BOOLEAN NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  result_id INT NOT NULL UNIQUE,
  certificate_code VARCHAR(64) NOT NULL UNIQUE,
  student_id INT NOT NULL,
  student_name VARCHAR(100) NOT NULL,
  exam_id INT NOT NULL,
  exam_name VARCHAR(150) NOT NULL,
  score DECIMAL(6,2) NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (result_id) REFERENCES results(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);
