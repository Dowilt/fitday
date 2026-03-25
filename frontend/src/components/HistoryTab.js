import React from 'react';
import {
  Box, Typography, Card, CardContent, Button, Snackbar, Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

export default function HistoryTab({ history, exercises, onRefresh, api }) {
  const [snack, setSnack] = React.useState('');

  const doneCount = exercises.filter(e => e.is_done).length;

  const finishDay = async () => {
    if (doneCount === 0) {
      setSnack('Сначала выполните хотя бы одно упражнение!');
      return;
    }
    await fetch(`${api}/history/finish`, { method: 'POST' });
    setSnack('День сохранён в историю!');
    onRefresh();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>История тренировок</Typography>

      <Button variant="contained" startIcon={<SaveIcon />} onClick={finishDay}
        fullWidth sx={{ mb: 3, py: 1.5 }}>
        Завершить день
      </Button>

      {history.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic" align="center" mt={4}>
          История пуста. Завершите тренировку, чтобы сохранить результат.
        </Typography>
      ) : (
        history.map((h) => (
          <Card key={h.id} sx={{ mb: 1.5 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">📅 {h.date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                <Typography color="text.secondary">
                  🎯 {h.exercises_count} упражнений
                </Typography>
                <Typography color="text.secondary">
                  🔥 {h.total_calories} ккал
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')}>
        <Alert severity="info" onClose={() => setSnack('')}>{snack}</Alert>
      </Snackbar>
    </Box>
  );
}
