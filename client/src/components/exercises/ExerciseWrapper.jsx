import React, { useState, useEffect } from 'react';
import { Card, Progress, Button, Space, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './ExerciseWrapper.less';

const ExerciseWrapper = ({
  children,
  title,
  description,
  onComplete,
  timeLimit,
  showProgress = true,
  showFeedback = true
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (timeLimit && !isComplete) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLimit, isComplete]);

  const handleTimeout = () => {
    message.warning('Time is up!');
    onComplete({ status: 'timeout', attempts });
  };

  const handleSubmit = (result) => {
    setAttempts(prev => prev + 1);
    
    if (result.correct) {
      setIsComplete(true);
      setFeedback({
        type: 'success',
        message: 'Correct! Well done!'
      });
      onComplete({ status: 'success', attempts: attempts + 1 });
    } else {
      setFeedback({
        type: 'error',
        message: result.message || 'Try again!'
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="exercise-wrapper">
      <div className="exercise-header">
        <h2>{title}</h2>
        {timeLimit && (
          <div className="timer">
            Time Left: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {description && (
        <div className="exercise-description">
          {description}
        </div>
      )}

      {showProgress && (
        <Progress
          percent={isComplete ? 100 : (attempts / 3) * 100}
          status={isComplete ? 'success' : 'active'}
          showInfo={false}
        />
      )}

      <div className="exercise-content">
        {React.cloneElement(children, {
          onSubmit: handleSubmit,
          disabled: isComplete
        })}
      </div>

      {showFeedback && feedback && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.type === 'success' ? (
            <CheckCircleOutlined className="icon" />
          ) : (
            <CloseCircleOutlined className="icon" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="exercise-footer">
        <Space>
          <Button
            type="primary"
            onClick={() => window.location.reload()}
            disabled={!isComplete}
          >
            Try Another
          </Button>
          {!isComplete && (
            <Button onClick={() => onComplete({ status: 'skip', attempts })}>
              Skip
            </Button>
          )}
        </Space>
      </div>
    </Card>
  );
};

export default ExerciseWrapper; 