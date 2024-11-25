import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Grid, Typography, Button, Box, CardMedia } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

function BotQueue() {
  const [queue, setQueue] = useState([]);

  // Fetch the bot's queue on mount and set up polling
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/queue'); // Adjust the endpoint URL if necessary
        setQueue(response.data.queue);
      } catch (error) {
        toast.error('Failed to fetch queue');
      }
    };

    // Polling every 5 seconds to keep the queue updated
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleRemove = async (position) => {
    try {
      await axios.post('http://127.0.0.1:8000/remove_from_queue', { position }); // Adjust the endpoint and payload
      setQueue(queue.filter((_, index) => index !== position));
      toast.success('Song removed from queue');
    } catch (error) {
      toast.error('Failed to remove song');
    }
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: '10px' }}>
      <h2> </h2>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Queue
      </Typography>
      {queue.length === 0 ? (
        <Typography>No songs in the queue</Typography>
      ) : (
        <Grid container spacing={3}>
          {queue.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                {/* Icon on the left */}
                <CardMedia
                  component="img"
                  image="https://www.citypng.com/public/uploads/preview/hd-apple-itunes-music-app-logo-icon-png-701751694777115nww0wcplip.png"
                  alt="Music Icon"
                  sx={{ width: 50, height: 50, marginRight: 2 }}
                />
                {/* Song Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    <a
                      href={item.url} // Hyperlink the song title
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {`${index + 1}. ${item.song}`}
                    </a>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Requested by: {item.user}
                  </Typography>
                </Box>
                {/* Remove Button */}
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default BotQueue;
