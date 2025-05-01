import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { useMemo } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AnalyticsDashboard = ({ userId }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  const welcomeMessages = {
    en: `Welcome back! Let's explore your learning journey`,
    fr: `Bienvenue! Explorons votre parcours d'apprentissage`,
    es: `¡Bienvenido! Exploremos tu viaje de aprendizaje`
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
        {t('analytics.title')}
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ 
        color: theme.palette.text.secondary,
        mb: 4
      }}>
        {welcomeMessages[t('language.code')] || welcomeMessages.en}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('analytics.achievements')}
            </Typography>
            {memoizedCharts.achievements}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('analytics.exercises')}
            </Typography>
            {memoizedCharts.exercises}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;