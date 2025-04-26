import React, { useState } from 'react';
import { Radio, Space, Button } from 'antd';
import './MultipleChoice.less';

const MultipleChoice = ({
  question,
  options,
  correctAnswer,
  onSubmit,
  disabled
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === correctAnswer;
    onSubmit({
      correct: isCorrect,
      message: isCorrect ? 'Correct!' : 'Incorrect. Try again!'
    });

    if (!isCorrect) {
      setShowExplanation(true);
    }
  };

  return (
    <div className="multiple-choice">
      <div className="question">
        {question}
      </div>

      <Radio.Group
        value={selectedOption}
        onChange={e => setSelectedOption(e.target.value)}
        disabled={disabled}
      >
        <Space direction="vertical">
          {options.map((option, index) => (
            <Radio
              key={index}
              value={index}
              className={`option ${selectedOption === index ? 'selected' : ''}`}
            >
              {option}
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      {showExplanation && !disabled && (
        <div className="explanation">
          <p>Explanation: {options[correctAnswer]}</p>
        </div>
      )}

      <div className="actions">
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!selectedOption || disabled}
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

export default MultipleChoice; 