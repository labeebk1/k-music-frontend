import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container } from '@mui/material';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // POST request to authenticate user
    try {
      await axios.post('/api/login', { name: username });
      navigate('/search');  // Redirect after successful login
    } catch (error) {
      alert('Failed to login');
    }
  };

  return (
    <Container>
      <h2>Login</h2>
      <TextField 
        label="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        fullWidth 
      />
      <Button onClick={handleLogin} variant="contained" color="primary">
        Login
      </Button>
    </Container>
  );
}

export default Login;