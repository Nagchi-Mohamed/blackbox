CREATE TABLE IF NOT EXISTS whiteboard_states (
  state_id INT PRIMARY KEY AUTO_INCREMENT,
  classroom_id INT NOT NULL,
  state_data JSON NOT NULL,
  thumbnail_path VARCHAR(255),
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id)
); 