// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { 
//   FaChartLine, 
//   FaTimes, 
//   FaChevronDown, 
//   FaChevronUp,
//   FaDollarSign,
//   FaChartBar,
//   FaCalendarAlt,
//   FaInfoCircle,
//   FaArrowUp,
//   FaArrowDown,
//   FaPercentage
// } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend
// } from 'recharts';
// import styles from './StockDetail.module.css';

// export default function StockDetail({ darkMode }) {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [stock, setStock] = useState(state?.stock || {});
//   const [prediction, setPrediction] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [expanded, setExpanded] = useState(true);
//   const [error, setError] = useState(null);
//   const [indices, setIndices] = useState([]);
//   const [showAll, setShowAll] = useState(false);

//   // List of market holidays
//   const marketHolidays = [
//     '14-04-2025', // Ambedkar Jayanti
//     '15-08-2025', // Independence Day
//     '02-10-2025', // Gandhi Jayanti
//     '25-12-2025', // Christmas
//     '01-01-2025', // New Year's Day
//   ];

//   // Check if a date is a market day
//   const isMarketDay = (date) => {
//     const day = date.getDay();
//     const dateStr = date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     }).replace(/\//g, '-');

//     return day !== 0 && day !== 6 && !marketHolidays.includes(dateStr);
//   };

//   // Get next market day
//   const getNextMarketDay = (date) => {
//     let nextDay = new Date(date);
//     nextDay.setDate(nextDay.getDate() + 1);
    
//     while (!isMarketDay(nextDay)) {
//       nextDay.setDate(nextDay.getDate() + 1);
//     }
//     return nextDay;
//   };

//   // Generate date labels only for market days
//   const generateMarketDateLabels = (days) => {
//     const today = new Date();
//     const labels = [];
//     let currentDate = new Date(today);
//     let marketDaysCount = 0;

//     if (isMarketDay(currentDate)) {
//       labels.push({
//         day: 'Today',
//         date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//         fullDate: currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
//         isMarketDay: true,
//         timestamp: currentDate.getTime()
//       });
//     }

//     while (marketDaysCount < days) {
//       currentDate = getNextMarketDay(currentDate);
//       marketDaysCount++;
      
//       labels.push({
//         day: `Day ${marketDaysCount}`,
//         date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//         fullDate: currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
//         isMarketDay: true,
//         timestamp: currentDate.getTime()
//       });
//     }

//     return labels;
//   };

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/indices')
//       .then(res => {
//         setIndices(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Failed to fetch indices", err);
//         setLoading(false);
//       });
//   }, []);

//   const toggleShowAll = () => setShowAll(prev => !prev);
//   const displayedIndices = showAll ? indices : indices.slice(0, 4);

//   const renderLoadingCard = () => (
//     <div style={{
//       border: darkMode ? '1px solid #333' : '1px solid #eee',
//       padding: '12px',
//       borderRadius: '8px',
//       backgroundColor: darkMode ? '#2d3748' : '#f4f4f4',
//       width: '200px',
//       height: '100px',
//       animation: 'pulse 1.5s infinite ease-in-out'
//     }}>
//       <p style={{ 
//         backgroundColor: darkMode ? '#4a5568' : '#ccc', 
//         height: '1rem', 
//         marginBottom: '8px', 
//         width: '70%' 
//       }} />
//       <p style={{ 
//         backgroundColor: darkMode ? '#718096' : '#ddd', 
//         height: '0.8rem', 
//         width: '50%' 
//       }} />
//     </div>
//   );

//   useEffect(() => {
//     if (!state?.stock) {
//       navigate('/');
//     }
//   }, [state, navigate]);

//   useEffect(() => {
//     if (stock.symbol) {
//       fetchStockDetails();
//     }
//   }, [stock.symbol]);

//   const fetchStockDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`http://localhost:5000/api/stocks/${stock.symbol}`);
//       setStock(prev => ({ ...prev, ...response.data }));
      
