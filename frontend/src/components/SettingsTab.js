import React, { useState } from 'react';
import {
  Box, Typography, Card, Switch, Slider, Divider,
  ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle,
  DialogContent, DialogActions, Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VibrationIcon from '@mui/icons-material/Vibration';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function SettingsTab({ settings, onRefresh, api }) {
  const [resetOpen, setResetOpen] = useState(false);

  const updateSetting = async (field, value) => {
    await fetch(`${api}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    onRefresh();
  };

  const resetWorkout = async () => {
    await fetch(`${api}/exercises/reset`, { method: 'POST' });
    setResetOpen(false);
    onRefresh();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Настройки</Typography>

      {/* Notifications section */}
      <Card sx={{ mb: 2.5 }}>
        <ListItem>
          <ListItemIcon><NotificationsIcon /></ListItemIcon>
          <ListItemText primary="Уведомления" secondary="Напоминания о тренировке" />
          <Switch checked={settings.notifications}
            onChange={(_, v) => updateSetting('notifications', v)} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon><VolumeUpIcon /></ListItemIcon>
          <ListItemText primary="Звук" secondary="Звуковые эффекты" />
          <Switch checked={settings.sound}
            onChange={(_, v) => updateSetting('sound', v)} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon><VibrationIcon /></ListItemIcon>
          <ListItemText primary="Вибрация" secondary="При выполнении упражнения" />
          <Switch checked={settings.vibration}
            onChange={(_, v) => updateSetting('vibration', v)} />
        </ListItem>
      </Card>

      {/* Calorie goal */}
      <Card sx={{ mb: 2.5, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <LocalFireDepartmentIcon sx={{ color: 'secondary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Цель по калориям
          </Typography>
          <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'rgba(255,152,0,0.15)', borderRadius: 5 }}>
            <Typography fontWeight="bold" color="secondary.main">
              {settings.calorie_goal} ккал
            </Typography>
          </Box>
        </Box>
        <Slider
          value={settings.calorie_goal} min={100} max={800} step={50}
          valueLabelDisplay="auto" valueLabelFormat={v => `${v} ккал`}
          onChange={(_, v) => updateSetting('calorie_goal', v)}
          color="secondary"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">100 ккал</Typography>
          <Typography variant="caption" color="text.secondary">800 ккал</Typography>
        </Box>
      </Card>

      {/* About */}
      <Card>
        <ListItem>
          <ListItemIcon><InfoOutlinedIcon /></ListItemIcon>
          <ListItemText primary="О приложении" secondary="FitDay v1.0 — Лабораторная работа №3" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => setResetOpen(true)} sx={{ cursor: 'pointer' }}>
          <ListItemIcon><DeleteOutlineIcon color="error" /></ListItemIcon>
          <ListItemText primary={<Typography color="error">Сбросить тренировку</Typography>} />
        </ListItem>
      </Card>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>
          <Typography>Сбросить все отметки выполнения?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={resetWorkout}>Сбросить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
