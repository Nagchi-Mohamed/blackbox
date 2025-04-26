CREATE TABLE IF NOT EXISTS course_enrollments (
  enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  user_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE KEY unique_enrollment (course_id, user_id)
); 