//       try {
//         const predictionRes = await axios.get(`http://localhost:5000/api/stocks/${stock.symbol}/predict`);
//         setPrediction(predictionRes.data);
//       } catch (predictionError) {
//         console.log('Prediction not available yet');
//       }
//     } catch (error) {
//       console.error('Error fetching stock details:', error);
//       setError('Failed to load stock details');
//       setStock(prev => ({
//         ...prev,
//         moving_average: prev.price * 0.98,
//         rsi: 45,
//         today_low: prev.price * 0.97,
//         today_high: prev.price * 1.03,
//         open_price: prev.price * 0.99,
//         previous_close: prev.price * 1.01,
//         week52_low: prev.price * 0.85,
//         week52_high: prev.price * 1.15
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePredict = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`http://localhost:5000/api/stocks/${stock.symbol}/predict`);
//       setPrediction(response.data);
//     } catch (error) {
//       console.error('Prediction error:', error);
//       setError('Failed to generate prediction');
//       const mockPrediction = {
//         forecast: Array(7).fill(0).map((_, i) => 
//           stock.price * (1 + (Math.random() * 0.1 - 0.05))
//         ),
//         current_price: stock.price,
//         moving_average: stock.price * (1 + (Math.random() * 0.05 - 0.025)),
//         rsi: 30 + Math.random() * 40,
//         today_low: stock.price * 0.97,
//         today_high: stock.price * 1.03
//       };
//       setPrediction(mockPrediction);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getBuySellStrategy = () => {
//     if (!prediction || !prediction.forecast || prediction.forecast.length < 2) return null;
    
//     const dateLabels = generateMarketDateLabels(prediction.forecast.length);
//     const marketDayForecasts = prediction.forecast.filter(
//       (_, index) => index < dateLabels.length && dateLabels[index].isMarketDay
//     );

//     if (marketDayForecasts.length === 0) return null;

//     const min = Math.min(...marketDayForecasts);
//     const max = Math.max(...marketDayForecasts);

//     const buyDayIndex = prediction.forecast.indexOf(min);
//     const sellDayIndex = prediction.forecast.indexOf(max);

//     const buyDayLabel = dateLabels[buyDayIndex] || {};
//     const sellDayLabel = dateLabels[sellDayIndex] || {};

//     return {
//       buy: {
//         day: buyDayLabel.day || `Day ${buyDayIndex + 1}`,
//         date: buyDayLabel.fullDate || '',
//         price: min,
//         timestamp: buyDayLabel.timestamp || null
//       },
//       sell: {
//         day: sellDayLabel.day || `Day ${sellDayIndex + 1}`,
//         date: sellDayLabel.fullDate || '',
//         price: max,
//         timestamp: sellDayLabel.timestamp || null
//       },
//       profit: (max - min).toFixed(2),
//       isValid: buyDayIndex < sellDayIndex && buyDayLabel.timestamp < sellDayLabel.timestamp
//     };
//   };

//   const getPerformance = () => {
//     if (!prediction || !prediction.forecast || prediction.forecast.length === 0) return null;
    
//     const dateLabels = generateMarketDateLabels(prediction.forecast.length);
//     const lastMarketDayIndex = dateLabels.findIndex((label) => label.isMarketDay);
//     const lastForecast = prediction.forecast[lastMarketDayIndex];

//     if (typeof lastForecast === 'undefined') return null;

//     const change = ((lastForecast - stock.price) / stock.price) * 100;
//     return change.toFixed(2);
//   };

//   const chartData = prediction 
//     ? (() => {
//         const dateLabels = generateMarketDateLabels(prediction.forecast.length);
//         return [
//           ...(isMarketDay(new Date())
//             ? [
//                 {
//                   ...dateLabels[0],
//                   price: prediction.current_price
//                 }
//               ]
//             : []),
//           ...prediction.forecast.map((p, i) => ({
//             ...dateLabels[i],
//             price: p
//           }))
//         ].filter((item) => item.isMarketDay);
//       })()
//     : [];

//   const performance = getPerformance();
//   const strategy = getBuySellStrategy();

//   return (
//     <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
//       <div style={{ 
//         padding: '24px',
//         backgroundColor: darkMode ? '#1a202c' : '#f7fafc'
//       }}>
//         <h2 style={{ 
//           color: darkMode ? '#ffffff' : '#2d3748',
//           marginBottom: '16px'
//         }}>
//           Detailed Market Indices
//         </h2>
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//           gap: '16px'
//         }}>
//           {loading
//             ? Array(6).fill(0).map((_, i) => <React.Fragment key={i}>{renderLoadingCard()}</React.Fragment>)
//             : displayedIndices.map((index, i) => (
//               <div key={i} style={{
//                 border: darkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
//                 padding: '12px',
//                 borderRadius: '10px',
//                 backgroundColor: darkMode ? '#2d3748' : '#ffffff',
//                 boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
//                 color: darkMode ? '#ffffff' : '#2d3748'
//               }}>
//                 <h3 style={{ margin: '0 0 8px 0' }}>{index.name}</h3>
//                 <p style={{ margin: '4px 0' }}>Price: ₹{index.price}</p>
//                 {index.changePercent !== undefined && (
//                   <p style={{ 
//                     margin: '4px 0',
//                     color: index.changePercent >= 0 ? '#48bb78' : '#f56565'
//                   }}>
//                     {index.changePercent >= 0 ? '+' : ''}{index.changePercent}%
//                   </p>
//                 )}
//               </div>
//             ))
//           }

