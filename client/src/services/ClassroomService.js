import api from '../api';

const ClassroomService = {
  getAllClassrooms: () => api.get('/api/classrooms'),
  createClassroom: (classroomData) => api.post('/api/classrooms', classroomData),
  joinClassroom: (classroomId) => api.post(`/api/classrooms/${classroomId}/join`),
};

export default ClassroomService;
