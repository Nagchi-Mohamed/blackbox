// Classroom context provider to manage global state
import { createContext, useContext, useState } from 'react';

const ClassroomContext = createContext();

export function ClassroomProvider({ children }) {
  const [participants, setParticipants] = useState([
    {
      id: '1',
      name: 'Teacher',
      role: 'Instructor',
      status: 'Online',
      avatar: '/avatars/teacher.png'
    }
  ]);
  const [whiteboardContent, setWhiteboardContent] = useState(null);
  const [activeTool, setActiveTool] = useState('pen');
  const [messages, setMessages] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [recordings, setRecordings] = useState([]);

  const value = {
    participants,
    setParticipants,
    whiteboardContent,
    setWhiteboardContent,
    activeTool,
    setActiveTool,
    messages,
    setMessages,
    sendMessage: (message) => {
      setMessages(prev => [...prev, message]);
    },
    sharedFiles,
    setSharedFiles,
    shareFile: (file) => {
      setSharedFiles(prev => [...prev, file]);
    },
    recordings,
    setRecordings,
    addRecording: (recording) => {
      setRecordings(prev => [...prev, recording]);
    }
  };
  
  return (
    <ClassroomContext.Provider value={value}>
      {children}
    </ClassroomContext.Provider>
  );
}

export function useClassroom() {
  return useContext(ClassroomContext);
}

export function addParticipant(participant) {
  setParticipants(prev => [...prev, participant]);
}

export function removeParticipant(id) {
  setParticipants(prev => prev.filter(p => p.id !== id));
}