import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import { ExpandMore, Lightbulb } from '@mui/icons-material';

const ExerciseCard = ({ exercise, level, topic }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleShowHint = () => {
    setShowHint(!showHint);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      // Add your API call here to check the answer
      const isCorrect = userAnswer === exercise.solution;
      setResult(isCorrect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{exercise.title}</Typography>
          <Box>
            <Chip label={level} size="small" sx={{ mr: 1 }} />
            <Chip label={topic} size="small" color="secondary" />
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {exercise.question}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {result !== null && (
          <Alert severity={result ? 'success' : 'error'} sx={{ mb: 2 }}>
            {result ? t('exercises.correct') : t('exercises.incorrect')}
          </Alert>
        )}

        <TextField
          fullWidth
          label={t('exercises.yourAnswer')}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          margin="normal"
        />

        <CardActions disableSpacing>
          <Tooltip title={t('Hint')}>
            <IconButton onClick={handleShowHint}>
              <Lightbulb color={showHint ? 'primary' : 'inherit'} />
            </IconButton>
          </Tooltip>
          <Button
            size="small"
            endIcon={<ExpandMore sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />}
            onClick={handleExpandClick}
          >
            {expanded ? t('Hide Solution') : t('Show Solution')}
          </Button>
        </CardActions>
        <Collapse in={showHint} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle2">{t('Hint')}:</Typography>
            <Typography variant="body2">{exercise.hint}</Typography>
          </CardContent>
        </Collapse>
      </CardContent>
      <CardActions>
        <Button
          onClick={() => setShowSolution(!showSolution)}
          disabled={loading}
        >
          {showSolution ? t('exercises.hideSolution') : t('exercises.showSolution')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !userAnswer}
        >
          {loading ? <CircularProgress size={24} /> : t('exercises.check')}
        </Button>
      </CardActions>
      <Collapse in={showSolution} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="subtitle2">{t('Solution')}:</Typography>
          <Typography variant="body2">{exercise.solution}</Typography>
          {exercise.steps && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>{t('Step-by-Step')}:</Typography>
              <ol>
                {exercise.steps.map((step, index) => (
                  <li key={index}>
                    <Typography variant="body2">{step}</Typography>
                  </li>
                ))}
              </ol>
            </>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ExerciseCard; 