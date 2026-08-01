-- Migration: denormalize readable names/emails onto students, teachers,
-- results and certificates so records are identifiable directly in MySQL,
-- without changing the users table (still the single source of truth for auth).
-- Safe to run against an existing exam_portal database created from schema.sql.
USE exam_portal;

-- 1. students: add full_name/email, backfill from users, then enforce NOT NULL.
ALTER TABLE students
  ADD COLUMN full_name VARCHAR(100) NULL AFTER user_id,
  ADD COLUMN email VARCHAR(150) NULL AFTER full_name;

UPDATE students s
JOIN users u ON u.id = s.user_id
SET s.full_name = u.name, s.email = u.email
WHERE s.full_name IS NULL OR s.email IS NULL;

ALTER TABLE students
  MODIFY COLUMN full_name VARCHAR(100) NOT NULL,
  MODIFY COLUMN email VARCHAR(150) NOT NULL;

-- 2. teachers: same treatment as students.
ALTER TABLE teachers
  ADD COLUMN full_name VARCHAR(100) NULL AFTER user_id,
  ADD COLUMN email VARCHAR(150) NULL AFTER full_name;

UPDATE teachers t
JOIN users u ON u.id = t.user_id
SET t.full_name = u.name, t.email = u.email
WHERE t.full_name IS NULL OR t.email IS NULL;

ALTER TABLE teachers
  MODIFY COLUMN full_name VARCHAR(100) NOT NULL,
  MODIFY COLUMN email VARCHAR(150) NOT NULL;

-- 3. results: add student_name/exam_name, backfill from users/exams.
ALTER TABLE results
  ADD COLUMN student_name VARCHAR(100) NULL AFTER student_id,
  ADD COLUMN exam_name VARCHAR(150) NULL AFTER exam_id;

UPDATE results r
JOIN users u ON u.id = r.student_id
JOIN exams e ON e.id = r.exam_id
SET r.student_name = u.name, r.exam_name = e.title
WHERE r.student_name IS NULL OR r.exam_name IS NULL;

ALTER TABLE results
  MODIFY COLUMN student_name VARCHAR(100) NOT NULL,
  MODIFY COLUMN exam_name VARCHAR(150) NOT NULL;

-- 4. certificates: add student_id/student_name/exam_id/exam_name/score, backfill via results.
ALTER TABLE certificates
  ADD COLUMN student_id INT NULL AFTER certificate_code,
  ADD COLUMN student_name VARCHAR(100) NULL AFTER student_id,
  ADD COLUMN exam_id INT NULL AFTER student_name,
  ADD COLUMN exam_name VARCHAR(150) NULL AFTER exam_id,
  ADD COLUMN score DECIMAL(6,2) NULL AFTER exam_name;

UPDATE certificates c
JOIN results r ON r.id = c.result_id
SET c.student_id = r.student_id,
    c.student_name = r.student_name,
    c.exam_id = r.exam_id,
    c.exam_name = r.exam_name,
    c.score = r.obtained_marks
WHERE c.student_id IS NULL;

ALTER TABLE certificates
  MODIFY COLUMN student_id INT NOT NULL,
  MODIFY COLUMN student_name VARCHAR(100) NOT NULL,
  MODIFY COLUMN exam_id INT NOT NULL,
  MODIFY COLUMN exam_name VARCHAR(150) NOT NULL,
  MODIFY COLUMN score DECIMAL(6,2) NOT NULL,
  ADD CONSTRAINT fk_certificates_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_certificates_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE;
