import React from 'react';
import { List, Avatar, Badge, Button, Tooltip } from 'antd';
import { UserOutlined, AudioOutlined, VideoCameraOutlined } from '@ant-design/icons';
import './ParticipantsPanel.less';

const ParticipantsPanel = ({ participants, isTeacher }) => {
  const renderParticipantStatus = (participant) => {
    const status = [];
    if (participant.isVideoOn) {
      status.push(
        <Tooltip key="video" title="Video On">
          <VideoCameraOutlined className="status-icon" />
        </Tooltip>
      );
    }
    if (participant.isAudioOn) {
      status.push(
        <Tooltip key="audio" title="Audio On">
          <AudioOutlined className="status-icon" />
        </Tooltip>
      );
    }
    return status;
  };

  const renderParticipantActions = (participant) => {
    if (!isTeacher) return null;

    return (
      <div className="participant-actions">
        <Tooltip title="Mute Participant">
          <Button
            type="text"
            icon={<AudioOutlined />}
            onClick={() => handleMuteParticipant(participant.id)}
          />
        </Tooltip>
        <Tooltip title="Remove from Classroom">
          <Button
            type="text"
            danger
            onClick={() => handleRemoveParticipant(participant.id)}
          >
            Remove
          </Button>
        </Tooltip>
      </div>
    );
  };

  const handleMuteParticipant = (participantId) => {
    // Implement mute functionality
  };

  const handleRemoveParticipant = (participantId) => {
    // Implement remove functionality
  };

  return (
    <div className="participants-panel">
      <h3>Participants ({participants.length})</h3>
      <List
        itemLayout="horizontal"
        dataSource={participants}
        renderItem={participant => (
          <List.Item
            actions={[renderParticipantActions(participant)]}
          >
            <List.Item.Meta
              avatar={
                <Badge
                  status={participant.isOnline ? 'success' : 'default'}
                  dot
                >
                  <Avatar icon={<UserOutlined />} />
                </Badge>
              }
              title={participant.name}
              description={
                <div className="participant-status">
                  {renderParticipantStatus(participant)}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ParticipantsPanel; 