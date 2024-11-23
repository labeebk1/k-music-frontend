import React, { useState, useEffect } from 'react';
import { Container, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BotQueue() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Fetch the bot's current queue
    const fetchQueue = async () => {
      try {
        const response = await axios.get('/api/queue');
        setQueue(response.data.queue);
      } catch (error) {
        toast.error('Failed to fetch queue');
      }
    };

    fetchQueue();
  }, []);

  const handleRemove = (song) => {
    axios.post('/api/queue/remove', { song })
      .then(() => {
        setQueue(queue.filter(q => q !== song));
        toast.success('Song removed from queue');
      })
      .catch(() => toast.error('Failed to remove song'));
  };

  const handleSkipTo = (song) => {
    axios.post('/api/queue/skip', { song })
      .then(() => toast.success('Skipped to the song'))
      .catch(() => toast.error('Failed to skip to song'));
  };

  return (
    <Container>
      <h2>Queue</h2>
      <List>
        {queue.map((song, index) => (
          <ListItem key={index}>
            <ListItemText primary={song.title} />
            <Button onClick={() => handleSkipTo(song)}>Skip to</Button>
            <Button onClick={() => handleRemove(song)}>Remove</Button>
          </ListItem>
        ))}
      </List>

      {/* Toast container to display toasts */}
      <ToastContainer />
    </Container>
  );
}

export default BotQueue;
