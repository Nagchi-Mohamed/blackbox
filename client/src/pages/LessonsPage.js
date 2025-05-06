import React, { useState } from 'react';
import {
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Stack,
  Paper,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LessonsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Shared state for both sections
  const [searchTerm, setSearchTerm] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

  // Static data for years per education level
  const yearsByEducationLevel = {
    primary: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'],
    secondary: ['Year 1', 'Year 2', 'Year 3'],
    highschool: ['Year 1', 'Year 2', 'Year 3'],
  };

  // Static data for lessons per year
  const lessonsByYear = {
    'Year 1': ['Lesson 1A', 'Lesson 1B', 'Lesson 1C'],
    'Year 2': ['Lesson 2A', 'Lesson 2B'],
    'Year 3': ['Lesson 3A', 'Lesson 3B', 'Lesson 3C'],
    'Year 4': ['Lesson 4A', 'Lesson 4B'],
    'Year 5': ['Lesson 5A', 'Lesson 5B', 'Lesson 5C'],
    'Year 6': ['Lesson 6A', 'Lesson 6B'],
  };

  // Handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleLevelChange = (e) => {
    setEducationLevel(e.target.value);
    setSelectedYear('');
    setSelectedLesson('');
  };
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedLesson('');
  };
  const handleLessonChange = (e) => setSelectedLesson(e.target.value);

  // Determine if year selector should show
  const showYearSelector =
    educationLevel &&
    educationLevel !== 'college' &&
    yearsByEducationLevel[educationLevel]?.length > 0;

  // Determine if lesson selector should show
  const showLessonSelector =
    educationLevel &&
    (educationLevel === 'college' ||
      (selectedYear && lessonsByYear[selectedYear]?.length > 0));

  // Button click handlers
  const handleViewLesson = () => {
    if (selectedLesson) {
      const lessonId = encodeURIComponent(selectedLesson);
      navigate(`/lessons/${lessonId}`);
    }
  };

  const handleViewExercises = () => {
    if (selectedLesson) {
      const lessonId = encodeURIComponent(selectedLesson);
      navigate(`/exercises/${lessonId}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={6}>
          {/* Left side: Lessons */}
          <Grid item xs={12} md={6}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                {t('Lessons')}
              </Typography>
            </Box>
            <Stack spacing={3}>
              <TextField
                label={t('Search lessons')}
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FormControl fullWidth>
                <InputLabel id="education-level-label">{t('Education Level')}</InputLabel>
                <Select
                  labelId="education-level-label"
                  value={educationLevel}
                  onChange={handleLevelChange}
                  label={t('Education Level')}
                >
                  <MenuItem value="">
                    <em>{t('None')}</em>
                  </MenuItem>
                  <MenuItem value="primary">{t('Primary')}</MenuItem>
                  <MenuItem value="secondary">{t('Secondary')}</MenuItem>
                  <MenuItem value="highschool">{t('High School')}</MenuItem>
                  <MenuItem value="college">{t('College')}</MenuItem>
                </Select>
              </FormControl>
              {showYearSelector && (
                <FormControl fullWidth>
                  <InputLabel id="year-label">{t('Year')}</InputLabel>
                  <Select
                    labelId="year-label"
                    value={selectedYear}
                    onChange={handleYearChange}
                    label={t('Year')}
                  >
                    <MenuItem value="">
                      <em>{t('None')}</em>
                    </MenuItem>
                    {yearsByEducationLevel[educationLevel].map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {showLessonSelector && (
                <FormControl fullWidth>
                  <InputLabel id="lesson-label">{t('Lesson')}</InputLabel>
                  <Select
                    labelId="lesson-label"
                    value={selectedLesson}
                    onChange={handleLessonChange}
                    label={t('Lesson')}
                  >
                    <MenuItem value="">
                      <em>{t('None')}</em>
                    </MenuItem>
                    {(educationLevel === 'college'
                      ? Object.values(lessonsByYear).flat()
                      : lessonsByYear[selectedYear] || []
                    ).map((lesson) => (
                      <MenuItem key={lesson} value={lesson}>
                        {lesson}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedLesson}
                onClick={handleViewLesson}
              >
                {t('View Lesson')}
              </Button>
            </Stack>
          </Grid>

          {/* Right side: Exercises */}
          <Grid item xs={12} md={6}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                {t('Exercises')}
              </Typography>
            </Box>
            <Stack spacing={3}>
              <TextField
                label={t('Search lessons')}
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FormControl fullWidth>
                <InputLabel id="education-level-label-ex">{t('Education Level')}</InputLabel>
                <Select
                  labelId="education-level-label-ex"
                  value={educationLevel}
                  onChange={handleLevelChange}
                  label={t('Education Level')}
                >
                  <MenuItem value="">
                    <em>{t('None')}</em>
                  </MenuItem>
                  <MenuItem value="primary">{t('Primary')}</MenuItem>
                  <MenuItem value="secondary">{t('Secondary')}</MenuItem>
                  <MenuItem value="highschool">{t('High School')}</MenuItem>
                  <MenuItem value="college">{t('College')}</MenuItem>
                </Select>
              </FormControl>
              {showYearSelector && (
                <FormControl fullWidth>
                  <InputLabel id="year-label-ex">{t('Year')}</InputLabel>
                  <Select
                    labelId="year-label-ex"
                    value={selectedYear}
                    onChange={handleYearChange}
                    label={t('Year')}
                  >
                    <MenuItem value="">
                      <em>{t('None')}</em>
                    </MenuItem>
                    {yearsByEducationLevel[educationLevel].map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {showLessonSelector && (
                <FormControl fullWidth>
                  <InputLabel id="lesson-label-ex">{t('Lesson')}</InputLabel>
                  <Select
                    labelId="lesson-label-ex"
                    value={selectedLesson}
                    onChange={handleLessonChange}
                    label={t('Lesson')}
                  >
                    <MenuItem value="">
                      <em>{t('None')}</em>
                    </MenuItem>
                    {(educationLevel === 'college'
                      ? Object.values(lessonsByYear).flat()
                      : lessonsByYear[selectedYear] || []
                    ).map((lesson) => (
                      <MenuItem key={lesson} value={lesson}>
                        {lesson}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <Button
                variant="contained"
                color="secondary"
                disabled={!selectedLesson}
                onClick={handleViewExercises}
              >
                {t('View Exercises')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LessonsPage;
