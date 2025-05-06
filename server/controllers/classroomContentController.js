
const Post = require('../models/Post');
const Assignment = require('../models/Assignment');
const Comment = require('../models/Comment');
const Submission = require('../models/Submission');


// Get posts for a classroom
exports.getPostsByClassroom = async (req, res) => {
  try {
    const posts = await Post.find({ classroom: req.params.classroomId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Comments for posts and assignments
exports.getComments = async (req, res) => {
  try {
    const { postId, assignmentId } = req.params;
    let filter = {};
    if (postId) filter.post = postId;
    if (assignmentId) filter.assignment = assignmentId;

    const comments = await Comment.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { postId, assignmentId } = req.params;
    const { content } = req.body;
    const author = req.user._id;

    const comment = new Comment({
      post: postId,
      assignment: assignmentId,
      author,
      content,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Submissions for assignments
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignment: assignmentId })
      .populate('student', 'name email')
      .populate('gradedBy', 'name email')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { content, attachments } = req.body;
    const student = req.user._id;

    const submission = new Submission({
      assignment: assignmentId,
      student,
      content,
      attachments,
      status: 'submitted',
      submittedAt: new Date(),
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback, status } = req.body;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = grade || submission.grade;
    submission.feedback = feedback || submission.feedback;
    submission.status = status || submission.status;
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();

    await submission.save();
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { type, title, content, attachments } = req.body;
    const author = req.user._id;

    const post = new Post({
      classroom: classroomId,
      author,
      type,
      title,
      content,
      attachments,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type, title, content, attachments } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Optional: check if req.user is author or teacher

    post.type = type || post.type;
    post.title = title || post.title;
    post.content = content || post.content;
    post.attachments = attachments || post.attachments;
    post.updatedAt = new Date();

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Optional: check if req.user is author or teacher

    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get assignments for a classroom
exports.getAssignmentsByClassroom = async (req, res) => {
  try {
    const assignments = await Assignment.find({ classroom: req.params.classroomId })
      .populate('author', 'name email')
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { title, description, dueDate, attachments } = req.body;
    const author = req.user._id;

    const assignment = new Assignment({
      classroom: classroomId,
      author,
      title,
      description,
      dueDate,
      attachments,
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, description, dueDate, attachments } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Optional: check if req.user is author or teacher

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.attachments = attachments || assignment.attachments;
    assignment.updatedAt = new Date();

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Optional: check if req.user is author or teacher

    await assignment.remove();
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
