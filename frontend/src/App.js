import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Portfolio from './components/Portfolio';
import IndexDetail from './pages/IndexDetails';
import StockDetail from './pages/StockDetail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark' : ''}`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/portfolio" element={<Portfolio darkMode={darkMode} />} />
            <Route path="/indices/:symbol" element={<IndexDetail darkMode={darkMode} />} />
            <Route path="/stock-detail" element={<StockDetail darkMode={darkMode} />} />
          </Routes>
        </main>

        <style jsx>{`
          .app-container {
            min-height: 100vh;
            transition: all 0.3s ease;
          }
          
          .main-content {
            padding-top: 80px;
            padding-bottom: 2rem;
            min-height: calc(100vh - 80px);
          }
          
          @media (max-width: 768px) {
            .main-content {
              padding-top: 70px;
            }
          }
        `}</style>

        <style jsx global>{`
          body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          
          .dark {
            background-color: #121212;
            color: #ffffff;
          }
          
          .dark .card {
            background-color: #1e1e2e;
            color: #ffffff;
          }
        `}</style>
        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
};

export default App;