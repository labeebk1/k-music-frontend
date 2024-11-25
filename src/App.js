import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Toolbar } from '@mui/material';
import { SearchProvider } from './components/SearchContext';
import SearchPage from './pages/SearchPage';
import BotQueue from './pages/BotQueue';
import Playlist from './pages/Playlist';
import Login from './pages/Login';
import ImportPlaylist from './pages/ImportPlaylist';
import BotControlBar from './components/BotControlBar';
import { PlayerProvider } from './components/PlayerContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [loggedInUser, setLoggedInUser] = useState(null); // State for the logged-in user

  const backendURL = 'http://34.130.40.68:8000'; // 34.130.40.68 127.0.0.1

  return (
    <PlayerProvider>
    <SearchProvider>
    <Router>
      <AppBar position="static">
        <Tabs
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ backgroundColor: '#01579b' }}
        >
          <Tab
            label="Search"
            component={Link}
            to="/search"
            sx={{ color: 'white' }}  // Makes the text white
          />
          <Tab
            label="Queue"
            component={Link}
            to="/queue"
            sx={{ color: 'white' }}  // Makes the text white
          />
          <Tab
            label="Playlist"
            component={Link}
            to="/playlist"
            sx={{ color: 'white' }}  // Makes the text white
          />
          <Tab
            label="Import Playlist"
            component={Link}
            to="/import"
            sx={{ color: 'white' }}  // Makes the text white
          />
        </Tabs>
      </AppBar>

      <Routes>
        <Route path="/" element={<Login setLoggedInUser={setLoggedInUser} backendURL={backendURL}/>} />
        <Route path="/search" element={<SearchPage loggedInUser={loggedInUser}  backendURL={backendURL} />} />
        <Route path="/queue" element={<BotQueue loggedInUser={loggedInUser}  backendURL={backendURL} />} />
        <Route path="/playlist" element={<Playlist loggedInUser={loggedInUser}  backendURL={backendURL} />} />
        <Route path="/import" element={<ImportPlaylist loggedInUser={loggedInUser}  backendURL={backendURL} />} />
      </Routes>
      
      <Toolbar />
      <BotControlBar backendURL={backendURL} loggedInUser={loggedInUser} />
    </Router>
    <ToastContainer />
    </SearchProvider>
    </PlayerProvider>
  );
}

export default App;
