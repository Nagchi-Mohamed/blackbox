const request = require('supertest');
const app = require('../server');
const pool = require('../utils/db');
const { createTestUser, createTestCourse } = require('./testUtils');

describe('Enrollment API', () => {
  let studentToken;
  let instructorToken;
  let courseId;
  let studentId;

  beforeAll(async () => {
    // Create test users and course
    const student = await createTestUser('student');
    const instructor = await createTestUser('instructor');
    studentToken = student.token;
    instructorToken = instructor.token;
    studentId = student.userId;

    const course = await createTestCourse(instructor.userId);
    courseId = course.courseId;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /courses/:courseId/enroll', () => {
    it('should enroll student in course', async () => {
      const res = await request(app)
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('enrollment_id');
    });

    it('should prevent duplicate enrollments', async () => {
      const res = await request(app)
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /enrollments', () => {
    it('should return user enrollments', async () => {
      const res = await request(app)
        .get('/api/enrollments')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /enrollments/:enrollmentId', () => {
    it('should update enrollment status', async () => {
      // First get the enrollment ID
      const [enrollments] = await pool.query(
        'SELECT enrollment_id FROM enrollments WHERE user_id = ?',
        [studentId]
      );
      const enrollmentId = enrollments[0].enrollment_id;

      const res = await request(app)
        .patch(`/api/enrollments/${enrollmentId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ status: 'completed', progress_percentage: 100 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('completed');
    });
  });
}); 