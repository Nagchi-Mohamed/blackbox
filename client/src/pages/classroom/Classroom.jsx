import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Button, message } from 'antd';
import { VideoCameraOutlined, AudioOutlined, ShareScreenOutlined } from '@ant-design/icons';
import Whiteboard from '../../components/classroom/Whiteboard';
import VideoChat from '../../components/classroom/VideoChat';
import ParticipantsPanel from '../../components/classroom/ParticipantsPanel';
import ChatPanel from '../../components/classroom/ChatPanel';
import MathEquationEditor from '../../components/classroom/MathEquationEditor';
import BreakoutRoomsManager from '../../components/classroom/BreakoutRoomsManager';
import FileSharing from '../../components/classroom/FileSharing';
import ClassroomControls from '../../components/classroom/ClassroomControls';
import socket, { connectSocket, disconnectSocket, joinRoom, leaveRoom } from '../../services/socketService';
import { classroomService } from '../../services/classroomService';
import './Classroom.less';

const { Content, Sider } = Layout;

const Classroom = () => {
  const { id: classroomId } = useParams();
  const [whiteboardData, setWhiteboardData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [equationEditorVisible, setEquationEditorVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const whiteboardRef = useRef();
  const fileSharingRef = useRef();

  useEffect(() => {
    const initializeClassroom = async () => {
      try {
        // Fetch classroom data and verify user role
        const classroom = await classroomService.getClassroom(classroomId);
        setIsTeacher(classroom.isTeacher);
        
        // Connect to socket
        connectSocket();
        joinRoom(classroomId);
        
        // Set up socket listeners
        socket.on('whiteboard-update', (data) => {
          if (whiteboardRef.current) {
            whiteboardRef.current.updateFromServer(data);
          }
        });
        
        socket.on('participants-update', (updatedParticipants) => {
          setParticipants(updatedParticipants);
        });
        
        socket.on('new-message', (message) => {
          setMessages(prev => [...prev, message]);
        });
        
        // Load initial whiteboard state
        const whiteboardState = await classroomService.getWhiteboardState(classroomId);
        setWhiteboardData(whiteboardState);
        
      } catch (error) {
        message.error('Failed to initialize classroom: ' + error.message);
      }
    };
    
    initializeClassroom();
    
    return () => {
      socket.off('whiteboard-update');
      socket.off('participants-update');
      socket.off('new-message');
      leaveRoom(classroomId);
      disconnectSocket();
    };
  }, [classroomId]);

  const handleWhiteboardChange = (data) => {
    socket.emit('whiteboard-update', { 
      classroomId, 
      data 
    });
  };

  const sendMessage = (message) => {
    socket.emit('send-message', {
      classroomId,
      message
    });
  };

  const handleSaveWhiteboard = async () => {
    try {
      const data = whiteboardRef.current.toJSON();
      await classroomService.saveWhiteboardState(classroomId, data);
      message.success('Whiteboard saved successfully');
    } catch (error) {
      message.error('Failed to save whiteboard: ' + error.message);
    }
  };

  const handleInviteStudents = () => {
    const inviteLink = `${window.location.origin}/join/${classroomId}`;
    navigator.clipboard.writeText(inviteLink);
    message.success('Invite link copied to clipboard');
  };

  return (
    <Layout className="classroom-container">
      <Content className="main-content">
        <div className="whiteboard-container">
          <Whiteboard 
            ref={whiteboardRef}
            initialData={whiteboardData} 
            onChange={handleWhiteboardChange}
            editable={isTeacher}
            onEquationEditorOpen={() => setEquationEditorVisible(true)}
          />
        </div>
        <div className="video-chat-container">
          <VideoChat classroomId={classroomId} />
        </div>
      </Content>
      
      <Sider width={300} className="classroom-sidebar">
        <div className="sidebar-section">
          <ParticipantsPanel 
            participants={participants} 
            isTeacher={isTeacher}
          />
        </div>
        <div className="sidebar-section">
          <ChatPanel 
            messages={messages} 
            onSend={sendMessage}
          />
        </div>
      </Sider>

      <div className="classroom-controls-container">
        <ClassroomControls
          isTeacher={isTeacher}
          onToggleVideo={() => {}}
          onToggleAudio={() => {}}
          onToggleScreenShare={() => {}}
          onInviteStudents={handleInviteStudents}
          onUploadFile={() => fileSharingRef.current.open()}
          onSaveWhiteboard={handleSaveWhiteboard}
          onSettings={() => setSettingsVisible(true)}
        />
      </div>

      <MathEquationEditor
        visible={equationEditorVisible}
        onInsert={(equation) => whiteboardRef.current.addMathEquation(equation)}
        onCancel={() => setEquationEditorVisible(false)}
      />

      <BreakoutRoomsManager
        participants={participants}
        isTeacher={isTeacher}
        classroomId={classroomId}
      />

      <FileSharing
        ref={fileSharingRef}
        classroomId={classroomId}
        isTeacher={isTeacher}
      />
    </Layout>
  );
};

export default Classroom; 