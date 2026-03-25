import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';

const INITIAL_TIME = 30;

export default function TimerScreen({ exercise, onBack }) {
  const [seconds, setSeconds] = useState(INITIAL_TIME);
  const [running, setRunning] = useState(false);
  const [snack, setSnack] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setSnack('Подход завершён!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  const start = () => { if (seconds > 0) setRunning(true); };
  const pause = () => { setRunning(false); clearInterval(intervalRef.current); };
  const reset = () => { setRunning(false); clearInterval(intervalRef.current); setSeconds(INITIAL_TIME); };

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={onBack}><ArrowBackIcon /></IconButton>
        <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>Таймер</Typography>
      </Box>

      <Typography fontSize={64} mb={1}>{exercise.emoji}</Typography>
      <Typography variant="h4" fontWeight="bold" mb={1}>{exercise.name}</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        {exercise.sets} подходов × {exercise.reps} повт.
      </Typography>

      <Typography variant="h1" fontWeight="bold" sx={{ fontFamily: 'monospace', mb: 4 }}>
        {mins}:{secs}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {!running ? (
          <Button variant="contained" size="large" startIcon={<PlayArrowIcon />}
            onClick={start} disabled={seconds === 0} sx={{ px: 4 }}>
            Старт
          </Button>
        ) : (
          <Button variant="outlined" size="large" startIcon={<PauseIcon />}
            onClick={pause} sx={{ px: 4 }}>
            Пауза
          </Button>
        )}
        <Button variant="outlined" size="large" startIcon={<ReplayIcon />}
          onClick={reset} sx={{ px: 4 }}>
          Сброс
        </Button>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSnack('')}>{snack}</Alert>
      </Snackbar>
    </Box>
  );
}