//           {!loading && (
//             <div 
//               onClick={toggleShowAll} 
//               style={{
//                 cursor: 'pointer',
//                 border: darkMode ? '2px dashed #718096' : '2px dashed #a0aec0',
//                 padding: '12px',
//                 borderRadius: '10px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontWeight: 'bold',
//                 fontSize: '1rem',
//                 backgroundColor: darkMode ? '#2d3748' : '#ffffff',
//                 color: darkMode ? '#ffffff' : '#4a5568'
//               }}
//             >
//               {showAll ? 'Collapse ▲' : 'View All ▼'}
//             </div>
//           )}
//         </div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.3 }}
//         className={`${styles.header} ${darkMode ? styles.darkHeader : ''}`}
//       >
//         <button 
//           onClick={() => navigate(-1)}
//           className={`${styles.backButton} ${darkMode ? styles.darkBackButton : ''}`}
//         >
//           &larr; Back
//         </button>
//         <h1 className={styles.title}>{stock.name} ({stock.symbol})</h1>
//         <div className={styles.priceContainer}>
//           <h2 className={styles.price}>₹{stock.price}</h2>
//           <p className={stock.changePercent >= 0 ? styles.changePositive : styles.changeNegative}>
//             {stock.changePercent >= 0 ? <FaArrowUp /> : <FaArrowDown />}
//             {Math.abs(stock.changePercent)}%
//           </p>
//         </div>
//       </motion.div>

//       {error && (
//         <div className={`${styles.error} ${darkMode ? styles.darkError : ''}`}>
//           {error} - Showing simulated data
//         </div>
//       )}

//       <div className={`${styles.card} ${darkMode ? styles.darkCard : ''}`}>
//         <div 
//           className={`${styles.summary} ${darkMode ? styles.darkSummary : ''}`}
//           onClick={() => setExpanded(!expanded)}
//         >
//           <div className={styles.summaryLeft}>
//             <div className={`${styles.symbolBox} ${darkMode ? styles.darkSymbolBox : ''}`}>
//               {stock.symbol.substring(0, 3)}
//             </div>
//             <div>
//               <h3 className={styles.stockName}>{stock.name}</h3>
//               <p className={styles.stockSymbol}>{stock.symbol}</p>
//             </div>
//           </div>
//           <div className={styles.summaryRight}>
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handlePredict();
//               }}
//               className={`${styles.predictButton} ${darkMode ? styles.darkPredictButton : ''}`}
//               disabled={loading}
//             >
//               <FaChartLine />
//               {loading ? 'Predicting...' : 'Predict'}
//             </button>
//             {expanded ? <FaChevronUp /> : <FaChevronDown />}
//           </div>
//         </div>

//         {expanded && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             transition={{ duration: 0.3 }}
//             style={{ overflow: 'hidden' }}
//           >
//             <div className={`${styles.details} ${darkMode ? styles.darkDetails : ''}`}>
//               {(prediction || stock) && (
//                 <>
//                   <div className={styles.statsGrid}>
//                     <div className={`${styles.statCard} ${darkMode ? styles.darkStatCard : ''}`}>
//                       <p className={styles.statLabel}>
//                         <FaChartLine className={styles.statIcon} />
//                         Moving Average (20)
//                       </p>
//                       <p className={styles.statValue}>
//                         ₹{(prediction?.moving_average || stock.moving_average)?.toFixed(2) || 'N/A'}
//                       </p>
//                     </div>

//                     <div className={`${styles.statCard} ${darkMode ? styles.darkStatCard : ''}`}>
//                       <p className={styles.statLabel}>
//                         <FaPercentage className={styles.statIcon} />
//                         RSI (14)
//                       </p>
//                       <p className={styles.statValue} style={{
//                         color: (prediction?.rsi || stock.rsi) > 70 ? '#f56565' : 
//                               (prediction?.rsi || stock.rsi) < 30 ? '#48bb78' : 
//                               darkMode ? '#ffffff' : '#2d3748'
//                       }}>
//                         {(prediction?.rsi || stock.rsi)?.toFixed(2) || 'N/A'}
//                       </p>
//                     </div>

