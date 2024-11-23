import React, { useState } from 'react';
import { Button, TextField, Container, Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Replace with your YouTube API key
const API_KEY = 'YOUR_YOUTUBE_API_KEY';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: "AIzaSyDSIUDdWQf0yQx24vAi-V2D9HZk_3V5vFY",
          q: searchTerm,
          part: 'snippet',
          type: 'video',
          maxResults: 10,
        },
      });

      const videos = response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        description: item.snippet.description,
      }));

      setResults(videos);
      toast.success('Search completed successfully');
    } catch (error) {
      toast.error('Failed to fetch YouTube videos');
    }
  };

  const handlePlayNow = (videoId) => {
    axios.post('/api/play', { videoId })
      .then(() => toast.success('Playing now!'))
      .catch(() => toast.error('Failed to play the video'));
  };

  const handleAddToQueue = (videoId) => {
    axios.post('/api/queue', { videoId })
      .then(() => toast.success('Added to queue!'))
      .catch(() => toast.error('Failed to add to queue'));
  };

  const handleAddToPlaylist = (videoId) => {
    axios.post('/api/playlist', { videoId })
      .then(() => toast.success('Added to playlist!'))
      .catch(() => toast.error('Failed to add to playlist'));
  };

  return (
    <Container>
      <h2>Search YouTube</h2>
      <TextField 
        label="Search YouTube" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        fullWidth 
      />
      <Button onClick={handleSearch} variant="contained" color="primary" style={{ marginTop: '10px' }}>
        Search
      </Button>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {results.map((video) => (
          <Grid item xs={12} sm={6} md={6} key={video.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {video.title}
                </Typography>
                <CardMedia
                  component="img"
                  height="140"
                  image={video.thumbnail}
                  alt={video.title}
                />
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                  {video.description}
                </Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <Button size="small" variant="contained" color="primary" onClick={() => handlePlayNow(video.id)}>
                    Play Now
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => handleAddToQueue(video.id)}>
                    Add to Queue
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => handleAddToPlaylist(video.id)}>
                    Add to Playlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Toast container to display toasts */}
      <ToastContainer />
    </Container>
  );
}

export default SearchPage;
