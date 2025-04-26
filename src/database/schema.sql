-- Create database if not exists
CREATE DATABASE IF NOT EXISTS brainymath;
USE brainymath;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  course_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
  module_id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  sequence_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  lesson_id INT PRIMARY KEY AUTO_INCREMENT,
  module_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content_type ENUM('video', 'text', 'quiz', 'assignment') NOT NULL,
  content_url VARCHAR(255),
  content_text TEXT,
  duration_minutes INT NOT NULL,
  sequence_order INT NOT NULL,
  is_free_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(module_id)
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  UNIQUE KEY unique_enrollment (user_id, course_id)
);

-- Classrooms table
CREATE TABLE IF NOT EXISTS classrooms (
  classroom_id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  max_participants INT DEFAULT 50,
  status ENUM('scheduled', 'live', 'ended') DEFAULT 'scheduled',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Classroom participants table
CREATE TABLE IF NOT EXISTS classroom_participants (
  participant_id INT PRIMARY KEY AUTO_INCREMENT,
  classroom_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('host', 'participant') DEFAULT 'participant',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP NULL,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Recordings table
CREATE TABLE IF NOT EXISTS recordings (
  recording_id INT PRIMARY KEY AUTO_INCREMENT,
  classroom_id INT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_courses_created_by ON courses(created_by);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_classrooms_course ON classrooms(course_id);
CREATE INDEX idx_classrooms_created_by ON classrooms(created_by);
CREATE INDEX idx_participants_classroom ON classroom_participants(classroom_id);
CREATE INDEX idx_participants_user ON classroom_participants(user_id);
CREATE INDEX idx_recordings_classroom ON recordings(classroom_id); 