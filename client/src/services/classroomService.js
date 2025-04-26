import api from './api';

export const classroomService = {
  getClassroom: async (classroomId) => {
    const response = await api.get(`/classrooms/${classroomId}`);
    return response.data;
  },
  
  getWhiteboardState: async (classroomId) => {
    const response = await api.get(`/whiteboard/${classroomId}`);
    return response.data;
  },
  
  saveWhiteboardState: async (classroomId, data) => {
    const response = await api.post(`/whiteboard/${classroomId}`, { data });
    return response.data;
  },
  
  startRecording: async (classroomId) => {
    const response = await api.post(`/recordings/start`, { classroomId });
    return response.data;
  },
  
  stopRecording: async (recordingId) => {
    const response = await api.post(`/recordings/${recordingId}/stop`);
    return response.data;
  },
  
  getRecordings: async (classroomId) => {
    const response = await api.get(`/recordings?classroomId=${classroomId}`);
    return response.data;
  },

  // File sharing methods
  uploadFile: async (formData) => {
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  getFiles: async (classroomId) => {
    const response = await api.get(`/files?classroomId=${classroomId}`);
    return response.data;
  },
  
  downloadFile: async (classroomId, fileId) => {
    const response = await api.get(`/files/${fileId}/download?classroomId=${classroomId}`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  deleteFile: async (classroomId, fileId) => {
    const response = await api.delete(`/files/${fileId}?classroomId=${classroomId}`);
    return response.data;
  },
  
  // Breakout rooms methods
  createBreakoutRoom: async (classroomId, roomName) => {
    const response = await api.post('/breakout-rooms', { classroomId, roomName });
    return response.data;
  },
  
  getBreakoutRooms: async (classroomId) => {
    const response = await api.get(`/breakout-rooms?classroomId=${classroomId}`);
    return response.data;
  },
  
  assignToBreakoutRoom: async (classroomId, participantId, roomId) => {
    const response = await api.post('/breakout-rooms/assign', { 
      classroomId, 
      participantId, 
      roomId 
    });
    return response.data;
  },
  
  joinBreakoutRoom: async (classroomId, roomId) => {
    const response = await api.post('/breakout-rooms/join', { classroomId, roomId });
    return response.data;
  },
  
  closeBreakoutRoom: async (classroomId, roomId) => {
    const response = await api.post('/breakout-rooms/close', { classroomId, roomId });
    return response.data;
  }
}; 