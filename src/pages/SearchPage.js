import React, { useContext } from 'react';
import { Button, TextField, Container, Grid, Card, CardContent, Typography, CardMedia, Box } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchContext } from '../components/SearchContext';

const API_KEY = 'AIzaSyDSIUDdWQf0yQx24vAi-V2D9HZk_3V5vFY';

function SearchPage() {
  const { searchTerm, setSearchTerm, results, setResults } = useContext(SearchContext);

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

      <Grid container spacing={3} style={{ marginTop: '5px' }}>
        {results.map((video) => (
          <Grid item xs={12} key={video.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  {/* Thumbnail on the left */}
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
                  {/* Details on the right */}
                  <Grid item xs={8} style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Title and Timer */}
                    <Box display="flex" alignItems="center" style={{ marginBottom: '5px' }}>
                      <Typography variant="h6" style={{ flex: 1, margin: 0 }}>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                        >
                          {video.title}
                        </a>
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginLeft: '10px' }}>
                        {video.duration}
                      </Typography>
                    </Box>
                    {/* Description directly under the title */}
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '10px' }}>
                      {video.description.length > 200
                        ? `${video.description.substring(0, 200)}...`
                        : video.description}
                    </Typography>
                    {/* Buttons at the bottom */}
                    <Box display="flex" gap={2} style={{ marginTop: 'auto' }}>
                      <Button size="small" variant="contained" color="primary">
                        Play Now
                      </Button>
                      <Button size="small" variant="outlined" color="primary">
                        Add to Queue
                      </Button>
                      <Button size="small" variant="outlined" color="success">
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
