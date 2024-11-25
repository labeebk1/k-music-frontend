import React, { useState, useEffect } from 'react';
import { Container, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Playlist() {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    // Fetch the user's playlist
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get('/api/playlist');
        setPlaylist(response.data.playlist);
      } catch (error) {
        toast.error('Failed to fetch playlist');
      }
    };

    fetchPlaylist();
  }, []);

  const handleRemove = (song) => {
    axios.post('/api/playlist/remove', { song })
      .then(() => {
        setPlaylist(playlist.filter(p => p !== song));
        toast.success('Song removed from playlist');
      })
      .catch(() => toast.error('Failed to remove song'));
  };

  const handleAddToQueue = (song) => {
    axios.post('/api/queue', { song })
      .then(() => toast.success('Song added to queue'))
      .catch(() => toast.error('Failed to add song to queue'));
  };

  return (
    <Container>
      <h2>Your Playlist</h2>
      <List>
        {playlist.map((song, index) => (
          <ListItem key={index}>
            <ListItemText primary={song.title} />
            <Button onClick={() => handleAddToQueue(song)}>Add to Queue</Button>
            <Button onClick={() => handleRemove(song)}>Remove</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Playlist;
