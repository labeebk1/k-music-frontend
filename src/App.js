import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Toolbar } from '@mui/material';
import { SearchProvider } from './components/SearchContext';
import SearchPage from './pages/SearchPage';
import BotQueue from './pages/BotQueue';
import Playlist from './pages/Playlist';
import Login from './pages/Login';
import BotControlBar from './components/BotControlBar';

function App() {
  return (
    <SearchProvider>
    <Router>
      <AppBar position="static">
        <Tabs
          textColor="inherit"
          indicatorColor="secondary"
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
        </Tabs>
      </AppBar>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/queue" element={<BotQueue />} />
        <Route path="/playlist" element={<Playlist />} />
      </Routes>

      <Toolbar />
      <BotControlBar />
    </Router>
    </SearchProvider>
  );
}

export default App;
