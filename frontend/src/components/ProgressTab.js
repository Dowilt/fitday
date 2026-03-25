import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress } from '@mui/material';

function GoalCard({ emoji, title, current, goal, unit, color }) {
  const progress = goal > 0 ? Math.min(current / goal, 1.0) : 0;
  const percent = Math.round(progress * 100);

  return (
    <Card sx={{ mb: 1.5, overflow: 'hidden' }}>
      <Box sx={{
        background: `linear-gradient(135deg, ${color}25, ${color}0d)`,
        minHeight: 110,
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Typography fontSize={28} mr={1.2}>{emoji}</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>{title}</Typography>
            <Typography variant="h5" fontWeight="bold" color={color}>{percent}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress * 100}
            sx={{
              height: 10, borderRadius: 1, bgcolor: '#e0e0e0',
              '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 1 }
            }} />
          <Typography variant="body2" color="text.secondary" mt={0.8}>
            {current} / {goal} {unit}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

export default function ProgressTab({ exercises, calorieGoal }) {
  const doneCount = exercises.filter(e => e.is_done).length;
  const totalCalories = exercises.filter(e => e.is_done).reduce((sum, e) => sum + e.calories, 0);
  const totalMinutes = doneCount * 5;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Прогресс за сегодня</Typography>

      <GoalCard emoji="🎯" title="Упражнения" current={doneCount}
        goal={exercises.length} unit="шт." color="#009688" />
      <GoalCard emoji="🔥" title="Калории" current={totalCalories}
        goal={calorieGoal} unit="ккал" color="#ff9800" />
      <GoalCard emoji="⏱" title="Время" current={totalMinutes}
        goal={45} unit="мин" color="#2196f3" />

      <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>Выполнено:</Typography>
      {exercises.filter(e => e.is_done).map(e => (
        <Box key={e.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography fontSize={20} mr={1}>{e.emoji}</Typography>
          <Typography>{e.name} — {e.calories} ккал</Typography>
        </Box>
      ))}
      {doneCount === 0 && (
        <Typography color="text.secondary" fontStyle="italic" mt={1}>
          Пока ничего. Отметьте упражнения на вкладке «Тренировка»!
        </Typography>
      )}
    </Box>
  );
}
