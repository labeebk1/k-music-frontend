import React, { useContext } from 'react';
import { Button, TextField, Container, Grid, Card, CardContent, Typography, CardMedia, Box } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchContext } from '../components/SearchContext'; // Import the context

const API_KEY = 'AIzaSyDSIUDdWQf0yQx24vAi-V2D9HZk_3V5vFY';

function SearchPage() {
  const { searchTerm, setSearchTerm, results, setResults } = useContext(SearchContext); // Use shared state

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: API_KEY,
          q: searchTerm,
          part: 'snippet',
          type: 'video',
          maxResults: 10,
        },
      });

      const videoIds = response.data.items.map(item => item.id.videoId).join(',');

      const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          key: API_KEY,
          id: videoIds,
          part: 'contentDetails,snippet',
        },
      });

      const videos = videoDetailsResponse.data.items.map(item => {
        const duration = item.contentDetails.duration;
        const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
        const minutes = match[1] || '0';
        const seconds = match[2] || '00';

        return {
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          description: item.snippet.description,
          duration: `${minutes}:${seconds.padStart(2, '0')}`,
          url: `https://www.youtube.com/watch?v=${item.id}`,
        };
      });

      setResults(videos);
    } catch (error) {
      toast.error('Failed to fetch YouTube videos');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container>
      <h2>Search YouTube</h2>
      <Box display="flex" alignItems="center" gap={2}>
        <TextField 
          label="Search YouTube" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          onKeyPress={handleKeyPress} 
          fullWidth 
        />
        <Button onClick={handleSearch} variant="contained" color="primary">
          Search
        </Button>
      </Box>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {results.map((video) => (
          <Grid item xs={12} key={video.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      <CardMedia
                        component="img"
                        image={video.thumbnail}
                        alt={video.title}
                        style={{ borderRadius: '5px', cursor: 'pointer' }}
                      />
                    </a>
                  </Grid>
                  <Grid item xs={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" gutterBottom>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                        >
                          {video.title}
                        </a>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {video.duration}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {video.description.length > 50
                        ? `${video.description.substring(0, 50)}...`
                        : video.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" style={{ marginTop: '10px' }}>
                      <Button size="small" variant="contained" color="primary">
                        Play Now
                      </Button>
                      <Button size="small" variant="outlined">
                        Add to Queue
                      </Button>
                      <Button size="small" variant="outlined">
                        Add to Playlist
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ToastContainer />
    </Container>
  );
}

export default SearchPage;
