const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const logger = require('../utils/logger');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

const authenticatedRequest = (user) => {
  return request(app)
    .post('/api/auth/login')
    .send({
      email: user.email,
      password: user.password
    })
    .then(res => request(app).set('Authorization', `Bearer ${res.body.token}`));
};

const createTestUser = async (role = 'student') => {
  const username = `test_${role}_${Date.now()}`;
  const email = `${username}@test.com`;
  const password = 'test123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    role
  });
  await user.save();

  const token = jwt.sign(
    { userId: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    user,
    token,
    rawPassword: password
  };
};

const createTestCourse = async (instructorId) => {
  const course = new Course({
    title: `Test Course ${Date.now()}`,
    description: 'Test course description',
    instructor: instructorId
  });
  await course.save();
  return course;
};

const createTestEnrollment = async (studentId, courseId) => {
  const enrollment = new Enrollment({
    student: studentId,
    course: courseId,
    enrolledAt: new Date()
  });
  await enrollment.save();
  return enrollment;
};

const createTestAssignment = async (courseId, dueDate) => {
  const assignment = new Assignment({
    title: `Test Assignment ${Date.now()}`,
    description: 'Test assignment description',
    course: courseId,
    dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default: 1 week from now
  });
  await assignment.save();
  return assignment;
};

const createTestSubmission = async (studentId, assignmentId) => {
  const submission = new Submission({
    student: studentId,
    assignment: assignmentId,
    content: 'Test submission content',
    submittedAt: new Date()
  });
  await submission.save();
  return submission;
};

const createTestAnnouncement = async (courseId, authorId) => {
  const announcement = new Announcement({
    title: `Test Announcement ${Date.now()}`,
    content: 'Test announcement content',
    course: courseId,
    author: authorId
  });
  await announcement.save();
  return announcement;
};

const createTestGrade = async (submissionId, graderId, score) => {
  const grade = new Grade({
    submission: submissionId,
    grader: graderId,
    score: score || Math.floor(Math.random() * 100),
    feedback: 'Test feedback'
  });
  await grade.save();
  return grade;
};

const createTestDiscussion = async (courseId, authorId) => {
  const discussion = new Discussion({
    title: `Test Discussion ${Date.now()}`,
    content: 'Test discussion content',
    course: courseId,
    author: authorId
  });
  await discussion.save();
  return discussion;
};

const createTestComment = async (discussionId, authorId) => {
  const comment = new Comment({
    content: 'Test comment content',
    discussion: discussionId,
    author: authorId
  });
  await comment.save();
  return comment;
};

const createTestQuiz = async (courseId, creatorId) => {
  const quiz = new Quiz({
    title: `Test Quiz ${Date.now()}`,
    description: 'Test quiz description',
    course: courseId,
    creator: creatorId,
    questions: [{
      text: 'Sample question',
      options: ['Option 1', 'Option 2', 'Option 3'],
      correctAnswer: 0
    }]
  });
  await quiz.save();
  return quiz;
};

const createTestQuestion = async (quizId) => {
  const question = new Question({
    quiz: quizId,
    text: `Test Question ${Date.now()}`,
    options: ['Option A', 'Option B', 'Option C'],
    correctAnswer: 1
  });
  await question.save();
  return question;
};

const createTestAnswer = async (questionId, studentId, selectedOption) => {
  const answer = new Answer({
    question: questionId,
    student: studentId,
    selectedOption: selectedOption || 0,
    answeredAt: new Date()
  });
  await answer.save();
  return answer;
};

module.exports = {
  authenticatedRequest,
  createTestUser,
  createTestCourse,
  createTestEnrollment,
  createTestAssignment,
  createTestSubmission,
  createTestAnnouncement,
  createTestGrade,
  createTestDiscussion,
  createTestComment,
  createTestQuiz,
  createTestQuestion,
  createTestAnswer
};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');