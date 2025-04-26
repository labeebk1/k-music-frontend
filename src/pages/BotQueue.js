import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Grid, Typography, Button, Box, CardMedia } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

function BotQueue({ loggedInUser, backendURL }) {
  const [queue, setQueue] = useState([]);
  const navigate = useNavigate();

  // Fetch the bot's queue on mount and set up polling
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await axios.get(backendURL + '/queue'); // Adjust the endpoint URL if necessary
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
    if (!loggedInUser) {
      toast.error('You must be logged in to play a song.');
      navigate('/');
      return;
    }
    try {
      await axios.post(backendURL + '/remove_from_queue', { position }); // Adjust the endpoint and payload
      setQueue(queue.filter((_, index) => index !== position));
      toast.success('Song removed from queue');
    } catch (error) {
      toast.error('Failed to remove song');
    }
  };

  const nowPlaying = queue.length > 0 ? queue[0] : null;
  const upcomingQueue = queue.length > 1 ? queue.slice(1) : [];

  return (
    <Container maxWidth="md" sx={{ paddingTop: '10px' }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Queue
      </Typography>

      {/* Now Playing Section */}
      {nowPlaying ? (
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" sx={{ marginBottom: 2, color: '#ff5722' }}>
            Now Playing
          </Typography>
          <Card sx={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: '#f5f5f5' }}>
            {/* Icon */}
            <CardMedia
              component="img"
              image="https://t3.ftcdn.net/jpg/04/54/66/12/360_F_454661277_NtQYM8oJq2wOzY1X9Y81FlFa06DVipVD.jpg"
              alt="Music Icon"
              sx={{ width: 60, height: 60, marginRight: 2 }}
            />
            {/* Song Details */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                <a
                  href={nowPlaying.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {nowPlaying.song}
                </a>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Requested by: {nowPlaying.user}
              </Typography>
            </Box>
          </Card>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ marginBottom: 4 }}>
          No song is currently playing.
        </Typography>
      )}

      {/* Upcoming Section */}
      <Typography variant="h5" sx={{ marginBottom: 2, color: '#2196f3' }}>``
        Upcoming
      </Typography>
      {upcomingQueue.length > 0 ? (
        <Grid container spacing={3}>
          {upcomingQueue.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: '#e1f5fe' }}>
                {/* Icon */}
                <CardMedia
                  component="img"
                  image="https://t3.ftcdn.net/jpg/04/54/66/12/360_F_454661277_NtQYM8oJq2wOzY1X9Y81FlFa06DVipVD.jpg"
                  alt="Music Icon"
                  sx={{ width: 50, height: 50, marginRight: 2 }}
                />
                {/* Song Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {`${index + 2}. ${item.song}`}
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
                  onClick={() => handleRemove(index + 1)}
                >
                  Remove
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">No upcoming songs in the queue.</Typography>
      )}
    </Container>
  );
}

export default BotQueue;
