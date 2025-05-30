import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReplayIcon from '@mui/icons-material/Replay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { usePlayer } from '../components/PlayerContext'; // Import the PlayerContext

function BotControlBar({ loggedInUser, backendURL }) {
  const { isPlaying, setIsPlaying } = usePlayer();
  const [currentSong, setCurrentSong] = useState(''); // State for the "Now Playing" song
  const [dj, setDj] = useState(''); // State for the DJ
  const navigate = useNavigate();

  // Poll the backend every 2 seconds to fetch the current song and DJ
  useEffect(() => {
    const fetchCurrentSong = async () => {
      try {
        const response = await axios.get(backendURL + '/current_song'); // Backend endpoint for the current song
        setCurrentSong(response.data.title); // Assuming the response contains a "title" field
        setDj(response.data.user); // Assuming the response contains a "user" field
      } catch (error) {
        console.error('Failed to fetch the current song', error);
        setCurrentSong('');
        setDj('');
      }
    };

    const interval = setInterval(fetchCurrentSong, 2000); // Poll every 2 seconds
    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  const handleReplay = () => {
    if (!loggedInUser) {
      toast.error('You must be logged in to play a song.');
      navigate('/');
      return;
    }
    axios.get(backendURL + '/replay')
      .then(() => toast.success('Replaying the current song')).then(() => {
        setIsPlaying(true);
      })
      .catch(() => toast.error('Failed to replay'));
  };

  const handlePlayPause = () => {
    if (!loggedInUser) {
      toast.error('You must be logged in to play a song.');
      navigate('/');
      return;
    }
    if (isPlaying) {
      axios.get(backendURL + '/pause')
        .then(() => {
          setIsPlaying(false);
          toast.info('Paused the song');
        })
        .catch(() => toast.error('Failed to pause'));
    } else {
      axios.get(backendURL + '/resume')
        .then(() => {
          setIsPlaying(true);
          toast.success('Resumed the song');
        })
        .catch(() => toast.error('Failed to play'));
    }
  };

  const handleNext = () => {
    if (!loggedInUser) {
      toast.error('You must be logged in to play a song.');
      navigate('/');
      return;
    }
    axios.get(backendURL + '/skip')
      .then(() => toast.success('Skipped to the next song')).then(() => {
        setIsPlaying(true);
      })
      .catch(() => toast.error('Failed to skip'));
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#607d8b', color: 'white' }} elevation={3}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 16px' 
        }}
      >
        {/* Now Playing Section */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'hidden', 
            whiteSpace: 'nowrap', 
            textOverflow: 'ellipsis', 
            maxWidth: '100%' 
          }}
        >
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'white', 
            }}
          >
            {currentSong ? `Now Playing: ${currentSong}` : 'No song playing'}
          </Typography>
        </Box>

        {/* Bottom Navigation Buttons */}
        <BottomNavigation
          sx={{ 
            backgroundColor: '#607d8b', 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center' 
          }}
        >
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

        {/* DJ Section */}
        <Box 
          sx={{ 
            flex: 1, 
            textAlign: 'right', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}
        >
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'white' 
            }}
          >
            {dj ? `DJ: ${dj}` : ''}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default BotControlBar;
