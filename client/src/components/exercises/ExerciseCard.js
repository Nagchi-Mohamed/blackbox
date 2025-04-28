import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardActions, Typography, Button, Collapse, Box, Divider, Chip, IconButton, Tooltip } from '@mui/material';
import { ExpandMore, Lightbulb, Check, Close, Help } from '@mui/icons-material';

const ExerciseCard = ({ exercise, level, topic }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleShowHint = () => {
    setShowHint(!showHint);
  };

  const checkAnswer = () => {
    // This would be replaced with actual answer checking logic
    const isCorrect = userAnswer === exercise.solution;
    setResult(isCorrect);
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
      </CardContent>
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
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="subtitle2" sx={{ mr: 2 }}>{t('Your Answer')}:</Typography>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              style={{ flexGrow: 1, padding: '8px' }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={checkAnswer}
              sx={{ ml: 2 }}
            >
              {t('Check')}
            </Button>
          </Box>
          {result !== null && (
            <Box display="flex" alignItems="center">
              {result ? (
                <>
                  <Check color="success" sx={{ mr: 1 }} />
                  <Typography color="success.main">{t('Correct!')}</Typography>
                </>
              ) : (
                <>
                  <Close color="error" sx={{ mr: 1 }} />
                  <Typography color="error.main">{t('Incorrect, try again')}</Typography>
                </>
              )}
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
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