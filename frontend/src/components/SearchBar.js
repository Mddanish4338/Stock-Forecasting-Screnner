import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaPlusCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SearchBar = ({ onAdd, darkMode }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    axios.get(`http://localhost:5000/api/search?query=${query}`)
      .then(response => setResults(response.data))
      .catch(error => console.error("Search Error:", error));
  };

  const handleAdd = async (stock) => {
    try {
      await axios.post('http://localhost:5000/api/predict', { symbol: stock.symbol });
      onAdd && onAdd(stock);
    } catch (error) {
      console.error("Prediction Error:", error);
    }
  };

  const containerStyle = {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '1rem',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    flexGrow: 1,
    padding: '0.7rem 1rem',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1rem',
    outline: 'none',
    background: darkMode ? '#2a2a3b' : '#ffffff',
    color: darkMode ? '#f4f4f4' : '#1e1e2f',
    boxShadow: darkMode
      ? '0 0 10px rgba(255,255,255,0.05)'
      : '0 0 10px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    background: '#007bff',
    color: '#ffffff',
    border: 'none',
    padding: '0.7rem 1.2rem',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    transition: 'transform 0.2s ease'
  };

  const listItemStyle = {
    marginBottom: '1rem',
    borderRadius: '12px',
    padding: '1rem',
    background: darkMode ? '#1f1f2e' : '#f4f4f4',
    color: darkMode ? '#ffffff' : '#1e1e2f',
    boxShadow: darkMode
      ? '0 0 12px rgba(255,255,255,0.03)'
      : '0 0 12px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}
      >
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="🔎 Search Stock (e.g., AAPL)"
          style={inputStyle}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSearch}
          style={buttonStyle}
        >
          <FaSearch /> Search
        </motion.button>
      </motion.div>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ listStyle: 'none', padding: 0 }}
      >
        {results.map(stock => (
          <motion.li
            key={stock.symbol}
            style={listItemStyle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{stock.name} ({stock.symbol})</strong>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAdd(stock)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#28a745',
                  cursor: 'pointer',
                  fontSize: '1.4rem'
                }}
              >
                <FaPlusCircle />
              </motion.button>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default SearchBar;
