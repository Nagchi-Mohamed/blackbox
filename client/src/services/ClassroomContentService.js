import api from './api';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ClassroomContentService = {
  getPostsByClassroom: (classroomId) => api.get(\`/api/classroomContent/\${classroomId}/posts\`),
  createPost: (classroomId, postData) => api.post(\`/api/classroomContent/\${classroomId}/posts\`, postData),
  updatePost: (classroomId, postId, postData) => api.put(\`/api/classroomContent/\${classroomId}/posts/\${postId}\`, postData),
  deletePost: (classroomId, postId) => api.delete(\`/api/classroomContent/\${classroomId}/posts/\${postId}\`),

  getAssignmentsByClassroom: (classroomId) => api.get(\`/api/classroomContent/\${classroomId}/assignments\`),
  createAssignment: (classroomId, assignmentData) => api.post(\`/api/classroomContent/\${classroomId}/assignments\`, assignmentData),
  updateAssignment: (classroomId, assignmentId, assignmentData) => api.put(\`/api/classroomContent/\${classroomId}/assignments/\${assignmentId}\`, assignmentData),
  deleteAssignment: (classroomId, assignmentId) => api.delete(\`/api/classroomContent/\${classroomId}/assignments/\${assignmentId}\`),
};

export const createPost = async (classId, content) => {
  try {
    const docRef = await addDoc(collection(db, 'classrooms', classId, 'posts'), {
      content,
      authorId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Post creation failed');
  }
};

export default ClassroomContentService;
