-- Indexes for lessons table
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_sequence ON lessons(module_id, sequence_order); 