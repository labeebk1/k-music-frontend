import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { usePlayer } from '../components/PlayerContext'; // Import the PlayerContext

function BotControlBar() {
  const { isPlaying, setIsPlaying } = usePlayer();

  const handleReplay = () => {
    axios.get('http://127.0.0.1:8000/replay')
      .then(() => toast.success('Replaying the current song'))
      .catch(() => toast.error('Failed to replay'));
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      axios.get('http://127.0.0.1:8000/pause')
        .then(() => {
          setIsPlaying(false);
          toast.info('Paused the song');
        })
        .catch(() => toast.error('Failed to pause'));
    } else {
      axios.get('http://127.0.0.1:8000/resume')
        .then(() => {
          setIsPlaying(true);
          toast.success('Resumed the song');
        })
        .catch(() => toast.error('Failed to play'));
    }
  };

  const handleNext = () => {
    axios.post('http://127.0.0.1:8000/skip')
      .then(() => toast.success('Skipped to the next song'))
      .catch(() => toast.error('Failed to skip'));
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#607d8b', color: 'white' }} elevation={3}>
      <BottomNavigation sx={{ backgroundColor: '#607d8b' }}>
        <BottomNavigationAction
          label="Replay"
          icon={<ReplayIcon />}
          onClick={handleReplay}
          sx={{ color: 'white' }}
        />
        <BottomNavigationAction
          label={isPlaying ? 'Pause' : 'Play'}
          icon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={handlePlayPause}
          sx={{ color: 'white' }}
        />
        <BottomNavigationAction
          label="Next"
          icon={<SkipNextIcon />}
          onClick={handleNext}
          sx={{ color: 'white' }}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default BotControlBar;
