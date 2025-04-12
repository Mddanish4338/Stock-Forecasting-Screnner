import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaBars, FaTimes, FaHome, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <motion.nav
      className={`navbar ${darkMode ? 'dark' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 70 }}
    >
      <div className="container">
        <h1 className="logo">Stock Forecasting Screener</h1>

        <div className="desktop-links">
          <Link to="/" className="nav-link">
            <FaHome className="nav-icon" /> Home
          </Link>
          <Link to="/portfolio" className="nav-link">
            <FaChartLine className="nav-icon" /> Portfolio
          </Link>
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div className="mobile-controls">
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="menu-toggle">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.div
          className={`mobile-menu ${darkMode ? 'dark' : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>
            <FaHome className="nav-icon" /> Home
          </Link>
          <Link to="/portfolio" className="mobile-link" onClick={() => setMenuOpen(false)}>
            <FaChartLine className="nav-icon" /> Portfolio
          </Link>
        </motion.div>
      )}

      <style jsx>{`
        .navbar {
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          background: #ffffff;
          color: #1e1e2f;
          padding: 1rem 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .navbar.dark {
          background: #1f1f2e;
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .container {
          width: 90%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }
        
        .desktop-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: inherit;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .nav-link:hover {
          color: #007bff;
        }
        
        .nav-icon {
          font-size: 1rem;
        }
        
        .theme-toggle {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .theme-toggle:hover {
          opacity: 0.8;
        }
        
        .mobile-controls {
          display: none;
          align-items: center;
          gap: 1rem;
        }
        
        .menu-toggle {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .mobile-menu {
          position: fixed;
          top: 70px;
          left: 0;
          width: 100%;
          background: #ffffff;
          padding: 1rem 0;
          z-index: 999;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .mobile-menu.dark {
          background: #1f1f2e;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .mobile-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 2rem;
          text-decoration: none;
          color: inherit;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        
        .mobile-link:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .mobile-menu.dark .mobile-link:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        @media (max-width: 768px) {
          .desktop-links {
            display: none;
          }
          
          .mobile-controls {
            display: flex;
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;