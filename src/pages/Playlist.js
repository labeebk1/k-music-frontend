import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, CardMedia, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Playlist({ loggedInUser }) {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    if (!loggedInUser) {
      toast.error('You must be logged in to view your playlist.');
      return;
    }

    // Fetch the user's playlist
    const fetchPlaylist = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/show_playlist', {
          name: loggedInUser,
        });
        setPlaylist(response.data.playlist);
      } catch (error) {
        toast.error('Failed to fetch playlist');
      }
    };

    fetchPlaylist();
  }, [loggedInUser]);

  const handleRemove = async (song) => {
    try {
      await axios.post('http://127.0.0.1:8000/remove_from_playlist', {
        title: song.title,
        url: song.url,
        user_name: loggedInUser,
      });
      setPlaylist(playlist.filter((p) => p.url !== song.url));
      toast.success('Song removed from playlist');
    } catch (error) {
      toast.error('Failed to remove song');
    }
  };

  const handleAddToQueue = async (song) => {
    try {
      await axios.post('http://127.0.0.1:8000/add_to_queue', {
        title: song.title,
        url: song.url,
        user_name: loggedInUser,
      });
      toast.success('Song added to queue');
    } catch (error) {
      toast.error('Failed to add song to queue');
    }
  };

  return (
    <Container sx={{ paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Your Playlist
      </Typography>
      <Grid container spacing={3}>
        {playlist.length > 0 ? (
          playlist.map((song, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Thumbnail Icon */}
                    <Grid item xs={3}>
                      <CardMedia
                        component="img"
                        src="https://image.similarpng.com/very-thumbnail/2020/12/Popular-Music-icon-in-round-black-color-on-transparent-background-PNG.png"
                        alt="Music Icon"
                        sx={{ width: '100%', borderRadius: '5px' }}
                      />
                    </Grid>
                    {/* Song Details */}
                    <Grid item xs={9} style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" noWrap>
                        <a
                          href={song.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {song.title}
                        </a>
                      </Typography>
                      <Box display="flex" gap={2} marginTop="auto">
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddToQueue(song)}
                        >
                          Add to Queue
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemove(song)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">Your playlist is empty.</Typography>
        )}
      </Grid>
    </Container>
  );
}

export default Playlist;
