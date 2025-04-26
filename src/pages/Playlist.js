import React, { useState, useEffect } from 'react';
import { Container, Card, Typography, Button, CardMedia, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Playlist({ loggedInUser, backendURL }) {
  const [playlist, setPlaylist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      toast.error('You must be logged in to view your playlist.');
      navigate('/');
      return;
    }

    // Fetch the user's playlist
    const fetchPlaylist = async () => {
      try {
        const response = await axios.post(backendURL + '/show_playlist', {
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
      await axios.post(backendURL + '/remove_from_playlist', {
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
      await axios.post(backendURL + '/add_to_queue', {
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
      {playlist.length > 0 ? (
        playlist.map((song, index) => (
          <Card
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              marginBottom: '8px',
              boxShadow: 1,
            }}
          >
            {/* Icon */}
            <CardMedia
              component="img"
              src="https://t3.ftcdn.net/jpg/04/54/66/12/360_F_454661277_NtQYM8oJq2wOzY1X9Y81FlFa06DVipVD.jpg"
              alt="Music Icon"
              sx={{
                width: '50px',
                height: '50px',
                borderRadius: '5px',
                marginRight: '16px',
              }}
            />

            {/* Song Details */}
            <Box flex={1}>
              <Typography
                variant="body1"
                noWrap
                component="a"
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                {song.title}
              </Typography>
            </Box>

            {/* Buttons */}
            <Box display="flex" gap={1}>
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
          </Card>
        ))
      ) : (
        <Typography variant="body1">Your playlist is empty.</Typography>
      )}
    </Container>
  );
}

export default Playlist;
