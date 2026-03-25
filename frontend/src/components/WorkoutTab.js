import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Switch, LinearProgress, Fab,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  ListItemText, ListItemIcon, IconButton, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TimerIcon from '@mui/icons-material/Timer';
import TimerScreen from './TimerScreen';

export default function WorkoutTab({ exercises, onRefresh, api }) {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(null);
  const [timerExercise, setTimerExercise] = useState(null);
  const [name, setName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [snack, setSnack] = useState('');

  const doneCount = exercises.filter(e => e.is_done).length;
  const progress = exercises.length > 0 ? doneCount / exercises.length : 0;

  const toggleExercise = async (id) => {
    await fetch(`${api}/exercises/${id}/toggle`, { method: 'PATCH' });
    onRefresh();
  };

  const addExercise = async () => {
    if (!name.trim()) return;
    await fetch(`${api}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), emoji: '⭐', sets: parseInt(sets) || 3, reps: parseInt(reps) || 10, calories: 30 }),
    });
    setName(''); setSets('3'); setReps('10');
    setAddOpen(false);
    onRefresh();
  };

  const deleteExercise = async (id) => {
    await fetch(`${api}/exercises/${id}`, { method: 'DELETE' });
    setDeleteOpen(null);
    setSnack('Упражнение удалено');
    onRefresh();
  };

  if (timerExercise) {
    return <TimerScreen exercise={timerExercise} onBack={() => setTimerExercise(null)} />;
  }

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {/* Header stats */}
      <Box sx={{ p: 2.5, bgcolor: 'primary.light', color: 'white', opacity: 0.9 }}>
        <Typography variant="h6" fontWeight="bold" align="center">
          Сегодня: {doneCount} из {exercises.length}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <LinearProgress variant="determinate" value={progress * 100}
            sx={{ height: 12, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 2 } }} />
        </Box>
      </Box>

      {/* Exercise list */}
      <Box sx={{ p: 1.5, pb: 10 }}>
        {exercises.map((ex) => (
          <Card key={ex.id} sx={{
            mb: 1, bgcolor: ex.is_done ? 'rgba(0,150,136,0.08)' : 'white',
            cursor: 'pointer', '&:hover': { boxShadow: 3 }
          }}
            onClick={() => setTimerExercise(ex)}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Typography fontSize={32}>{ex.emoji}</Typography>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontWeight="bold"
                    sx={{ textDecoration: ex.is_done ? 'line-through' : 'none', color: ex.is_done ? 'text.secondary' : 'text.primary' }}>
                    {ex.name}
                  </Typography>
                }
                secondary={`${ex.sets} подходов × ${ex.reps} повт. | ${ex.calories} ккал`}
              />
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); setTimerExercise(ex); }}
                sx={{ mr: 0.5 }}>
                <TimerIcon fontSize="small" />
              </IconButton>
              <Switch checked={ex.is_done}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleExercise(ex.id)} color="primary" />
              <IconButton size="small" color="error"
                onClick={(e) => { e.stopPropagation(); setDeleteOpen(ex); }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* FAB */}
      <Fab color="primary" sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setAddOpen(true)}>
        <AddIcon />
      </Fab>

      {/* Add dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Новое упражнение</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Название" placeholder="Например: Подтягивания"
            value={name} onChange={e => setName(e.target.value)} sx={{ mt: 1, mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Подходы" type="number" value={sets}
              onChange={e => setSets(e.target.value)} fullWidth />
            <TextField label="Повторения" type="number" value={reps}
              onChange={e => setReps(e.target.value)} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={addExercise}>Добавить</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteOpen} onClose={() => setDeleteOpen(null)}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>
          <Typography>Удалить упражнение «{deleteOpen?.name}»?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(null)}>Отмена</Button>
          <Button variant="contained" color="error" onClick={() => deleteExercise(deleteOpen.id)}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')}>
        <Alert severity="success" onClose={() => setSnack('')}>{snack}</Alert>
      </Snackbar>
    </Box>
  );
}
