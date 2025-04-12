import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function Home({ darkMode }) {
  const [indices, setIndices] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [indicesLoading, setIndicesLoading] = useState(true);
  const [stocksLoading, setStocksLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/indices')
      .then(res => setIndices(res.data))
      .catch(err => console.error(err))
      .finally(() => setIndicesLoading(false));

    axios.get('http://localhost:5000/api/top-stocks')
      .then(res => {
        setTopGainers(res.data.gainers);
        setTopLosers(res.data.losers);
      })
      .catch(err => console.error(err))
      .finally(() => setStocksLoading(false));
  }, []);

  const handleCardClick = (stock) => {
    navigate('/stock-detail', {
      state: {
        stock: {
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          changePercent: stock.changePercent
        }
      }
    });
  };

  const SkeletonCard = () => (
    <div style={{
      background: darkMode ? '#2d3748' : '#e2e8f0',
      height: '150px',
      borderRadius: '1rem',
      animation: 'pulse 1.5s infinite ease-in-out',
      width: '100%'
    }} />
  );

  const styles = {
    container: {
      padding: '2rem',
      background: darkMode ? '#121212' : '#f7f9fb',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '100%',
      margin: '0 auto',
      paddingTop: '100px',
      color: darkMode ? '#ffffff' : '#1a365d',
      transition: 'all 0.3s ease'
    },
    heading: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: darkMode ? '#ffffff' : '#2a4365',
      textAlign: 'center'
    },
    subHeading: {
      fontSize: '2rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: darkMode ? '#bb86fc' : '#2c5282',
      textAlign: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
      width: '100%',
      padding: '0 2rem',
      boxSizing: 'border-box',
    },
    card: {
      background: darkMode ? '#1f1f2e' : '#ffffff',
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: darkMode ? '#ffffff' : '#1a365d'
    },
    cardPrice: {
      fontSize: '1.1rem',
      color: darkMode ? '#bbbbbb' : '#4a5568'
    },
    cardChangePositive: {
      fontSize: '1rem',
      color: '#2f855a',
      marginTop: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      fontWeight: '600'
    },
    cardChangeNegative: {
      fontSize: '1rem',
      color: '#e53e3e',
      marginTop: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      fontWeight: '600'
    },
    section: {
      marginTop: '2rem'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Indian Market Indices</h1>
      <div style={styles.grid}>
        {indicesLoading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : indices.map((index, i) => (
              <motion.div
                key={i}
                onClick={() => handleCardClick(index)}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={styles.card}
              >
                <h2 style={styles.cardTitle}>{index.name}</h2>
                <p style={styles.cardPrice}>Price: ₹{index.price}</p>
                <p style={index.changePercent >= 0 ? styles.cardChangePositive : styles.cardChangeNegative}>
                  {index.changePercent >= 0 ? (
                    <FaArrowUp style={{ marginRight: '0.3rem' }} />
                  ) : (
                    <FaArrowDown style={{ marginRight: '0.3rem' }} />
                  )}
                  {index.changePercent}%
                </p>
              </motion.div>
            ))}
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeading}>Top Gainers</h2>
        <div style={styles.grid}>
          {stocksLoading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : topGainers.map((stock, i) => (
                <motion.div
                  key={i}
                  style={styles.card}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCardClick(stock)}
                >
                  <h3 style={styles.cardTitle}>{stock.name}</h3>
                  <p style={styles.cardPrice}>{stock.symbol} - ₹{stock.price}</p>
                  <p style={styles.cardChangePositive}>
                    <FaArrowUp style={{ marginRight: '0.3rem' }} />
                    +{stock.changePercent}%
                  </p>
                </motion.div>
              ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeading}>Top Losers</h2>
        <div style={styles.grid}>
          {stocksLoading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : topLosers.map((stock, i) => (
                <motion.div
                  key={i}
                  style={styles.card}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCardClick(stock)}
                >
                  <h3 style={styles.cardTitle}>{stock.name}</h3>
                  <p style={styles.cardPrice}>{stock.symbol} - ₹{stock.price}</p>
                  <p style={styles.cardChangeNegative}>
                    <FaArrowDown style={{ marginRight: '0.3rem' }} />
                    {stock.changePercent}%
                  </p>
                </motion.div>
              ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}