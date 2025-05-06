import { useState } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material';

const Quiz = ({ quiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {quiz.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {quiz.description}
      </Typography>

      {quiz.questions.map((question, qIndex) => (
        <Box key={question.id} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Question {qIndex + 1}: {question.text}
          </Typography>
          <RadioGroup>
            {question.options.map((option, oIndex) => (
              <FormControlLabel
                key={oIndex}
                value={oIndex}
                control={<Radio />}
                label={option}
                checked={selectedAnswers[question.id] === oIndex}
                onChange={() => handleAnswerChange(question.id, oIndex)}
                disabled={submitted}
              />
            ))}
          </RadioGroup>
          {submitted && (
            <Typography variant="body2" color={selectedAnswers[question.id] === question.correctAnswer ? 'success.main' : 'error.main'}>
              {selectedAnswers[question.id] === question.correctAnswer ? 'Correct!' : `Correct answer: ${question.options[question.correctAnswer]}`}
            </Typography>
          )}
        </Box>
      ))}

      {!submitted && (
        <Button variant="contained" onClick={handleSubmit}>
          Submit Quiz
        </Button>
      )}
    </Box>
  );
};

export default Quiz;