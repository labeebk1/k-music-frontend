import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container } from '@mui/material';
import axios from 'axios';

function Login({ setLoggedInUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // POST request to log in or create a new user
      const response = await axios.post('http://127.0.0.1:8000/login', { name: username, password });
      setLoggedInUser(response.data.user); // Save the user in the app state
      console.log(response.data.user);
      navigate('/search'); // Redirect to the search page
    } catch (error) {
      alert('Failed to login. Please try again.');
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
      <TextField 
        label="Password" 
        type="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        fullWidth 
        style={{ marginTop: '10px' }}
      />
      <Button 
        onClick={handleLogin} 
        variant="contained" 
        color="primary" 
        style={{ marginTop: '20px' }}
      >
        Login
      </Button>
    </Container>
  );
}

export default Login;