//                     <div className={`${styles.statCard} ${darkMode ? styles.darkStatCard : ''}`}>
//                       <p className={styles.statLabel}>
//                         <FaDollarSign className={styles.statIcon} />
//                         Today's Range
//                       </p>
//                       <p className={styles.statValue}>
//                         ₹{(prediction?.today_low || stock.today_low)?.toFixed(2) || 'N/A'} - ₹
//                         {(prediction?.today_high || stock.today_high)?.toFixed(2) || 'N/A'}
//                       </p>
//                     </div>
//                   </div>

//                   {prediction?.forecast && (
//                     <div className={styles.chartContainer}>
//                       <ResponsiveContainer width="100%" height={300}>
//                         <LineChart data={chartData}>
//                           <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4a5568' : '#eee'} />
//                           <XAxis 
//                             dataKey="date" 
//                             tick={{ 
//                               fontSize: 12,
//                               fill: darkMode ? '#a0aec0' : '#718096'
//                             }}
//                           />
//                           <YAxis 
//                             tick={{ 
//                               fontSize: 12,
//                               fill: darkMode ? '#a0aec0' : '#718096'
//                             }} 
//                           />
//                           <Tooltip 
//                             contentStyle={{
//                               backgroundColor: darkMode ? '#2d3748' : '#ffffff',
//                               borderColor: darkMode ? '#4a5568' : '#ddd',
//                               color: darkMode ? '#ffffff' : '#2d3748'
//                             }}
//                           />
//                           <Legend />
//                           <Line 
//                             type="monotone" 
//                             dataKey="price" 
//                             stroke="#4299e1" 
//                             strokeWidth={2}
//                             activeDot={{ r: 6 }}
//                             name="Price (₹)"
//                           />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     </div>
//                   )}

//                   <div className={styles.strategyGrid}>
//                     <div className={`${styles.strategyCard} ${darkMode ? styles.darkStrategyCard : ''}`}>
//                       <h4 className={styles.strategyTitle}>
//                         <FaCalendarAlt className={styles.strategyIcon} />
//                         Suggested Trade Plan
//                       </h4>
//                       {strategy && strategy.isValid ? (
//                         <div className={styles.strategyContent}>
//                           <p style={{ color: darkMode ? '#e2e8f0' : '#4a5568' }}>
//                             <strong>Buy on {strategy.buy.date}</strong> ({strategy.buy.day}) @{' '}
//                             <strong>₹{strategy.buy.price.toFixed(2)}</strong>
//                           </p>
//                           <p style={{ color: darkMode ? '#e2e8f0' : '#4a5568' }}>
//                             <strong>Sell on {strategy.sell.date}</strong> ({strategy.sell.day}) @{' '}
//                             <strong>₹{strategy.sell.price.toFixed(2)}</strong>
//                           </p>
//                           <p className={styles.strategyProfit}>
//                             <strong>Expected Profit:</strong>{' '}
//                             <span style={{ color: '#48bb78', fontWeight: 'bold' }}>
//                               ₹{strategy.profit}
//                             </span>{' '}
//                             (
//                             {(
//                               ((strategy.sell.price - strategy.buy.price) /
//                               strategy.buy.price) *
//                               100
//                             ).toFixed(2)}
//                             %)
//                           </p>
//                         </div>
//                       ) : (
//                         <p className={styles.noStrategy}>
//                           {strategy ? 
//                             "No valid trade strategy could be determined (market closed on predicted days)" : 
//                             "No prediction data available"}
//                         </p>
//                       )}
//                     </div>

//                     <div className={`${styles.performanceCard} ${darkMode ? styles.darkPerformanceCard : ''}`}>
//                       <h4 className={styles.performanceTitle}>
//                         <FaInfoCircle className={styles.performanceIcon} />
//                         Performance Overview
//                       </h4>
//                       {performance ? (
//                         <div className={styles.performanceContent}>
//                           <p 
//                             className={styles.performanceText} 
//                             style={{
//                               color: parseFloat(performance) > 0 ? '#48bb78' : '#f56565'
//                             }}
//                           >
//                             {parseFloat(performance) > 0 ? (
//                               <FaArrowUp className={styles.performanceArrow} />
//                             ) : (
//                               <FaArrowDown className={styles.performanceArrow} />
//                             )}
//                             {Math.abs(parseFloat(performance))}%{' '}
//                             {parseFloat(performance) > 0 ? 'increase' : 'decrease'} from current price
//                           </p>

