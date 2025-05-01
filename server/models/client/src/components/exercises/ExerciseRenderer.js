import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, TextField, Paper } from '@mui/material';

const ExerciseRenderer = ({ exercise, onSubmit, onHint }) => {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (answer.trim()) {
      setIsSubmitted(true);
      onSubmit(answer);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    onHint();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 2 }}>
      <Typography variant="h5" gutterBottom>
        {exercise.title}
      </Typography>

      <Box sx={{ my: 2 }}>
        <Typography variant="body1" component="div">
          {exercise.question}
        </Typography>
      </Box>

      {exercise.image && (
        <Box sx={{ my: 2, textAlign: 'center' }}>
          <img
            src={exercise.image}
            alt={exercise.title}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>
      )}

      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          label={t('exercises.answer')}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isSubmitted}
          multiline
          rows={2}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={handleHint}
          disabled={showHint || isSubmitted}
        >
          {t('exercises.hint')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!answer.trim() || isSubmitted}
        >
          {t('exercises.submit')}
        </Button>
      </Box>

      {showHint && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {exercise.hint}
          </Typography>
        </Box>
      )}

      {isSubmitted && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body1"
            color={exercise.isCorrect ? 'success.main' : 'error.main'}
          >
            {exercise.isCorrect
              ? t('exercises.correct')
              : t('exercises.incorrect')}
          </Typography>
          {!exercise.isCorrect && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('exercises.correctAnswer')}: {exercise.correctAnswer}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default ExerciseRenderer; 