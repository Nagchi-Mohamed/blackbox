import React, { useState, useEffect } from 'react';
import { Modal, Button, List, Input, Select, message } from 'antd';
import { socket } from '../../services/socketService';
import './BreakoutRoomsManager.less';

const { Option } = Select;

const BreakoutRoomsManager = ({ participants, isTeacher, classroomId }) => {
  const [visible, setVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [assignParticipant, setAssignParticipant] = useState(null);
  const [assignRoom, setAssignRoom] = useState(null);

  const createRoom = () => {
    if (!newRoomName.trim()) {
      message.warning('Please enter a room name');
      return;
    }
    
    socket.emit('create-breakout-room', {
      classroomId,
      roomName: newRoomName
    }, (response) => {
      if (response.success) {
        setRooms([...rooms, response.room]);
        setNewRoomName('');
      }
    });
  };

  const assignToRoom = () => {
    if (!assignParticipant || !assignRoom) {
      message.warning('Please select both participant and room');
      return;
    }
    
    socket.emit('assign-to-breakout-room', {
      classroomId,
      participantId: assignParticipant,
      roomId: assignRoom
    }, (response) => {
      if (response.success) {
        message.success('Participant assigned successfully');
        setAssignParticipant(null);
        setAssignRoom(null);
      }
    });
  };

  const joinRoom = (roomId) => {
    socket.emit('join-breakout-room', {
      classroomId,
      roomId
    });
  };

  const closeRoom = (roomId) => {
    socket.emit('close-breakout-room', {
      classroomId,
      roomId
    }, (response) => {
      if (response.success) {
        setRooms(rooms.filter(room => room.id !== roomId));
      }
    });
  };

  useEffect(() => {
    socket.on('breakout-rooms-update', (updatedRooms) => {
      setRooms(updatedRooms);
    });

    return () => {
      socket.off('breakout-rooms-update');
    };
  }, []);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Breakout Rooms
      </Button>
      
      <Modal
        title="Breakout Rooms Manager"
        open={visible}
        onCancel={() => setVisible(false)}
        width={800}
        footer={null}
      >
        <div className="breakout-rooms-manager">
          {isTeacher && (
            <div className="create-room-section">
              <Input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter room name"
                style={{ width: 200, marginRight: 8 }}
              />
              <Button type="primary" onClick={createRoom}>
                Create Room
              </Button>
            </div>
          )}
          
          <div className="rooms-list">
            <List
              dataSource={rooms}
              renderItem={room => (
                <List.Item
                  actions={[
                    isTeacher ? (
                      <Button danger onClick={() => closeRoom(room.id)}>
                        Close
                      </Button>
                    ) : (
                      <Button onClick={() => joinRoom(room.id)}>
                        Join
                      </Button>
                    )
                  ]}
                >
                  <List.Item.Meta
                    title={room.name}
                    description={`Participants: ${room.participants.length}`}
                  />
                </List.Item>
              )}
            />
          </div>
          
          {isTeacher && (
            <div className="assignment-section">
              <Select
                placeholder="Select participant"
                style={{ width: 200, marginRight: 8 }}
                onChange={setAssignParticipant}
                value={assignParticipant}
              >
                {participants.map(participant => (
                  <Option key={participant.id} value={participant.id}>
                    {participant.name}
                  </Option>
                ))}
              </Select>
              
              <Select
                placeholder="Select room"
                style={{ width: 200, marginRight: 8 }}
                onChange={setAssignRoom}
                value={assignRoom}
              >
                {rooms.map(room => (
                  <Option key={room.id} value={room.id}>
                    {room.name}
                  </Option>
                ))}
              </Select>
              
              <Button type="primary" onClick={assignToRoom}>
                Assign
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default BreakoutRoomsManager; 