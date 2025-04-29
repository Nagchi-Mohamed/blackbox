import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ExerciseRenderer from '../components/exercises/ExerciseRenderer';
import { generateMathExercise, checkAnswer } from '../services/exerciseService';

const Exercises = () => {
  const { t } = useTranslation();
  const [exercise, setExercise] = useState(null);
  const [type, setType] = useState('algebra');
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const handleGenerateExercise = () => {
    const newExercise = generateMathExercise(type, difficulty);
    setExercise(newExercise);
  };

  const handleSubmitAnswer = (answer) => {
    const result = checkAnswer(exercise, answer);
    setTotalAttempts(prev => prev + 1);
    if (result.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleHint = () => {
    // Implement hint system
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('exercises.title')}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>{t('exercises.type')}</InputLabel>
            <Select
              value={type}
              label={t('exercises.type')}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="algebra">{t('exercises.algebra')}</MenuItem>
              <MenuItem value="geometry">{t('exercises.geometry')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>{t('exercises.difficulty')}</InputLabel>
            <Select
              value={difficulty}
              label={t('exercises.difficulty')}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <MenuItem value="easy">{t('exercises.easy')}</MenuItem>
              <MenuItem value="medium">{t('exercises.medium')}</MenuItem>
              <MenuItem value="hard">{t('exercises.hard')}</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleGenerateExercise}
          >
            {t('exercises.generate')}
          </Button>
        </Box>

        <Typography variant="body1" gutterBottom>
          {t('exercises.score')}: {score}/{totalAttempts}
        </Typography>
      </Paper>

      {exercise && (
        <ExerciseRenderer
          exercise={exercise}
          onSubmit={handleSubmitAnswer}
          onHint={handleHint}
        />
      )}
    </Box>
  );
};

export default Exercises; 