//                           <div className={styles.performanceStats}>
//                             <div className={styles.performanceStat}>
//                               <p className={styles.performanceStatLabel}>Open Price</p>
//                               <p className={styles.performanceStatValue}>
//                                 ₹{(prediction?.open_price || stock.open_price)?.toFixed(2) || 'N/A'}
//                               </p>
//                             </div>

//                             <div className={styles.performanceStat}>
//                               <p className={styles.performanceStatLabel}>Previous Close</p>
//                               <p className={styles.performanceStatValue}>
//                                 ₹{(prediction?.previous_close || stock.previous_close)?.toFixed(2) || 'N/A'}
//                               </p>
//                             </div>

//                             <div className={styles.performanceStat}>
//                               <p className={styles.performanceStatLabel}>52W Low</p>
//                               <p className={styles.performanceStatValue}>
//                                 ₹{(prediction?.week52_low || stock.week52_low)?.toFixed(2) || 'N/A'}
//                               </p>
//                             </div>

//                             <div className={styles.performanceStat}>
//                               <p className={styles.performanceStatLabel}>52W High</p>
//                               <p className={styles.performanceStatValue}>
//                                 ₹{(prediction?.week52_high || stock.week52_high)?.toFixed(2) || 'N/A'}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <p className={styles.noPerformance}>
//                           {prediction?.forecast ? 
//                             "Performance data not available (market closed)" : 
//                             "No prediction data available"}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaChartLine, 
  FaTimes, 
  FaChevronDown, 
  FaChevronUp,
  FaDollarSign,
  FaChartBar,
  FaCalendarAlt,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaPercentage
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import styles from './StockDetail.module.css';

