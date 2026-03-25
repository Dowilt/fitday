import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';

import WorkoutTab from './components/WorkoutTab';
import ProgressTab from './components/ProgressTab';
import SettingsTab from './components/SettingsTab';
import HistoryTab from './components/HistoryTab';

const API = process.env.REACT_APP_API_URL || '/api';

const theme = createTheme({
  palette: {
    primary: { main: '#009688' },
    secondary: { main: '#ff9800' },
  },
});

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ p: 0, height: '100%' }}>{children}</Box> : null;
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [settings, setSettings] = useState({ calorie_goal: 300, notifications: true, sound: false, vibration: true });
  const [history, setHistory] = useState([]);

  const fetchExercises = useCallback(async () => {
    try {
      const res = await fetch(`${API}/exercises`);
      const data = await res.json();
      setExercises(data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API}/settings`);
      const data = await res.json();
      setSettings(data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/history`);
      const data = await res.json();
      setHistory(data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchExercises();
    fetchSettings();
    fetchHistory();
  }, [fetchExercises, fetchSettings, fetchHistory]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" sx={{ bgcolor: 'primary.light' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>FitDay</Typography>
          </Toolbar>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth"
            textColor="inherit" indicatorColor="secondary"
            sx={{ bgcolor: 'primary.main' }}>
            <Tab icon={<FitnessCenterIcon />} label="Тренировка" />
            <Tab icon={<BarChartIcon />} label="Прогресс" />
            <Tab icon={<SettingsIcon />} label="Настройки" />
            <Tab icon={<HistoryIcon />} label="История" />
          </Tabs>
        </AppBar>

        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <TabPanel value={tab} index={0}>
            <WorkoutTab exercises={exercises} onRefresh={fetchExercises} api={API} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <ProgressTab exercises={exercises} calorieGoal={settings.calorie_goal} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <SettingsTab settings={settings} onRefresh={() => { fetchSettings(); fetchExercises(); }} api={API} />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <HistoryTab history={history} exercises={exercises}
              onRefresh={() => { fetchHistory(); fetchExercises(); }} api={API} />
          </TabPanel>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
