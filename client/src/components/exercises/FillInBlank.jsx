import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import './FillInBlank.less';

const FillInBlank = ({
  text,
  blanks,
  correctAnswers,
  onSubmit,
  disabled
}) => {
  const [answers, setAnswers] = useState({});
  const [showHints, setShowHints] = useState({});

  const handleInputChange = (index, value) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleSubmit = () => {
    const allAnswered = blanks.every((_, index) => answers[index]);
    if (!allAnswered) return;

    const isCorrect = blanks.every((_, index) => 
      answers[index].toLowerCase().trim() === correctAnswers[index].toLowerCase().trim()
    );

    onSubmit({
      correct: isCorrect,
      message: isCorrect ? 'Correct!' : 'Some answers are incorrect. Try again!'
    });
  };

  const handleShowHint = (index) => {
    setShowHints(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const renderText = () => {
    let result = [];
    let lastIndex = 0;

    blanks.forEach((blank, index) => {
      // Add text before the blank
      result.push(text.slice(lastIndex, blank.start));
      
      // Add the input field
      result.push(
        <Space key={`blank-${index}`} className="blank-container">
          <Input
            value={answers[index] || ''}
            onChange={e => handleInputChange(index, e.target.value)}
            disabled={disabled}
            placeholder="Enter your answer"
            className="blank-input"
          />
          {!disabled && !showHints[index] && (
            <Button
              type="link"
              onClick={() => handleShowHint(index)}
              className="hint-button"
            >
              Hint
            </Button>
          )}
          {showHints[index] && (
            <span className="hint">
              Hint: {correctAnswers[index].length} letters
            </span>
          )}
        </Space>
      );

      lastIndex = blank.end;
    });

    // Add remaining text
    result.push(text.slice(lastIndex));

    return result;
  };

  return (
    <div className="fill-in-blank">
      <div className="text">
        {renderText()}
      </div>

      <div className="actions">
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={disabled || !blanks.every((_, index) => answers[index])}
        >
          Submit Answers
        </Button>
      </div>
    </div>
  );
};

export default FillInBlank; 