export default function StockDetail({ darkMode }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [stock, setStock] = useState(state?.stock || {});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [error, setError] = useState(null);
  const [indices, setIndices] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // List of market holidays
  const marketHolidays = [
    '14-04-2025', // Ambedkar Jayanti
    '15-08-2025', // Independence Day
    '02-10-2025', // Gandhi Jayanti
    '25-12-2025', // Christmas
    '01-01-2025', // New Year's Day
  ];

  // Check if a date is a market day
  const isMarketDay = (date) => {
    const day = date.getDay();
    const dateStr = date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');

    return day !== 0 && day !== 6 && !marketHolidays.includes(dateStr);
  };

  // Get next market day
  const getNextMarketDay = (date) => {
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    while (!isMarketDay(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    return nextDay;
  };

  // Generate date labels only for market days
  const generateMarketDateLabels = (days) => {
    const today = new Date();
    const labels = [];
    let currentDate = new Date(today);
    let marketDaysCount = 0;

    if (isMarketDay(currentDate)) {
      labels.push({
        day: 'Today',
        date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        isMarketDay: true,
        timestamp: currentDate.getTime()
      });
    }

    while (marketDaysCount < days) {
      currentDate = getNextMarketDay(currentDate);
      marketDaysCount++;
      
      labels.push({
        day: `Day ${marketDaysCount}`,
        date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        isMarketDay: true,
        timestamp: currentDate.getTime()
      });
    }

    return labels;
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/indices')
      .then(res => {
        setIndices(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch indices", err);
        setLoading(false);
      });
  }, []);

  const toggleShowAll = () => setShowAll(prev => !prev);
  const displayedIndices = showAll ? indices : indices.slice(0, 4);

  const renderLoadingCard = () => (
    <div style={{
      border: darkMode ? '1px solid #333' : '1px solid #eee',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: darkMode ? '#2d3748' : '#f4f4f4',
      width: '200px',
      height: '100px',
      animation: 'pulse 1.5s infinite ease-in-out'
    }}>
      <p style={{ 
        backgroundColor: darkMode ? '#4a5568' : '#ccc', 
        height: '1rem', 
        marginBottom: '8px', 
        width: '70%' 
      }} />
      <p style={{ 
        backgroundColor: darkMode ? '#718096' : '#ddd', 
        height: '0.8rem', 
        width: '50%' 
      }} />
    </div>
  );

  useEffect(() => {
    if (!state?.stock) {
      navigate('/');
    }
  }, [state, navigate]);

  useEffect(() => {
    if (stock.symbol) {
      fetchStockDetails();
    }
  }, [stock.symbol]);

  const fetchStockDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/stocks/${stock.symbol}`);
      setStock(prev => ({ ...prev, ...response.data }));
      
      try {
        const predictionRes = await axios.get(`http://localhost:5000/api/stocks/${stock.symbol}/predict`);
        setPrediction(predictionRes.data);
      } catch (predictionError) {
        console.log('Prediction not available yet');
      }
    } catch (error) {
      console.error('Error fetching stock details:', error);
      setError('Failed to load stock details');
      setStock(prev => ({
        ...prev,
        moving_average: prev.price * 0.98,
        rsi: 45,
        today_low: prev.price * 0.97,
        today_high: prev.price * 1.03,
        open_price: prev.price * 0.99,
        previous_close: prev.price * 1.01,
        week52_low: prev.price * 0.85,
        week52_high: prev.price * 1.15
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:5000/api/stocks/${stock.symbol}/predict`);
      setPrediction(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      setError('Failed to generate prediction');
      const mockPrediction = {
        forecast: Array(7).fill(0).map((_, i) => 
          stock.price * (1 + (Math.random() * 0.1 - 0.05))
        ),
        current_price: stock.price,
        moving_average: stock.price * (1 + (Math.random() * 0.05 - 0.025)),
        rsi: 30 + Math.random() * 40,
        today_low: stock.price * 0.97,
        today_high: stock.price * 1.03
      };
      setPrediction(mockPrediction);
    } finally {
      setLoading(false);
    }
  };

  const getBuySellStrategy = () => {
    if (!prediction || !prediction.forecast || prediction.forecast.length < 2) return null;
    
    const dateLabels = generateMarketDateLabels(prediction.forecast.length);
    const marketDayForecasts = prediction.forecast.filter(
      (_, index) => index < dateLabels.length && dateLabels[index].isMarketDay
    );

    if (marketDayForecasts.length === 0) return null;

    const min = Math.min(...marketDayForecasts);
    const max = Math.max(...marketDayForecasts);

    const buyDayIndex = prediction.forecast.indexOf(min);
    const sellDayIndex = prediction.forecast.indexOf(max);

    const buyDayLabel = dateLabels[buyDayIndex] || {};
    const sellDayLabel = dateLabels[sellDayIndex] || {};

    return {
      buy: {
        day: buyDayLabel.day || `Day ${buyDayIndex + 1}`,
        date: buyDayLabel.fullDate || '',
        price: min,
        timestamp: buyDayLabel.timestamp || null
      },
      sell: {
        day: sellDayLabel.day || `Day ${sellDayIndex + 1}`,
        date: sellDayLabel.fullDate || '',
        price: max,
        timestamp: sellDayLabel.timestamp || null
      },
      profit: (max - min).toFixed(2),
      isValid: buyDayIndex < sellDayIndex && buyDayLabel.timestamp < sellDayLabel.timestamp
    };
  };

  const getPerformance = () => {
    if (!prediction || !prediction.forecast || prediction.forecast.length === 0) return null;
    
    const dateLabels = generateMarketDateLabels(prediction.forecast.length);
    const lastMarketDayIndex = dateLabels.findIndex((label) => label.isMarketDay);
    const lastForecast = prediction.forecast[lastMarketDayIndex];

    if (typeof lastForecast === 'undefined') return null;

    const change = ((lastForecast - stock.price) / stock.price) * 100;
    return change.toFixed(2);
  };

  const chartData = prediction 
    ? (() => {
        const dateLabels = generateMarketDateLabels(prediction.forecast.length);
        return [
          ...(isMarketDay(new Date())
            ? [
                {
                  ...dateLabels[0],
                  price: prediction.current_price
                }
              ]
            : []),
          ...prediction.forecast.map((p, i) => ({
            ...dateLabels[i],
            price: p
          }))
        ].filter((item) => item.isMarketDay);
      })()
    : [];

  const performance = getPerformance();
  const strategy = getBuySellStrategy();

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <div style={{ 
        padding: '24px',
        backgroundColor: darkMode ? '#1a202c' : '#f7fafc'
      }}>
        <h2 style={{ 
          color: darkMode ? '#ffffff' : '#2d3748',
          marginBottom: '16px'
        }}>
          Detailed Market Indices
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {loading
            ? Array(6).fill(0).map((_, i) => <React.Fragment key={i}>{renderLoadingCard()}</React.Fragment>)
            : displayedIndices.map((index, i) => (
              <div key={i} style={{
                border: darkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: darkMode ? '#2d3748' : '#ffffff',
                boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                color: darkMode ? '#ffffff' : '#2d3748'
              }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{index.name}</h3>
                <p style={{ margin: '4px 0' }}>Price: ₹{index.price}</p>
                {index.changePercent !== undefined && (
                  <p style={{ 
                    margin: '4px 0',
                    color: index.changePercent >= 0 ? '#48bb78' : '#f56565'
                  }}>
                    {index.changePercent >= 0 ? '+' : ''}{index.changePercent}%
                  </p>
                )}
              </div>
            ))
          }

          {!loading && (
            <div 
              onClick={toggleShowAll} 
              style={{
                cursor: 'pointer',
                border: darkMode ? '2px dashed #718096' : '2px dashed #a0aec0',
                padding: '12px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: darkMode ? '#2d3748' : '#ffffff',
                color: darkMode ? '#ffffff' : '#4a5568'
              }}
            >
              {showAll ? 'Collapse ▲' : 'View All ▼'}
            </div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`${styles.header} ${darkMode ? styles.darkHeader : ''}`}
      >
        <button 
          onClick={() => navigate(-1)}
          className={`${styles.backButton} ${darkMode ? styles.darkBackButton : ''}`}
        >
          &larr; Back
        </button>
        <h1 className={styles.title}>{stock.name} ({stock.symbol})</h1>
        <div className={styles.priceContainer}>
          <h2 className={styles.price}>₹{stock.price}</h2>
          <p className={stock.changePercent >= 0 ? styles.changePositive : styles.changeNegative}>
            {stock.changePercent >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(stock.changePercent)}%
          </p>
        </div>
      </motion.div>

      {error && (
        <div className={`${styles.error} ${darkMode ? styles.darkError : ''}`}>
          {error} - Showing simulated data
        </div>
      )}

      <div className={`${styles.card} ${darkMode ? styles.darkCard : ''}`}>
        <div 
          className={`${styles.summary} ${darkMode ? styles.darkSummary : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          <div className={styles.summaryLeft}>
            <div className={`${styles.symbolBox} ${darkMode ? styles.darkSymbolBox : ''}`}>
              {stock.symbol.substring(0, 3)}
            </div>
            <div>
              <h3 className={styles.stockName}>{stock.name}</h3>
              <p className={styles.stockSymbol}>{stock.symbol}</p>
            </div>
          </div>
          <div className={styles.summaryRight}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePredict();
              }}
              className={`${styles.predictButton} ${darkMode ? styles.darkPredictButton : ''}`}
              disabled={loading}
            >
              <FaChartLine />
              {loading ? 'Predicting...' : 'Predict'}
            </button>
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className={`${styles.details} ${darkMode ? styles.darkDetails : ''}`}>
              {(prediction || stock) && (
                <>
                  <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${darkMode ? styles.darkStatCard : ''}`}>
                      <p className={styles.statLabel}>
                        <FaChartLine className={styles.statIcon} />
                        Moving Average (20)
                      </p>
                      <p className={styles.statValue}>
                        ₹{(prediction?.moving_average || stock.moving_average)?.toFixed(2) || 'N/A'}
                      </p>
                    </div>

                    <div className={`${styles.statCard} ${darkMode ? styles.darkStatCard : ''}`}>
                      <p className={styles.statLabel}>
                        <FaPercentage className={styles.statIcon} />
                        RSI (14)
                      </p>
                      <p className={styles.statValue} style={{
                        color: (prediction?.rsi || stock.rsi) > 70 ? '#f56565' : 
                              (prediction?.rsi || stock.rsi) < 30 ? '#48bb78' : 
                              darkMode ? '#ffffff' : '#2d3748'
                      }}>
                        {(prediction?.rsi || stock.rsi)?.toFixed(2) || 'N/A'}
                      </p>
                    </div>

                    <div className={`${styles.statCard} ${darkMode ? styles.darkStatCard : ''}`}>
                      <p className={styles.statLabel}>
                        <FaDollarSign className={styles.statIcon} />
                        Today's Range
                      </p>
                      <p className={styles.statValue}>
                        ₹{(prediction?.today_low || stock.today_low)?.toFixed(2) || 'N/A'} - ₹
                        {(prediction?.today_high || stock.today_high)?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {prediction?.forecast && (
                    <div className={styles.chartContainer}>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4a5568' : '#eee'} />
                          <XAxis 
                            dataKey="date" 
                            tick={{ 
                              fontSize: 12,
                              fill: darkMode ? '#a0aec0' : '#718096'
                            }}
                          />
                          <YAxis 
                            tick={{ 
                              fontSize: 12,
                              fill: darkMode ? '#a0aec0' : '#718096'
                            }} 
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: darkMode ? '#2d3748' : '#ffffff',
                              borderColor: darkMode ? '#4a5568' : '#ddd',
                              color: darkMode ? '#ffffff' : '#2d3748'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#4299e1" 
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            name="Price (₹)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className={styles.strategyGrid}>
                    <div className={`${styles.strategyCard} ${darkMode ? styles.darkStrategyCard : ''}`}>
                      <h4 className={styles.strategyTitle}>
                        <FaCalendarAlt className={styles.strategyIcon} />
                        Suggested Trade Plan
                      </h4>
                      {strategy && strategy.isValid ? (
                        <div className={styles.strategyContent}>
                          <p style={{ color: darkMode ? '#e2e8f0' : '#4a5568' }}>
                            <strong>Buy on {strategy.buy.date}</strong> ({strategy.buy.day}) @{' '}
                            <strong>₹{strategy.buy.price.toFixed(2)}</strong>
                          </p>
                          <p style={{ color: darkMode ? '#e2e8f0' : '#4a5568' }}>
                            <strong>Sell on {strategy.sell.date}</strong> ({strategy.sell.day}) @{' '}
                            <strong>₹{strategy.sell.price.toFixed(2)}</strong>
                          </p>
                          <p className={styles.strategyProfit}>
                            <strong>Expected Profit:</strong>{' '}
                            <span style={{ color: '#48bb78', fontWeight: 'bold' }}>
                              ₹{strategy.profit}
                            </span>{' '}
                            (
                            {(
                              ((strategy.sell.price - strategy.buy.price) /
                              strategy.buy.price) *
                              100
                            ).toFixed(2)}
                            %)
                          </p>
                        </div>
                      ) : (
                        <p className={styles.noStrategy}>
                          {strategy ? 
                            "No valid trade strategy could be determined (market closed on predicted days)" : 
                            "No prediction data available"}
                        </p>
                      )}
                    </div>

                    <div className={`${styles.performanceCard} ${darkMode ? styles.darkPerformanceCard : ''}`}>
                      <h4 className={styles.performanceTitle}>
                        <FaInfoCircle className={styles.performanceIcon} />
                        Performance Overview
                      </h4>
                      {performance ? (
                        <div className={styles.performanceContent}>
                          <p 
                            className={styles.performanceText} 
                            style={{
                              color: parseFloat(performance) > 0 ? '#48bb78' : '#f56565'
                            }}
                          >
                            {parseFloat(performance) > 0 ? (
                              <FaArrowUp className={styles.performanceArrow} />
                            ) : (
                              <FaArrowDown className={styles.performanceArrow} />
                            )}
                            {Math.abs(parseFloat(performance))}%{' '}
                            {parseFloat(performance) > 0 ? 'increase' : 'decrease'} from current price
                          </p>

                          <div className={styles.performanceStats}>
                            <div className={styles.performanceStat}>
                              <p className={styles.performanceStatLabel}>Open Price</p>
                              <p className={styles.performanceStatValue}>
                                ₹{(prediction?.open_price || stock.open_price)?.toFixed(2) || 'N/A'}
                              </p>
                            </div>

                            <div className={styles.performanceStat}>
                              <p className={styles.performanceStatLabel}>Previous Close</p>
                              <p className={styles.performanceStatValue}>
                                ₹{(prediction?.previous_close || stock.previous_close)?.toFixed(2) || 'N/A'}
                              </p>
                            </div>

                            <div className={styles.performanceStat}>
                              <p className={styles.performanceStatLabel}>52W Low</p>
                              <p className={styles.performanceStatValue}>
                                ₹{(prediction?.week52_low || stock.week52_low)?.toFixed(2) || 'N/A'}
                              </p>
                            </div>

                            <div className={styles.performanceStat}>
                              <p className={styles.performanceStatLabel}>52W High</p>
                              <p className={styles.performanceStatValue}>
                                ₹{(prediction?.week52_high || stock.week52_high)?.toFixed(2) || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className={styles.noPerformance}>
                          {prediction?.forecast ? 
                            "Performance data not available (market closed)" : 
                            "No prediction data available"}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}