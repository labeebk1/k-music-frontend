import React, { createContext, useState } from 'react';

// Create the context
export const SearchContext = createContext();

// Provider component
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};