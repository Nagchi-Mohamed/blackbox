import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Progress, Space, message } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import './PollManager.less';

const PollManager = ({ classroomId }) => {
  const [polls, setPolls] = useState([]);
  const [activePoll, setActivePoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    if (!socket) return;

    socket.on('poll-created', (poll) => {
      setPolls(prev => [...prev, poll]);
      setActivePoll(poll.id);
      setShowResults(false);
    });

    socket.on('poll-results', (updatedPoll) => {
      setPolls(prev => prev.map(p => 
        p.id === updatedPoll.id ? updatedPoll : p
      ));
    });

    return () => {
      socket.off('poll-created');
      socket.off('poll-results');
    };
  }, [socket]);

  const createPoll = (question, options) => {
    socket.emit('create-poll', {
      classroomId,
      question,
      options: options.map(opt => ({ text: opt, votes: 0 }))
    });
  };

  const submitVote = () => {
    if (!selectedOption) {
      message.warning('Please select an option');
      return;
    }

    socket.emit('submit-vote', {
      pollId: activePoll,
      optionId: selectedOption
    });
    setShowResults(true);
  };

  const endPoll = () => {
    socket.emit('end-poll', { pollId: activePoll });
    setActivePoll(null);
    setSelectedOption(null);
    setShowResults(false);
  };

  const currentPoll = polls.find(p => p.id === activePoll);

  return (
    <div className="poll-manager">
      {isTeacher && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => createPoll('Sample Question', ['Option 1', 'Option 2', 'Option 3'])}
        >
          Create Poll
        </Button>
      )}

      {currentPoll && (
        <Card className="poll-card">
          <h3>{currentPoll.question}</h3>
          
          {!showResults ? (
            <Radio.Group
              value={selectedOption}
              onChange={e => setSelectedOption(e.target.value)}
            >
              <Space direction="vertical">
                {currentPoll.options.map((option, index) => (
                  <Radio key={index} value={index}>
                    {option.text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          ) : (
            <div className="poll-results">
              {currentPoll.options.map((option, index) => (
                <div key={index} className="result-item">
                  <div className="option-text">{option.text}</div>
                  <Progress
                    percent={Math.round((option.votes / currentPoll.totalVotes) * 100)}
                    format={percent => `${option.votes} votes (${percent}%)`}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="poll-actions">
            {!showResults ? (
              <Button type="primary" onClick={submitVote}>
                Submit Vote
              </Button>
            ) : (
              isTeacher && (
                <Button type="primary" danger onClick={endPoll}>
                  End Poll
                </Button>
              )
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PollManager; 