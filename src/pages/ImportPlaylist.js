import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

function ImportPlaylist({ loggedInUser, backendURL }) {
  const [playlistURL, setPlaylistURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImportPlaylist = async () => {
    if (!loggedInUser) {
      toast.error("You must be logged in to import a playlist.");
      navigate('/');
      return;
    }

    if (!playlistURL.trim()) {
      toast.error("Please enter a valid playlist URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${backendURL}/import_playlist`, {
        user_name: loggedInUser,
        url: playlistURL,
      });

      toast.success(response.data.message);
      setPlaylistURL(""); // Reset the input
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to import playlist. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Import Playlist
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="YouTube Music Playlist URL"
          value={playlistURL}
          onChange={(e) => setPlaylistURL(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleImportPlaylist}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Importing..." : "Import Playlist"}
        </Button>
      </Box>
    </Container>
  );
}

export default ImportPlaylist;
