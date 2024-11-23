import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BotControlBar() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleReplay = () => {
    axios.post('/api/bot/replay')
      .then(() => toast.success('Replaying the current song'))
      .catch(() => toast.error('Failed to replay'));
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      axios.post('/api/bot/pause')
        .then(() => {
          setIsPlaying(false);
          toast.info('Paused the song');
        })
        .catch(() => toast.error('Failed to pause'));
    } else {
      axios.post('/api/bot/play')
        .then(() => {
          setIsPlaying(true);
          toast.success('Playing the song');
        })
        .catch(() => toast.error('Failed to play'));
    }
  };

  const handleNext = () => {
    axios.post('/api/bot/next')
      .then(() => toast.success('Skipped to the next song'))
      .catch(() => toast.error('Failed to skip'));
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#607d8b', // Dark grey background
        color: 'white', // Text color
      }}
      elevation={3}
    >
      <BottomNavigation sx={{ backgroundColor: '#607d8b' }}> {/* Ensuring inner navigation matches the theme */}
        <BottomNavigationAction
          label="Replay"
          icon={<ReplayIcon />}
          onClick={handleReplay}
          sx={{
            color: 'white', // Icon and label color
          }}
        />
        <BottomNavigationAction
          label={isPlaying ? 'Pause' : 'Play'}
          icon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={handlePlayPause}
          sx={{
            color: 'white', // Icon and label color
          }}
        />
        <BottomNavigationAction
          label="Next"
          icon={<SkipNextIcon />}
          onClick={handleNext}
          sx={{
            color: 'white', // Icon and label color
          }}
        />
      </BottomNavigation>

      {/* Toast container to display toasts */}
      <ToastContainer />
    </Paper>
  );
}

export default BotControlBar;
