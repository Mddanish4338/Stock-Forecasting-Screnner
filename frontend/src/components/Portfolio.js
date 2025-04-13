// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   FaChartLine, 
//   FaSun, 
//   FaMoon, 
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
// import SearchBar from './SearchBar';
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
// import { initializeApp } from 'firebase/app';
// import { 
//   getFirestore, 
//   collection, 
//   doc, 
//   setDoc, 
//   deleteDoc,
//   onSnapshot,
//   serverTimestamp
// } from 'firebase/firestore';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCwsnVrsRCw8Z5Ad0utmTg9kylUgZP_VpE",
//   authDomain: "stockdata-1b0ba.firebaseapp.com",
//   projectId: "stockdata-1b0ba",
//   storageBucket: "stockdata-1b0ba.appspot.com",
//   messagingSenderId: "730039088765",
//   appId: "1:730039088765:web:92250345c5cc38d3cf6314",
//   measurementId: "G-K4JEVKT7BM"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const Portfolio = () => {
//   const [stocks, setStocks] = useState([]);
//   const [predictions, setPredictions] = useState({});
//   const [loading, setLoading] = useState({});
//   const [darkMode, setDarkMode] = useState(false);
//   const [expandedCards, setExpandedCards] = useState({});

//   // Toggle card expansion
//   const toggleCard = (symbol) => {
//     setExpandedCards(prev => ({
//       ...prev,
//       [symbol]: !prev[symbol]
//     }));
//   };

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

//   // Load stocks from Firestore
//   useEffect(() => {
//     const stocksRef = collection(db, 'stocks');
//     const unsubscribe = onSnapshot(
//       stocksRef,
//       (snapshot) => {
//         const loadedStocks = [];
//         snapshot.forEach((doc) => {
//           loadedStocks.push({ id: doc.id, ...doc.data() });
//         });
//         setStocks(loadedStocks);
        
//         // Initialize expanded state for new stocks
//         const initialExpanded = {};
//         loadedStocks.forEach(stock => {
//           if (expandedCards[stock.symbol] === undefined) {
//             initialExpanded[stock.symbol] = false;
//           }
//         });
//         setExpandedCards(prev => ({ ...prev, ...initialExpanded }));
//       },
//       (error) => {
//         console.error('Error loading stocks:', error);
//         alert('Failed to load stocks. Please refresh the page.');
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Load predictions from Firestore
//   useEffect(() => {
//     const predictionsRef = collection(db, 'predictions');
//     const unsubscribe = onSnapshot(
//       predictionsRef,
//       (snapshot) => {
//         const loadedPredictions = {};
//         snapshot.forEach((doc) => {
//           loadedPredictions[doc.id] = doc.data();
//         });
//         setPredictions(loadedPredictions);
//       },
//       (error) => {
//         console.error('Error loading predictions:', error);
//         alert('Failed to load predictions. Please refresh the page.');
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Add stock to Firestore
//   const handleAddStock = async (stock) => {
//     if (!stocks.find((s) => s.symbol === stock.symbol)) {
//       try {
//         await setDoc(doc(db, 'stocks', stock.symbol), {
//           ...stock,
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp()
//         });
//       } catch (error) {
//         console.error('Error adding stock:', error);
//         alert('Failed to add stock. Please try again.');
//       }
//     }
//   };

//   // Remove stock from Firestore
//   const handleRemoveStock = async (symbol) => {
//     try {
//       // Remove stock
//       await deleteDoc(doc(db, 'stocks', symbol));
//       // Remove corresponding prediction
//       await deleteDoc(doc(db, 'predictions', symbol));
//     } catch (error) {
//       console.error('Error removing stock:', error);
//       alert('Failed to remove stock. Please try again.');
//     }
//   };

//   // Save prediction to Firestore
//   const handlePredict = async (symbol) => {
//     setLoading((prev) => ({ ...prev, [symbol]: true }));
//     try {
//       const response = await axios.post('http://localhost:5000/api/predict', { symbol });
//       await setDoc(doc(db, 'predictions', symbol), {
//         ...response.data,
//         predictedAt: serverTimestamp(),
//         symbol: symbol
//       });
//     } catch (error) {
//       console.error('Prediction Error:', error);
//       alert(`Failed to get prediction for ${symbol}. Please try again.`);
//     } finally {
//       setLoading((prev) => ({ ...prev, [symbol]: false }));
//     }
//   };

//   const getBuySellStrategy = (forecast, dateLabels) => {
//     const marketDayForecasts = forecast.filter(
//       (_, index) => index < dateLabels.length && dateLabels[index].isMarketDay
//     );

//     if (marketDayForecasts.length === 0) return null;

//     const min = Math.min(...marketDayForecasts);
//     const max = Math.max(...marketDayForecasts);

//     const buyDayIndex = forecast.indexOf(min);
//     const sellDayIndex = forecast.indexOf(max);

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

//   const getPerformance = (currentPrice, forecast, dateLabels) => {
//     if (!forecast || forecast.length === 0) return null;

//     const lastMarketDayIndex = dateLabels.findIndex((label) => label.isMarketDay);
//     const lastForecast = forecast[lastMarketDayIndex];

//     if (typeof lastForecast === 'undefined') return null;

//     const change = ((lastForecast - currentPrice) / currentPrice) * 100;
//     return change.toFixed(2);
//   };

//   // Responsive styles
//   const themeStyles = {
//     background: darkMode ? '#121212' : '#f4f4f4',
//     color: darkMode ? '#ffffff' : '#1e1e2f',
//     transition: 'all 0.3s ease',
//     minHeight: '100vh',
//     padding: '2rem',
//     marginTop: '100px',
//     // Large desktop screens (1440px and up)
//     '@media (min-width: 1440px)': {
//       maxWidth: '1400px',
//       margin: '100px auto 0'
//     },
//     // Standard desktop screens (1024px - 1439px)
//     '@media (max-width: 1439px) and (min-width: 1024px)': {
//       padding: '1.75rem',
//       marginTop: '90px'
//     },
//     // Small desktop / tablet landscape (768px - 1023px)
//     '@media (max-width: 1023px) and (min-width: 768px)': {
//       padding: '1.5rem',
//       marginTop: '80px'
//     },
//     // Tablet portrait (576px - 767px)
//     '@media (max-width: 767px) and (min-width: 576px)': {
//       padding: '1.25rem',
//       marginTop: '70px'
//     },
//     // Mobile devices (up to 575px)
//     '@media (max-width: 575px)': {
//       padding: '1rem',
//       marginTop: '60px'
//     },
//     // Small mobile devices (up to 375px)
//     '@media (max-width: 375px)': {
//       padding: '0.75rem',
//       marginTop: '50px'
//     }
//   };

//   const cardStyle = {
//     background: darkMode ? '#1f1f2e' : '#ffffff',
//     borderRadius: '12px',
//     padding: '1rem',
//     marginBottom: '1rem',
//     boxShadow: darkMode ? '0 2px 8px rgba(255,255,255,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
//     overflow: 'hidden',
//     // Responsive adjustments
//     '@media (max-width: 1023px) and (min-width: 768px)': {
//       padding: '0.9rem'
//     },
//     '@media (max-width: 767px) and (min-width: 576px)': {
//       padding: '0.8rem',
//       borderRadius: '10px'
//     },
//     '@media (max-width: 575px)': {
//       padding: '0.7rem',
//       borderRadius: '8px'
//     },
//     '@media (max-width: 375px)': {
//       padding: '0.6rem',
//       marginBottom: '0.8rem'
//     }
//   };

//   const summaryStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     cursor: 'pointer',
//     padding: '0.75rem',
//     borderRadius: '8px',
//     transition: 'background-color 0.2s ease',
//     ':hover': {
//       backgroundColor: darkMode ? '#2a2a3a' : '#f0f0f0'
//     },
//     // Responsive adjustments
//     '@media (max-width: 767px)': {
//       flexDirection: 'column',
//       alignItems: 'flex-start',
//       gap: '0.75rem'
//     },
//     '@media (max-width: 575px)': {
//       padding: '0.6rem',
//       gap: '0.5rem'
//     }
//   };

//   const iconStyle = {
//     marginRight: '0.5rem',
//     verticalAlign: 'middle',
//     // Responsive adjustments
//     '@media (max-width: 575px)': {
//       marginRight: '0.3rem',
//       fontSize: '0.9rem'
//     }
//   };

//   const buttonStyle = {
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     padding: '0.35rem 0.75rem',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.4rem',
//     fontSize: '0.9rem',
//     transition: 'opacity 0.2s ease',
//     opacity: 1,
//     ':hover': {
//       opacity: 0.9
//     },
//     // Responsive adjustments
//     '@media (max-width: 1023px) and (min-width: 768px)': {
//       padding: '0.3rem 0.65rem',
//       fontSize: '0.85rem'
//     },
//     '@media (max-width: 767px)': {
//       padding: '0.25rem 0.5rem',
//       fontSize: '0.8rem'
//     },
//     '@media (max-width: 375px)': {
//       padding: '0.2rem 0.4rem',
//       fontSize: '0.75rem'
//     }
//   };

//   const chartContainerStyle = {
//     width: '100%',
//     height: '250px',
//     marginBottom: '1.5rem',
//     // Responsive adjustments
//     '@media (max-width: 1023px) and (min-width: 768px)': {
//       height: '220px'
//     },
//     '@media (max-width: 767px) and (min-width: 576px)': {
//       height: '200px',
//       marginBottom: '1.25rem'
//     },
//     '@media (max-width: 575px)': {
//       height: '180px',
//       marginBottom: '1rem'
//     }
//   };

//   const gridContainerStyle = {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//     gap: '1.5rem',
//     marginBottom: '1.5rem',
//     // Responsive adjustments
//     '@media (max-width: 1023px) and (min-width: 768px)': {
//       gap: '1.25rem'
//     },
//     '@media (max-width: 767px)': {
//       gridTemplateColumns: '1fr',
//       gap: '1rem'
//     },
//     '@media (max-width: 575px)': {
//       gap: '0.75rem',
//       marginBottom: '1rem'
//     }
//   };

//   return (
//     <div style={themeStyles}>
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '2rem',
//           paddingBottom: '1rem',
//           borderBottom: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
//           // Responsive adjustments
//           '@media (max-width: 767px)': {
//             marginBottom: '1.5rem',
//             flexDirection: 'column',
//             alignItems: 'flex-start',
//             gap: '1rem'
//           },
//           '@media (max-width: 575px)': {
//             marginBottom: '1.25rem',
//             gap: '0.75rem'
//           }
//         }}
//       >
//         <h2 style={{ 
//           margin: 0, 
//           display: 'flex', 
//           alignItems: 'center',
//           // Responsive adjustments
//           '@media (max-width: 767px)': {
//             fontSize: '1.5rem'
//           },
//           '@media (max-width: 575px)': {
//             fontSize: '1.3rem'
//           }
//         }}>
//           <FaChartBar style={{ 
//             marginRight: '0.75rem', 
//             color: '#007bff',
//             // Responsive adjustments
//             '@media (max-width: 575px)': {
//               marginRight: '0.5rem',
//               fontSize: '1.1rem'
//             }
//           }} />
//           Stock Portfolio Tracker
//         </h2>
//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           style={{
//             background: 'none',
//             border: 'none',
//             fontSize: '1.5rem',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             padding: '0.5rem',
//             borderRadius: '50%',
//             transition: 'background-color 0.2s ease',
//             ':hover': {
//               backgroundColor: darkMode ? '#333' : '#f0f0f0'
//             },
//             // Responsive adjustments
//             '@media (max-width: 767px)': {
//               fontSize: '1.3rem',
//               padding: '0.4rem',
//               alignSelf: 'flex-end'
//             },
//             '@media (max-width: 575px)': {
//               fontSize: '1.2rem',
//               padding: '0.3rem'
//             }
//           }}
//           aria-label="Toggle Theme"
//         >
//           {darkMode ? <FaSun color="#ffb74d" /> : <FaMoon color="#333" />}
//         </button>
//       </motion.div>

//       <SearchBar onAdd={handleAddStock} darkMode={darkMode} />

//       {stocks.length === 0 ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           style={{
//             textAlign: 'center',
//             padding: '2rem',
//             borderRadius: '12px',
//             backgroundColor: darkMode ? '#1f1f2e' : '#ffffff',
//             boxShadow: darkMode
//               ? '0 2px 8px rgba(255,255,255,0.05)'
//               : '0 2px 8px rgba(0,0,0,0.05)',
//             marginTop: '1rem',
//             // Responsive adjustments
//             '@media (max-width: 767px)': {
//               padding: '1.5rem'
//             },
//             '@media (max-width: 575px)': {
//               padding: '1rem'
//             }
//           }}
//         >
//           <FaInfoCircle
//             style={{
//               fontSize: '3rem',
//               color: darkMode ? '#555' : '#ccc',
//               marginBottom: '1rem',
//               // Responsive adjustments
//               '@media (max-width: 575px)': {
//                 fontSize: '2.5rem',
//                 marginBottom: '0.75rem'
//               }
//             }}
//           />
//           <p style={{ 
//             color: darkMode ? '#aaa' : '#666', 
//             margin: 0,
//             // Responsive adjustments
//             '@media (max-width: 575px)': {
//               fontSize: '0.9rem'
//             }
//           }}>
//             Your portfolio is empty. Search for stocks to add above.
//           </p>
//         </motion.div>
//       ) : (
//         <div style={{ marginTop: '1rem' }}>
//           {stocks.map((stock) => {
//             const prediction = predictions[stock.symbol];
//             const isLoading = loading[stock.symbol];
//             const isExpanded = expandedCards[stock.symbol];

//             const chartData = prediction
//               ? (() => {
//                   const dateLabels = generateMarketDateLabels(
//                     prediction.forecast.length
//                   );
//                   return [
//                     ...(isMarketDay(new Date())
//                       ? [
//                           {
//                             ...dateLabels[0],
//                             price: prediction.current_price
//                           }
//                         ]
//                       : []),
//                     ...prediction.forecast.map((p, i) => ({
//                       ...dateLabels[i],
//                       price: p
//                     }))
//                   ].filter((item) => item.isMarketDay);
//                 })()
//               : [];

//             const performance = prediction
//               ? getPerformance(
//                   prediction.current_price,
//                   prediction.forecast,
//                   generateMarketDateLabels(prediction.forecast.length)
//                 )
//               : null;

//             return (
//               <motion.div
//                 key={stock.symbol}
//                 style={cardStyle}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 layout
//               >
//                 <div
//                   style={{
//                     ...summaryStyle,
//                     backgroundColor: darkMode
//                       ? isExpanded
//                         ? '#2a2a3a'
//                         : '#1f1f2e'
//                       : isExpanded
//                       ? '#f0f0f0'
//                       : '#ffffff'
//                   }}
//                   onClick={() => toggleCard(stock.symbol)}
//                 >
//                   <div
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '0.75rem',
//                       // Responsive adjustments
//                       '@media (max-width: 575px)': {
//                         gap: '0.5rem'
//                       }
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: '40px',
//                         height: '40px',
//                         borderRadius: '8px',
//                         backgroundColor: darkMode ? '#007bff' : '#e6f0ff',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: darkMode ? '#fff' : '#007bff',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem',
//                         // Responsive adjustments
//                         '@media (max-width: 767px)': {
//                           width: '36px',
//                           height: '36px',
//                           fontSize: '1rem'
//                         },
//                         '@media (max-width: 575px)': {
//                           width: '32px',
//                           height: '32px',
//                           fontSize: '0.9rem'
//                         }
//                       }}
//                     >
//                       {stock.symbol.substring(0, 3)}
//                     </div>
//                     <div>
//                       <h3
//                         style={{
//                           margin: 0,
//                           fontSize: '1.1rem',
//                           fontWeight: '600',
//                           // Responsive adjustments
//                           '@media (max-width: 767px)': {
//                             fontSize: '1rem'
//                           },
//                           '@media (max-width: 575px)': {
//                             fontSize: '0.95rem'
//                           }
//                         }}
//                       >
//                         {stock.name}
//                       </h3>
//                       <p
//                         style={{
//                           margin: 0,
//                           fontSize: '0.9rem',
//                           color: darkMode ? '#aaa' : '#666',
//                           // Responsive adjustments
//                           '@media (max-width: 575px)': {
//                             fontSize: '0.8rem'
//                           }
//                         }}
//                       >
//                         {stock.symbol}
//                       </p>
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '1rem',
//                       // Responsive adjustments
//                       '@media (max-width: 767px)': {
//                         width: '100%',
//                         justifyContent: 'space-between'
//                       },
//                       '@media (max-width: 575px)': {
//                         gap: '0.5rem'
//                       }
//                     }}
//                   >
//                     {prediction && (
//                       <div
//                         style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '0.5rem',
//                           // Responsive adjustments
//                           '@media (max-width: 575px)': {
//                             gap: '0.3rem'
//                           }
//                         }}
//                       >
//                         <span
//                           style={{
//                             fontWeight: 'bold',
//                             fontSize: '1.1rem',
//                             color: darkMode ? '#fff' : '#333',
//                             // Responsive adjustments
//                             '@media (max-width: 767px)': {
//                               fontSize: '1rem'
//                             },
//                             '@media (max-width: 575px)': {
//                               fontSize: '0.95rem'
//                             }
//                           }}
//                         >
//                           ₹{prediction.current_price.toFixed(2)}
//                         </span>
//                         {performance && (
//                           <span
//                             style={{
//                               display: 'flex',
//                               alignItems: 'center',
//                               color: parseFloat(performance) > 0 ? '#28a745' : '#dc3545',
//                               fontWeight: '500',
//                               fontSize: '0.9rem',
//                               // Responsive adjustments
//                               '@media (max-width: 575px)': {
//                                 fontSize: '0.8rem'
//                               }
//                             }}
//                           >
//                             {parseFloat(performance) > 0 ? (
//                               <FaArrowUp style={{ marginRight: '0.25rem' }} />
//                             ) : (
//                               <FaArrowDown style={{ marginRight: '0.25rem' }} />
//                             )}
//                             {Math.abs(parseFloat(performance))}%
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     <div
//                       style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '0.5rem',
//                         // Responsive adjustments
//                         '@media (max-width: 575px)': {
//                           gap: '0.3rem'
//                         }
//                       }}
//                     >
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handlePredict(stock.symbol);
//                         }}
//                         disabled={isLoading}
//                         style={{
//                           ...buttonStyle,
//                           opacity: isLoading ? 0.7 : 1
//                         }}
//                       >
//                         <FaChartLine />
//                         {isLoading ? '...' : 'Predict'}
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRemoveStock(stock.symbol);
//                         }}
//                         style={{
//                           ...buttonStyle,
//                           backgroundColor: '#dc3545'
//                         }}
//                       >
//                         <FaTimes />
//                       </button>
//                       {isExpanded ? (
//                         <FaChevronUp
//                           style={{
//                             color: darkMode ? '#aaa' : '#666',
//                             marginLeft: '0.5rem',
//                             // Responsive adjustments
//                             '@media (max-width: 575px)': {
//                               marginLeft: '0.3rem',
//                               fontSize: '0.9rem'
//                             }
//                           }}
//                         />
//                       ) : (
//                         <FaChevronDown
//                           style={{
//                             color: darkMode ? '#aaa' : '#666',
//                             marginLeft: '0.5rem',
//                             // Responsive adjustments
//                             '@media (max-width: 575px)': {
//                               marginLeft: '0.3rem',
//                               fontSize: '0.9rem'
//                             }
//                           }}
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {isExpanded && prediction && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.3 }}
//                     style={{ overflow: 'hidden' }}
//                   >
//                     <div style={{ padding: '1rem' }}>
//                       <div
//                         style={{
//                           display: 'grid',
//                           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//                           gap: '1rem',
//                           marginBottom: '1.5rem',
//                           // Responsive adjustments
//                           '@media (max-width: 767px)': {
//                             gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
//                             gap: '0.75rem',
//                             marginBottom: '1.25rem'
//                           },
//                           '@media (max-width: 575px)': {
//                             gridTemplateColumns: '1fr',
//                             gap: '0.5rem',
//                             marginBottom: '1rem'
//                           }
//                         }}
//                       >
//                         <div
//                           style={{
//                             backgroundColor: darkMode ? '#2a2a3a' : '#f8f9fa',
//                             padding: '1rem',
//                             borderRadius: '8px',
//                             // Responsive adjustments
//                             '@media (max-width: 575px)': {
//                               padding: '0.75rem'
//                             }
//                           }}
//                         >
//                           <p
//                             style={{
//                               margin: '0 0 0.5rem 0',
//                               color: darkMode ? '#aaa' : '#666',
//                               fontSize: '0.9rem',
//                               display: 'flex',
//                               alignItems: 'center',
//                               // Responsive adjustments
//                               '@media (max-width: 575px)': {
//                                 fontSize: '0.85rem'
//                               }
//                             }}
//                           >
//                             <FaChartLine style={iconStyle} />
//                             Moving Average (20)
//                           </p>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: '1.2rem',
//                               fontWeight: '600',
//                               // Responsive adjustments
//                               '@media (max-width: 575px)': {
//                                 fontSize: '1.1rem'
//                               }
//                             }}
//                           >
//                             ₹{prediction.moving_average.toFixed(2)}
//                           </p>
//                         </div>

//                         <div
//                           style={{
//                             backgroundColor: darkMode ? '#2a2a3a' : '#f8f9fa',
//                             padding: '1rem',
//                             borderRadius: '8px',
//                             // Responsive adjustments
//                             '@media (max-width: 575px)': {
//                               padding: '0.75rem'
//                             }
//                           }}
//                         >
//                           <p
//                             style={{
//                               margin: '0 0 0.5rem 0',
//                               color: darkMode ? '#aaa' : '#666',
//                               fontSize: '0.9rem',
//                               display: 'flex',
//                               alignItems: 'center',
//                               // Responsive adjustments
//                               '@media (max-width: 575px)': {
//                                 fontSize: '0.85rem'
//                               }
//                             }}
//                           >
//                             <FaPercentage style={iconStyle} />
//                             RSI (14)
//                           </p>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: '1.2rem',
//                               fontWeight: '600',
//                               color:
//                                 prediction.rsi > 70
//                                   ? '#dc3545'
//                                   : prediction.rsi < 30
//                                   ? '#28a745'
//                                   : 'inherit',
//                               // Responsive adjustments
//                               '@media (max-width: 575px)': {
//                                 fontSize: '1.1rem'
//                               }
//                             }}
//                           >
//                             {prediction.rsi.toFixed(2)}
//                           </p>
//                         </div>

//                         <div
//                           style={{
//                             backgroundColor: darkMode ? '#2a2a3a' : '#f8f9fa',
//                             padding: '1rem',
//                             borderRadius: '8px',
//                             // Responsive adjustments
//                             '@media (max-width: 575px)': {
//                               padding: '0.75rem'
//                             }
//                           }}
//                         >
//                           <p
//                             style={{
//                               margin: '0 0 0.5rem 0',
//                               color: darkMode ? '#aaa' : '#666',
//                               fontSize: '0.9rem',
//                               display: 'flex',
//                               alignItems: 'center',
//                               // Responsive adjustments
//                               '@media (max-width: 575px)': {
//                                 fontSize: '0.85rem'
//                               }
//                             }}
//                           >
//                             <FaDollarSign style={iconStyle} />
//                             Today's Range
//                           </p>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: '1.2rem',
//                               fontWeight: '600',
//                               // Responsive adjustments
//                               '@media (max-width: 575px)': {
//                                 fontSize: '1.1rem'
//                               }
//                             }}
//                           >
//                             ₹{prediction.today_low?.toFixed(2) || 'N/A'} - ₹
//                             {prediction.today_high?.toFixed(2) || 'N/A'}
//                           </p>
//                         </div>
//                       </div>

//                       <div style={chartContainerStyle}>
//                         <ResponsiveContainer>
//                           <LineChart
//                             data={chartData}
//                             margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
//                           >
//                             <CartesianGrid
//                               strokeDasharray="3 3"
//                               stroke={darkMode ? '#444' : '#eee'}
//                             />
//                             <XAxis
//                               dataKey="date"
//                               tick={{
//                                 fill: darkMode ? '#aaa' : '#666',
//                                 fontSize: '0.75rem'
//                               }}
//                               tickFormatter={(value, index) => {
//                                 if (
//                                   index === 0 ||
//                                   index === chartData.length - 1 ||
//                                   index % 2 === 0
//                                 ) {
//                                   return `${value}\n${chartData[index].day}`;
//                                 }
//                                 return value;
//                               }}
//                             />
//                             <YAxis
//                               tick={{
//                                 fill: darkMode ? '#aaa' : '#666',
//                                 fontSize: '0.75rem'
//                               }}
//                             />
//                             <Tooltip
//                               contentStyle={{
//                                 background: darkMode ? '#2a2a3a' : '#fff',
//                                 borderColor: darkMode ? '#444' : '#ddd',
//                                 borderRadius: '8px',
//                                 boxShadow: darkMode
//                                   ? '0 2px 8px rgba(0,0,0,0.3)'
//                                   : '0 2px 8px rgba(0,0,0,0.1)'
//                               }}
//                               itemStyle={{
//                                 color: darkMode ? '#fff' : '#333'
//                               }}
//                               labelStyle={{
//                                 color: darkMode ? '#fff' : '#333',
//                                 fontWeight: 'bold'
//                               }}
//                             />
//                             <Legend />
//                             <Line
//                               type="monotone"
//                               dataKey="price"
//                               stroke="#007bff"
//                               strokeWidth={2}
//                               activeDot={{ r: 6 }}
//                               name="Price (₹)"
//                             />
//                           </LineChart>
//                         </ResponsiveContainer>
//                       </div>

//                       <div style={gridContainerStyle}>
//                         <div
//                           style={{
//                             backgroundColor: darkMode ? '#1d2733' : '#e6f0ff',
//                             padding: '1.25rem',
//                             borderRadius: '12px',
//                             border: '2px dashed #007bff',
//                             // Responsive adjustments
//                             '@media (max-width: 575px)': {
//                               padding: '1rem'
//                             }
//                           }}
//                         >
//                           <h4
//                             style={{
//                               margin: '0 0 1rem 0',
//                               display: 'flex',
//                               alignItems: 'center',
//                               color: '#007bff',
//                               // Responsive adjustments
//                               '@media (max-width: 575px)': {
//                                 fontSize: '1rem',
//                                 marginBottom: '0.75rem'
//                               }
//                             }}
//                           >
//                             <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
//                             Suggested Trade Plan
//                           </h4>
//                           {(() => {
//                             const dateLabels = generateMarketDateLabels(
//                               prediction.forecast.length
//                             );
//                             const strategy = getBuySellStrategy(
//                               prediction.forecast,
//                               dateLabels
//                             );

//                             if (!strategy || !strategy.isValid) {
//                               return (
//                                 <p
//                                   style={{
//                                     color: darkMode ? '#aaa' : '#666',
//                                     margin: 0,
//                                     // Responsive adjustments
//                                     '@media (max-width: 575px)': {
//                                       fontSize: '0.85rem'
//                                     }
//                                   }}
//                                 >
//                                   No valid trade strategy could be determined
//                                   (market closed on predicted days)
//                                 </p>
//                               );
//                             }

//                             return (
//                               <div style={{ lineHeight: '1.6' }}>
//                                 <p style={{ 
//                                   margin: '0.5rem 0',
//                                   // Responsive adjustments
//                                   '@media (max-width: 575px)': {
//                                     fontSize: '0.9rem',
//                                     margin: '0.4rem 0'
//                                   }
//                                 }}>
//                                   <strong>Buy on {strategy.buy.date}</strong> (
//                                   {strategy.buy.day}) @{' '}
//                                   <strong>
//                                     ₹{strategy.buy.price.toFixed(2)}
//                                   </strong>
//                                 </p>
//                                 <p style={{ 
//                                   margin: '0.5rem 0',
//                                   // Responsive adjustments
//                                   '@media (max-width: 575px)': {
//                                     fontSize: '0.9rem',
//                                     margin: '0.4rem 0'
//                                   }
//                                 }}>
//                                   <strong>Sell on {strategy.sell.date}</strong> (
//                                   {strategy.sell.day}) @{' '}
//                                   <strong>
//                                     ₹{strategy.sell.price.toFixed(2)}
//                                   </strong>
//                                 </p>
//                                 <p
//                                   style={{
//                                     margin: '0.5rem 0',
//                                     paddingTop: '0.5rem',
//                                     borderTop: darkMode
//                                       ? '1px solid #2a3a4a'
//                                       : '1px solid #cce0ff',
//                                     // Responsive adjustments
//                                     '@media (max-width: 575px)': {
//                                       fontSize: '0.9rem',
//                                       margin: '0.4rem 0',
//                                       paddingTop: '0.4rem'
//                                     }
//                                   }}
//                                 >
//                                   <strong>Expected Profit:</strong>{' '}
//                                   <span
//                                     style={{
//                                       color: '#28a745',
//                                       fontWeight: 'bold'
//                                     }}
//                                   >
//                                     ₹{strategy.profit}
//                                   </span>{' '}
//                                   (
//                                   {(
//                                     ((strategy.sell.price - strategy.buy.price) /
//                                       strategy.buy.price) *
//                                     100
//                                   ).toFixed(2)}
//                                   %)
//                                 </p>
//                               </div>
//                             );
//                           })()}
//                         </div>

//                         <div
//                           style={{
//                             backgroundColor: darkMode ? '#17212b' : '#ffffff',
//                             padding: '1.25rem',
//                             borderRadius: '12px',
//                             boxShadow: darkMode
//                               ? '0 2px 12px rgba(0,0,0,0.2)'
//                               : '0 2px 12px rgba(0,0,0,0.05)',
//                             // Responsive adjustments
//                             '@media (max-width: 575px)': {
//                               padding: '1rem'
//                             }
//                           }}
//                         >
//                           <h4
//                             style={{
//                               margin: '0 0 1rem 0',
//                               display: 'flex',
//                               alignItems: 'center',
//                               // Responsive adjustments
//                               '@media (max-width: 575px)': {
//                                 fontSize: '1rem',
//                                 marginBottom: '0.75rem'
//                               }
//                             }}
//                           >
//                             <FaInfoCircle
//                               style={{
//                                 marginRight: '0.5rem',
//                                 color: darkMode ? '#68d391' : '#28a745'
//                               }}
//                             />
//                             Performance Overview
//                           </h4>
//                           {(() => {
//                             const dateLabels = generateMarketDateLabels(
//                               prediction.forecast.length
//                             );
//                             const change = getPerformance(
//                               prediction.current_price,
//                               prediction.forecast,
//                               dateLabels
//                             );

//                             if (change === null) {
//                               return (
//                                 <p
//                                   style={{
//                                     color: darkMode ? '#aaa' : '#666',
//                                     margin: 0,
//                                     // Responsive adjustments
//                                     '@media (max-width: 575px)': {
//                                       fontSize: '0.85rem'
//                                     }
//                                   }}
//                                 >
//                                   Performance data not available (market closed)
//                                 </p>
//                               );
//                             }

//                             const isPositive = parseFloat(change) > 0;
//                             const lastMarketDay = dateLabels.findLast(
//                               (label) => label.isMarketDay
//                             );
//                             const lastDate =
//                               lastMarketDay?.fullDate ||
//                               `Day ${prediction.forecast.length}`;

//                             return (
//                               <div style={{ lineHeight: '1.6' }}>
//                                 <p
//                                   style={{
//                                     margin: '0.5rem 0',
//                                     color: isPositive ? '#28a745' : '#dc3545',
//                                     fontWeight: '500',
//                                     // Responsive adjustments
//                                     '@media (max-width: 575px)': {
//                                       fontSize: '0.9rem',
//                                       margin: '0.4rem 0'
//                                     }
//                                   }}
//                                 >
//                                   {isPositive ? (
//                                     <FaArrowUp
//                                       style={{
//                                         marginRight: '0.5rem',
//                                         verticalAlign: 'middle'
//                                       }}
//                                     />
//                                   ) : (
//                                     <FaArrowDown
//                                       style={{
//                                         marginRight: '0.5rem',
//                                         verticalAlign: 'middle'
//                                       }}
//                                     />
//                                   )}
//                                   {Math.abs(parseFloat(change))}%{' '}
//                                   {isPositive ? 'increase' : 'decrease'} from
//                                   current price to {lastDate}
//                                 </p>

//                                 <div
//                                   style={{
//                                     display: 'grid',
//                                     gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
//                                     gap: '1rem',
//                                     marginTop: '1rem',
//                                     // Responsive adjustments
//                                     '@media (max-width: 767px)': {
//                                       gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
//                                       gap: '0.75rem'
//                                     },
//                                     '@media (max-width: 575px)': {
//                                       gridTemplateColumns: 'repeat(2, 1fr)',
//                                       gap: '0.5rem',
//                                       marginTop: '0.75rem'
//                                     }
//                                   }}
//                                 >
//                                   <div>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         color: darkMode ? '#aaa' : '#666',
//                                         fontSize: '0.9rem',
//                                         // Responsive adjustments
//                                         '@media (max-width: 575px)': {
//                                           fontSize: '0.85rem'
//                                         }
//                                       }}
//                                     >
//                                       Open Price
//                                     </p>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         fontWeight: '600',
//                                         // Responsive adjustments
//                                         '@media (max-width: 575px)': {
//                                           fontSize: '0.95rem'
//                                         }
//                                       }}
//                                     >
//                                       ₹{prediction.open_price?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>

//                                   <div>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         color: darkMode ? '#aaa' : '#666',
//                                         fontSize: '0.9rem',
//                                         // Responsive adjustments
//                                         '@media (max-width: 575px)': {
//                                           fontSize: '0.85rem'
//                                         }
//                                       }}
//                                     >
//                                       Previous Close
//                                     </p>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         fontWeight: '600',
//                                         // Responsive adjustments
//                                         '@media (max-width: 575px)': {
//                                           fontSize: '0.95rem'
//                                         }
//                                       }}
//                                     >
//                                       ₹{prediction.previous_close?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>

//                                   <div>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         color: darkMode ? '#aaa' : '#666',
//                                         fontSize: '0.9rem',
//                                         // Responsive adjustments
//                                         '@media (max-width: 575px)': {
//                                           fontSize: '0.85rem'
//                                         }
//                                       }}
//                                     >
//                                       52W Low
//                                     </p>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         fontWeight: '600',
//                                         // Responsive adjustments
//                                         '@media (max-width: 575px)': {
//                                           fontSize: '0.95rem'
//                                         }
//                                       }}
//                                     >
//                                       ₹{prediction.week52_low?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>

//                                   <div>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         color: darkMode ? '#aaa' : '#666',
//                                         fontSize: '0.9rem',
//                                         // Responsive adjustments
//                                         '@media (max-width: 575px)': {
//                                           fontSize: '0.85rem'
//                                         }
//                                       }}
//                                     >
//                                       52W High
//                                     </p>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         fontWeight: '600',
//                                         // Responsive adjustments
//                                         '@media (max-width: 575px)': {
//                                           fontSize: '0.95rem'
//                                         }
//                                       }}
//                                     >
//                                       ₹{prediction.week52_high?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>
//                             );
//                           })()}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Portfolio;





















// import React, { useState, useEffect } from 'react';
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
// import SearchBar from './SearchBar';
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
// import { initializeApp } from 'firebase/app';
// import { 
//   getFirestore, 
//   collection, 
//   doc, 
//   setDoc, 
//   deleteDoc,
//   onSnapshot,
//   serverTimestamp
// } from 'firebase/firestore';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCwsnVrsRCw8Z5Ad0utmTg9kylUgZP_VpE",
//   authDomain: "stockdata-1b0ba.firebaseapp.com",
//   projectId: "stockdata-1b0ba",
//   storageBucket: "stockdata-1b0ba.appspot.com",
//   messagingSenderId: "730039088765",
//   appId: "1:730039088765:web:92250345c5cc38d3cf6314",
//   measurementId: "G-K4JEVKT7BM"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const Portfolio = ({ darkMode }) => {
//   const [stocks, setStocks] = useState([]);
//   const [predictions, setPredictions] = useState({});
//   const [loading, setLoading] = useState({});
//   const [expandedCards, setExpandedCards] = useState({});

//   // Toggle card expansion
//   const toggleCard = (symbol) => {
//     setExpandedCards(prev => ({
//       ...prev,
//       [symbol]: !prev[symbol]
//     }));
//   };

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

//   // Load stocks from Firestore
//   useEffect(() => {
//     const stocksRef = collection(db, 'stocks');
//     const unsubscribe = onSnapshot(
//       stocksRef,
//       (snapshot) => {
//         const loadedStocks = [];
//         snapshot.forEach((doc) => {
//           loadedStocks.push({ id: doc.id, ...doc.data() });
//         });
//         setStocks(loadedStocks);
        
//         // Initialize expanded state for new stocks
//         const initialExpanded = {};
//         loadedStocks.forEach(stock => {
//           if (expandedCards[stock.symbol] === undefined) {
//             initialExpanded[stock.symbol] = false;
//           }
//         });
//         setExpandedCards(prev => ({ ...prev, ...initialExpanded }));
//       },
//       (error) => {
//         console.error('Error loading stocks:', error);
//         alert('Failed to load stocks. Please refresh the page.');
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Load predictions from Firestore
//   useEffect(() => {
//     const predictionsRef = collection(db, 'predictions');
//     const unsubscribe = onSnapshot(
//       predictionsRef,
//       (snapshot) => {
//         const loadedPredictions = {};
//         snapshot.forEach((doc) => {
//           loadedPredictions[doc.id] = doc.data();
//         });
//         setPredictions(loadedPredictions);
//       },
//       (error) => {
//         console.error('Error loading predictions:', error);
//         alert('Failed to load predictions. Please refresh the page.');
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Add stock to Firestore
//   const handleAddStock = async (stock) => {
//     if (!stocks.find((s) => s.symbol === stock.symbol)) {
//       try {
//         await setDoc(doc(db, 'stocks', stock.symbol), {
//           ...stock,
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp()
//         });
//       } catch (error) {
//         console.error('Error adding stock:', error);
//         alert('Failed to add stock. Please try again.');
//       }
//     }
//   };

//   // Remove stock from Firestore
//   const handleRemoveStock = async (symbol) => {
//     try {
//       // Remove stock
//       await deleteDoc(doc(db, 'stocks', symbol));
//       // Remove corresponding prediction
//       await deleteDoc(doc(db, 'predictions', symbol));
//     } catch (error) {
//       console.error('Error removing stock:', error);
//       alert('Failed to remove stock. Please try again.');
//     }
//   };

//   // Save prediction to Firestore
//   const handlePredict = async (symbol) => {
//     setLoading((prev) => ({ ...prev, [symbol]: true }));
//     try {
//       const response = await axios.post('http://localhost:5000/api/predict', { symbol });
//       await setDoc(doc(db, 'predictions', symbol), {
//         ...response.data,
//         predictedAt: serverTimestamp(),
//         symbol: symbol
//       });
//     } catch (error) {
//       console.error('Prediction Error:', error);
//       alert(`Failed to get prediction for ${symbol}. Please try again.`);
//     } finally {
//       setLoading((prev) => ({ ...prev, [symbol]: false }));
//     }
//   };

//   const getBuySellStrategy = (forecast, dateLabels) => {
//     const marketDayForecasts = forecast.filter(
//       (_, index) => index < dateLabels.length && dateLabels[index].isMarketDay
//     );

//     if (marketDayForecasts.length === 0) return null;

//     const min = Math.min(...marketDayForecasts);
//     const max = Math.max(...marketDayForecasts);

//     const buyDayIndex = forecast.indexOf(min);
//     const sellDayIndex = forecast.indexOf(max);

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

//   const getPerformance = (currentPrice, forecast, dateLabels) => {
//     if (!forecast || forecast.length === 0) return null;

//     const lastMarketDayIndex = dateLabels.findIndex((label) => label.isMarketDay);
//     const lastForecast = forecast[lastMarketDayIndex];

//     if (typeof lastForecast === 'undefined') return null;

//     const change = ((lastForecast - currentPrice) / currentPrice) * 100;
//     return change.toFixed(2);
//   };

//   // Responsive styles
//   const themeStyles = {
//     background: darkMode ? '#121212' : '#f4f4f4',
//     color: darkMode ? '#ffffff' : '#1e1e2f',
//     transition: 'all 0.3s ease',
//     minHeight: '100vh',
//     padding: '2rem',
//     marginTop: '100px',
//     '@media (max-width: 1440px)': {
//       maxWidth: '1400px',
//       margin: '100px auto 0'
//     },
//     '@media (max-width: 1024px)': {
//       padding: '1.75rem',
//       marginTop: '90px'
//     },
//     '@media (max-width: 768px)': {
//       padding: '1.5rem',
//       marginTop: '80px'
//     },
//     '@media (max-width: 576px)': {
//       padding: '1.25rem',
//       marginTop: '70px'
//     },
//     '@media (max-width: 375px)': {
//       padding: '1rem',
//       marginTop: '60px'
//     }
//   };

//   const cardStyle = {
//     background: darkMode ? '#1f1f2e' : '#ffffff',
//     borderRadius: '12px',
//     padding: '1rem',
//     marginBottom: '1rem',
//     boxShadow: darkMode ? '0 2px 8px rgba(255,255,255,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
//     overflow: 'hidden',
//     '@media (max-width: 768px)': {
//       padding: '0.9rem'
//     },
//     '@media (max-width: 576px)': {
//       padding: '0.8rem',
//       borderRadius: '10px'
//     },
//     '@media (max-width: 375px)': {
//       padding: '0.7rem',
//       borderRadius: '8px'
//     }
//   };

//   const summaryStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     cursor: 'pointer',
//     padding: '0.75rem',
//     borderRadius: '8px',
//     transition: 'background-color 0.2s ease',
//     ':hover': {
//       backgroundColor: darkMode ? '#2a2a3a' : '#f0f0f0'
//     },
//     '@media (max-width: 768px)': {
//       flexDirection: 'column',
//       alignItems: 'flex-start',
//       gap: '0.75rem'
//     },
//     '@media (max-width: 576px)': {
//       padding: '0.6rem',
//       gap: '0.5rem'
//     }
//   };

//   const iconStyle = {
//     marginRight: '0.5rem',
//     verticalAlign: 'middle',
//     '@media (max-width: 576px)': {
//       marginRight: '0.3rem',
//       fontSize: '0.9rem'
//     }
//   };

//   const buttonStyle = {
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     padding: '0.35rem 0.75rem',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.4rem',
//     fontSize: '0.9rem',
//     transition: 'opacity 0.2s ease',
//     opacity: 1,
//     ':hover': {
//       opacity: 0.9
//     },
//     '@media (max-width: 768px)': {
//       padding: '0.3rem 0.65rem',
//       fontSize: '0.85rem'
//     },
//     '@media (max-width: 576px)': {
//       padding: '0.25rem 0.5rem',
//       fontSize: '0.8rem'
//     }
//   };

//   const chartContainerStyle = {
//     width: '100%',
//     height: '250px',
//     marginBottom: '1.5rem',
//     '@media (max-width: 768px)': {
//       height: '220px'
//     },
//     '@media (max-width: 576px)': {
//       height: '200px',
//       marginBottom: '1.25rem'
//     }
//   };

//   const gridContainerStyle = {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//     gap: '1.5rem',
//     marginBottom: '1.5rem',
//     '@media (max-width: 768px)': {
//       gap: '1.25rem'
//     },
//     '@media (max-width: 576px)': {
//       gridTemplateColumns: '1fr',
//       gap: '1rem'
//     }
//   };

//   return (
//     <div style={themeStyles}>
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '2rem',
//           paddingBottom: '1rem',
//           borderBottom: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
//           '@media (max-width: 768px)': {
//             marginBottom: '1.5rem',
//             flexDirection: 'column',
//             alignItems: 'flex-start',
//             gap: '1rem'
//           }
//         }}
//       >
//         <h2 style={{ 
//           margin: 0, 
//           display: 'flex', 
//           alignItems: 'center',
//           '@media (max-width: 768px)': {
//             fontSize: '1.5rem'
//           }
//         }}>
//           <FaChartBar style={{ 
//             marginRight: '0.75rem', 
//             color: '#007bff',
//             '@media (max-width: 576px)': {
//               marginRight: '0.5rem'
//             }
//           }} />
//           Stock Portfolio Tracker
//         </h2>
//       </motion.div>

//       <SearchBar onAdd={handleAddStock} darkMode={darkMode} />

//       {stocks.length === 0 ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           style={{
//             textAlign: 'center',
//             padding: '2rem',
//             borderRadius: '12px',
//             backgroundColor: darkMode ? '#1f1f2e' : '#ffffff',
//             boxShadow: darkMode
//               ? '0 2px 8px rgba(255,255,255,0.05)'
//               : '0 2px 8px rgba(0,0,0,0.05)',
//             marginTop: '1rem',
//             '@media (max-width: 768px)': {
//               padding: '1.5rem'
//             }
//           }}
//         >
//           <FaInfoCircle
//             style={{
//               fontSize: '3rem',
//               color: darkMode ? '#555' : '#ccc',
//               marginBottom: '1rem',
//               '@media (max-width: 576px)': {
//                 fontSize: '2.5rem'
//               }
//             }}
//           />
//           <p style={{ 
//             color: darkMode ? '#aaa' : '#666', 
//             margin: 0,
//             '@media (max-width: 576px)': {
//               fontSize: '0.9rem'
//             }
//           }}>
//             Your portfolio is empty. Search for stocks to add above.
//           </p>
//         </motion.div>
//       ) : (
//         <div style={{ marginTop: '1rem' }}>
//           {stocks.map((stock) => {
//             const prediction = predictions[stock.symbol];
//             const isLoading = loading[stock.symbol];
//             const isExpanded = expandedCards[stock.symbol];

//             const chartData = prediction
//               ? (() => {
//                   const dateLabels = generateMarketDateLabels(
//                     prediction.forecast.length
//                   );
//                   return [
//                     ...(isMarketDay(new Date())
//                       ? [
//                           {
//                             ...dateLabels[0],
//                             price: prediction.current_price
//                           }
//                         ]
//                       : []),
//                     ...prediction.forecast.map((p, i) => ({
//                       ...dateLabels[i],
//                       price: p
//                     }))
//                   ].filter((item) => item.isMarketDay);
//                 })()
//               : [];

//             const performance = prediction
//               ? getPerformance(
//                   prediction.current_price,
//                   prediction.forecast,
//                   generateMarketDateLabels(prediction.forecast.length)
//                 )
//               : null;

//             return (
//               <motion.div
//                 key={stock.symbol}
//                 style={cardStyle}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 layout
//               >
//                 <div
//                   style={{
//                     ...summaryStyle,
//                     backgroundColor: darkMode
//                       ? isExpanded
//                         ? '#2a2a3a'
//                         : '#1f1f2e'
//                       : isExpanded
//                       ? '#f0f0f0'
//                       : '#ffffff'
//                   }}
//                   onClick={() => toggleCard(stock.symbol)}
//                 >
//                   <div
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '0.75rem',
//                       '@media (max-width: 576px)': {
//                         gap: '0.5rem'
//                       }
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: '40px',
//                         height: '40px',
//                         borderRadius: '8px',
//                         backgroundColor: darkMode ? '#007bff' : '#e6f0ff',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: darkMode ? '#fff' : '#007bff',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem',
//                         '@media (max-width: 576px)': {
//                           width: '32px',
//                           height: '32px',
//                           fontSize: '0.9rem'
//                         }
//                       }}
//                     >
//                       {stock.symbol.substring(0, 3)}
//                     </div>
//                     <div>
//                       <h3
//                         style={{
//                           margin: 0,
//                           fontSize: '1.1rem',
//                           fontWeight: '600',
//                           '@media (max-width: 576px)': {
//                             fontSize: '0.95rem'
//                           }
//                         }}
//                       >
//                         {stock.name}
//                       </h3>
//                       <p
//                         style={{
//                           margin: 0,
//                           fontSize: '0.9rem',
//                           color: darkMode ? '#aaa' : '#666',
//                           '@media (max-width: 576px)': {
//                             fontSize: '0.8rem'
//                           }
//                         }}
//                       >
//                         {stock.symbol}
//                       </p>
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '1rem',
//                       '@media (max-width: 768px)': {
//                         width: '100%',
//                         justifyContent: 'space-between'
//                       }
//                     }}
//                   >
//                     {prediction && (
//                       <div
//                         style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '0.5rem'
//                         }}
//                       >
//                         <span
//                           style={{
//                             fontWeight: 'bold',
//                             fontSize: '1.1rem',
//                             color: darkMode ? '#fff' : '#333',
//                             '@media (max-width: 576px)': {
//                               fontSize: '0.95rem'
//                             }
//                           }}
//                         >
//                           ₹{prediction.current_price.toFixed(2)}
//                         </span>
//                         {performance && (
//                           <span
//                             style={{
//                               display: 'flex',
//                               alignItems: 'center',
//                               color: parseFloat(performance) > 0 ? '#28a745' : '#dc3545',
//                               fontWeight: '500',
//                               fontSize: '0.9rem'
//                             }}
//                           >
//                             {parseFloat(performance) > 0 ? (
//                               <FaArrowUp style={{ marginRight: '0.25rem' }} />
//                             ) : (
//                               <FaArrowDown style={{ marginRight: '0.25rem' }} />
//                             )}
//                             {Math.abs(parseFloat(performance))}%
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     <div
//                       style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '0.5rem'
//                       }}
//                     >
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handlePredict(stock.symbol);
//                         }}
//                         disabled={isLoading}
//                         style={{
//                           ...buttonStyle,
//                           opacity: isLoading ? 0.7 : 1
//                         }}
//                       >
//                         <FaChartLine />
//                         {isLoading ? '...' : 'Predict'}
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRemoveStock(stock.symbol);
//                         }}
//                         style={{
//                           ...buttonStyle,
//                           backgroundColor: '#dc3545'
//                         }}
//                       >
//                         <FaTimes />
//                       </button>
//                       {isExpanded ? (
//                         <FaChevronUp
//                           style={{
//                             color: darkMode ? '#aaa' : '#666',
//                             marginLeft: '0.5rem'
//                           }}
//                         />
//                       ) : (
//                         <FaChevronDown
//                           style={{
//                             color: darkMode ? '#aaa' : '#666',
//                             marginLeft: '0.5rem'
//                           }}
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {isExpanded && prediction && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.3 }}
//                     style={{ overflow: 'hidden' }}
//                   >
//                     <div style={{ padding: '1rem' }}>
//                       <div
//                         style={{
//                           display: 'grid',
//                           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//                           gap: '1rem',
//                           marginBottom: '1.5rem',
//                           '@media (max-width: 576px)': {
//                             gridTemplateColumns: '1fr',
//                             gap: '0.5rem'
//                           }
//                         }}
//                       >
//                         <div
//                           style={{
//                             backgroundColor: darkMode ? '#2a2a3a' : '#f8f9fa',
//                             padding: '1rem',
//                             borderRadius: '8px'
//                           }}
//                         >
//                           <p
//                             style={{
//                               margin: '0 0 0.5rem 0',
//                               color: darkMode ? '#aaa' : '#666',
//                               fontSize: '0.9rem',
//                               display: 'flex',
//                               alignItems: 'center'
//                             }}
//                           >
//                             <FaChartLine style={iconStyle} />
//                             Moving Average (20)
//                           </p>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: '1.2rem',
//                               fontWeight: '600'
//                             }}
//                           >
//                             ₹{prediction.moving_average.toFixed(2)}
//                           </p>
//                         </div>

//                         <div
//                           style={{
//                             backgroundColor: darkMode ? '#2a2a3a' : '#f8f9fa',
//                             padding: '1rem',
//                             borderRadius: '8px'
//                           }}
//                         >
//                           <p
//                             style={{
//                               margin: '0 0 0.5rem 0',
//                               color: darkMode ? '#aaa' : '#666',
//                               fontSize: '0.9rem',
//                               display: 'flex',
//                               alignItems: 'center'
//                             }}
//                           >
//                             <FaPercentage style={iconStyle} />
//                             RSI (14)
//                           </p>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: '1.2rem',
//                               fontWeight: '600',
//                               color:
//                                 prediction.rsi > 70
//                                   ? '#dc3545'
//                                   : prediction.rsi < 30
//                                   ? '#28a745'
//                                   : 'inherit'
//                             }}
//                           >
//                             {prediction.rsi.toFixed(2)}
//                           </p>
//                         </div>

//                         <div
//                           style={{
//                             backgroundColor: darkMode ? '#2a2a3a' : '#f8f9fa',
//                             padding: '1rem',
//                             borderRadius: '8px'
//                           }}
//                         >
//                           <p
//                             style={{
//                               margin: '0 0 0.5rem 0',
//                               color: darkMode ? '#aaa' : '#666',
//                               fontSize: '0.9rem',
//                               display: 'flex',
//                               alignItems: 'center'
//                             }}
//                           >
//                             <FaDollarSign style={iconStyle} />
//                             Today's Range
//                           </p>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: '1.2rem',
//                               fontWeight: '600'
//                             }}
//                           >
//                             ₹{prediction.today_low?.toFixed(2) || 'N/A'} - ₹
//                             {prediction.today_high?.toFixed(2) || 'N/A'}
//                           </p>
//                         </div>
//                       </div>

//                       <div style={chartContainerStyle}>
//                         <ResponsiveContainer>
//                           <LineChart
//                             data={chartData}
//                             margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
//                           >
//                             <CartesianGrid
//                               strokeDasharray="3 3"
//                               stroke={darkMode ? '#444' : '#eee'}
//                             />
//                             <XAxis
//                               dataKey="date"
//                               tick={{
//                                 fill: darkMode ? '#aaa' : '#666',
//                                 fontSize: '0.75rem'
//                               }}
//                               tickFormatter={(value, index) => {
//                                 if (
//                                   index === 0 ||
//                                   index === chartData.length - 1 ||
//                                   index % 2 === 0
//                                 ) {
//                                   return `${value}\n${chartData[index].day}`;
//                                 }
//                                 return value;
//                               }}
//                             />
//                             <YAxis
//                               tick={{
//                                 fill: darkMode ? '#aaa' : '#666',
//                                 fontSize: '0.75rem'
//                               }}
//                             />
//                             <Tooltip
//                               contentStyle={{
//                                 background: darkMode ? '#2a2a3a' : '#fff',
//                                 borderColor: darkMode ? '#444' : '#ddd',
//                                 borderRadius: '8px',
//                                 boxShadow: darkMode
//                                   ? '0 2px 8px rgba(0,0,0,0.3)'
//                                   : '0 2px 8px rgba(0,0,0,0.1)'
//                               }}
//                               itemStyle={{
//                                 color: darkMode ? '#fff' : '#333'
//                               }}
//                               labelStyle={{
//                                 color: darkMode ? '#fff' : '#333',
//                                 fontWeight: 'bold'
//                               }}
//                             />
//                             <Legend />
//                             <Line
//                               type="monotone"
//                               dataKey="price"
//                               stroke="#007bff"
//                               strokeWidth={2}
//                               activeDot={{ r: 6 }}
//                               name="Price (₹)"
//                             />
//                           </LineChart>
//                         </ResponsiveContainer>
//                       </div>

//                       <div style={gridContainerStyle}>
//                         <div
//                           style={{
//                             backgroundColor: darkMode ? '#1d2733' : '#e6f0ff',
//                             padding: '1.25rem',
//                             borderRadius: '12px',
//                             border: '2px dashed #007bff'
//                           }}
//                         >
//                           <h4
//                             style={{
//                               margin: '0 0 1rem 0',
//                               display: 'flex',
//                               alignItems: 'center',
//                               color: '#007bff'
//                             }}
//                           >
//                             <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
//                             Suggested Trade Plan
//                           </h4>
//                           {(() => {
//                             const dateLabels = generateMarketDateLabels(
//                               prediction.forecast.length
//                             );
//                             const strategy = getBuySellStrategy(
//                               prediction.forecast,
//                               dateLabels
//                             );

//                             if (!strategy || !strategy.isValid) {
//                               return (
//                                 <p
//                                   style={{
//                                     color: darkMode ? '#aaa' : '#666',
//                                     margin: 0
//                                   }}
//                                 >
//                                   No valid trade strategy could be determined
//                                   (market closed on predicted days)
//                                 </p>
//                               );
//                             }

//                             return (
//                               <div style={{ lineHeight: '1.6' }}>
//                                 <p style={{ margin: '0.5rem 0' }}>
//                                   <strong>Buy on {strategy.buy.date}</strong> (
//                                   {strategy.buy.day}) @{' '}
//                                   <strong>
//                                     ₹{strategy.buy.price.toFixed(2)}
//                                   </strong>
//                                 </p>
//                                 <p style={{ margin: '0.5rem 0' }}>
//                                   <strong>Sell on {strategy.sell.date}</strong> (
//                                   {strategy.sell.day}) @{' '}
//                                   <strong>
//                                     ₹{strategy.sell.price.toFixed(2)}
//                                   </strong>
//                                 </p>
//                                 <p
//                                   style={{
//                                     margin: '0.5rem 0',
//                                     paddingTop: '0.5rem',
//                                     borderTop: darkMode
//                                       ? '1px solid #2a3a4a'
//                                       : '1px solid #cce0ff'
//                                   }}
//                                 >
//                                   <strong>Expected Profit:</strong>{' '}
//                                   <span
//                                     style={{
//                                       color: '#28a745',
//                                       fontWeight: 'bold'
//                                     }}
//                                   >
//                                     ₹{strategy.profit}
//                                   </span>{' '}
//                                   (
//                                   {(
//                                     ((strategy.sell.price - strategy.buy.price) /
//                                       strategy.buy.price) *
//                                     100
//                                   ).toFixed(2)}
//                                   %)
//                                 </p>
//                               </div>
//                             );
//                           })()}
//                         </div>

//                         <div
//                           style={{
//                             backgroundColor: darkMode ? '#17212b' : '#ffffff',
//                             padding: '1.25rem',
//                             borderRadius: '12px',
//                             boxShadow: darkMode
//                               ? '0 2px 12px rgba(0,0,0,0.2)'
//                               : '0 2px 12px rgba(0,0,0,0.05)'
//                           }}
//                         >
//                           <h4
//                             style={{
//                               margin: '0 0 1rem 0',
//                               display: 'flex',
//                               alignItems: 'center'
//                             }}
//                           >
//                             <FaInfoCircle
//                               style={{
//                                 marginRight: '0.5rem',
//                                 color: darkMode ? '#68d391' : '#28a745'
//                               }}
//                             />
//                             Performance Overview
//                           </h4>
//                           {(() => {
//                             const dateLabels = generateMarketDateLabels(
//                               prediction.forecast.length
//                             );
//                             const change = getPerformance(
//                               prediction.current_price,
//                               prediction.forecast,
//                               dateLabels
//                             );

//                             if (change === null) {
//                               return (
//                                 <p
//                                   style={{
//                                     color: darkMode ? '#aaa' : '#666',
//                                     margin: 0
//                                   }}
//                                 >
//                                   Performance data not available (market closed)
//                                 </p>
//                               );
//                             }

//                             const isPositive = parseFloat(change) > 0;
//                             const lastMarketDay = dateLabels.findLast(
//                               (label) => label.isMarketDay
//                             );
//                             const lastDate =
//                               lastMarketDay?.fullDate ||
//                               `Day ${prediction.forecast.length}`;

//                             return (
//                               <div style={{ lineHeight: '1.6' }}>
//                                 <p
//                                   style={{
//                                     margin: '0.5rem 0',
//                                     color: isPositive ? '#28a745' : '#dc3545',
//                                     fontWeight: '500'
//                                   }}
//                                 >
//                                   {isPositive ? (
//                                     <FaArrowUp
//                                       style={{
//                                         marginRight: '0.5rem',
//                                         verticalAlign: 'middle'
//                                       }}
//                                     />
//                                   ) : (
//                                     <FaArrowDown
//                                       style={{
//                                         marginRight: '0.5rem',
//                                         verticalAlign: 'middle'
//                                       }}
//                                     />
//                                   )}
//                                   {Math.abs(parseFloat(change))}%{' '}
//                                   {isPositive ? 'increase' : 'decrease'} from
//                                   current price to {lastDate}
//                                 </p>

//                                 <div
//                                   style={{
//                                     display: 'grid',
//                                     gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
//                                     gap: '1rem',
//                                     marginTop: '1rem'
//                                   }}
//                                 >
//                                   <div>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         color: darkMode ? '#aaa' : '#666',
//                                         fontSize: '0.9rem'
//                                       }}
//                                     >
//                                       Open Price
//                                     </p>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         fontWeight: '600'
//                                       }}
//                                     >
//                                       ₹{prediction.open_price?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>

//                                   <div>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         color: darkMode ? '#aaa' : '#666',
//                                         fontSize: '0.9rem'
//                                       }}
//                                     >
//                                       Previous Close
//                                     </p>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         fontWeight: '600'
//                                       }}
//                                     >
//                                       ₹{prediction.previous_close?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>

//                                   <div>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         color: darkMode ? '#aaa' : '#666',
//                                         fontSize: '0.9rem'
//                                       }}
//                                     >
//                                       52W Low
//                                     </p>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         fontWeight: '600'
//                                       }}
//                                     >
//                                       ₹{prediction.week52_low?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>

//                                   <div>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         color: darkMode ? '#aaa' : '#666',
//                                         fontSize: '0.9rem'
//                                       }}
//                                     >
//                                       52W High
//                                     </p>
//                                     <p
//                                       style={{
//                                         margin: '0.25rem 0',
//                                         fontWeight: '600'
//                                       }}
//                                     >
//                                       ₹{prediction.week52_high?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>
//                             );
//                           })()}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Portfolio;





// import React, { useState, useEffect } from 'react';
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
// import SearchBar from './SearchBar';
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
// import { initializeApp } from 'firebase/app';
// import { 
//   getFirestore, 
//   collection, 
//   doc, 
//   setDoc, 
//   deleteDoc,
//   onSnapshot,
//   serverTimestamp
// } from 'firebase/firestore';
// import './Portfolio.css';



// const firebaseConfig = {
//   apiKey: "AIzaSyCwsnVrsRCw8Z5Ad0utmTg9kylUgZP_VpE",
//   authDomain: "stockdata-1b0ba.firebaseapp.com",
//   projectId: "stockdata-1b0ba",
//   storageBucket: "stockdata-1b0ba.appspot.com",
//   messagingSenderId: "730039088765",
//   appId: "1:730039088765:web:92250345c5cc38d3cf6314",
//   measurementId: "G-K4JEVKT7BM"
// };



// // const firebaseConfig = {
// //   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
// //   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
// //   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
// //   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
// //   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
// //   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// //   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// // };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const Portfolio = ({ darkMode }) => {
//   const [stocks, setStocks] = useState([]);
//   const [predictions, setPredictions] = useState({});
//   const [loading, setLoading] = useState({});
//   const [expandedCards, setExpandedCards] = useState({});

//   // CSS variables based on dark mode
//   const cssVariables = {
//     '--background': darkMode ? '#121212' : '#f4f4f4',
//     '--text-color': darkMode ? '#ffffff' : '#1e1e2f',
//     '--secondary-text': darkMode ? '#aaa' : '#666',
//     '--card-bg': darkMode ? '#1f1f2e' : '#ffffff',
//     '--card-shadow': darkMode ? '0 2px 8px rgba(255,255,255,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
//     '--hover-bg': darkMode ? '#2a2a3a' : '#f0f0f0',
//     '--border-color': darkMode ? '1px solid #333' : '1px solid #e0e0e0',
//     '--primary': '#007bff',
//     '--symbol-bg': darkMode ? '#007bff' : '#e6f0ff',
//     '--symbol-color': darkMode ? '#fff' : '#007bff',
//     '--positive': '#28a745',
//     '--negative': '#dc3545',
//     '--stat-bg': darkMode ? '#2a2a3a' : '#f8f9fa',
//     '--strategy-bg': darkMode ? '#1d2733' : '#e6f0ff'
//   };

//   // Apply CSS variables to the document
//   useEffect(() => {
//     const root = document.documentElement;
//     Object.entries(cssVariables).forEach(([key, value]) => {
//       root.style.setProperty(key, value);
//     });
//   }, [darkMode, cssVariables]);

//   // Toggle card expansion
//   const toggleCard = (symbol) => {
//     setExpandedCards(prev => ({
//       ...prev,
//       [symbol]: !prev[symbol]
//     }));
//   };

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

//   // Load stocks from Firestore
//   useEffect(() => {
//     const stocksRef = collection(db, 'stocks');
//     const unsubscribe = onSnapshot(
//       stocksRef,
//       (snapshot) => {
//         const loadedStocks = [];
//         snapshot.forEach((doc) => {
//           loadedStocks.push({ id: doc.id, ...doc.data() });
//         });
//         setStocks(loadedStocks);
        
//         // Initialize expanded state for new stocks
//         const initialExpanded = {};
//         loadedStocks.forEach(stock => {
//           if (expandedCards[stock.symbol] === undefined) {
//             initialExpanded[stock.symbol] = false;
//           }
//         });
//         setExpandedCards(prev => ({ ...prev, ...initialExpanded }));
//       },
//       (error) => {
//         console.error('Error loading stocks:', error);
//         alert('Failed to load stocks. Please refresh the page.');
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Load predictions from Firestore
//   useEffect(() => {
//     const predictionsRef = collection(db, 'predictions');
//     const unsubscribe = onSnapshot(
//       predictionsRef,
//       (snapshot) => {
//         const loadedPredictions = {};
//         snapshot.forEach((doc) => {
//           loadedPredictions[doc.id] = doc.data();
//         });
//         setPredictions(loadedPredictions);
//       },
//       (error) => {
//         console.error('Error loading predictions:', error);
//         alert('Failed to load predictions. Please refresh the page.');
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Add stock to Firestore
//   const handleAddStock = async (stock) => {
//     if (!stocks.find((s) => s.symbol === stock.symbol)) {
//       try {
//         await setDoc(doc(db, 'stocks', stock.symbol), {
//           ...stock,
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp()
//         });
//       } catch (error) {
//         console.error('Error adding stock:', error);
//         alert('Failed to add stock. Please try again.');
//       }
//     }
//   };

//   // Remove stock from Firestore
//   const handleRemoveStock = async (symbol) => {
//     try {
//       // Remove stock
//       await deleteDoc(doc(db, 'stocks', symbol));
//       // Remove corresponding prediction
//       await deleteDoc(doc(db, 'predictions', symbol));
//     } catch (error) {
//       console.error('Error removing stock:', error);
//       alert('Failed to remove stock. Please try again.');
//     }
//   };

//   // Save prediction to Firestore
//   const handlePredict = async (symbol) => {
//     setLoading((prev) => ({ ...prev, [symbol]: true }));
//     try {
//       const response = await axios.post('http://localhost:5000/api/predict', { symbol });
//       await setDoc(doc(db, 'predictions', symbol), {
//         ...response.data,
//         predictedAt: serverTimestamp(),
//         symbol: symbol
//       });
//     } catch (error) {
//       console.error('Prediction Error:', error);
//       alert(`Failed to get prediction for ${symbol}. Please try again.`);
//     } finally {
//       setLoading((prev) => ({ ...prev, [symbol]: false }));
//     }
//   };

//   const getBuySellStrategy = (forecast, dateLabels) => {
//     const marketDayForecasts = forecast.filter(
//       (_, index) => index < dateLabels.length && dateLabels[index].isMarketDay
//     );

//     if (marketDayForecasts.length === 0) return null;

//     const min = Math.min(...marketDayForecasts);
//     const max = Math.max(...marketDayForecasts);

//     const buyDayIndex = forecast.indexOf(min);
//     const sellDayIndex = forecast.indexOf(max);

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

//   const getPerformance = (currentPrice, forecast, dateLabels) => {
//     if (!forecast || forecast.length === 0) return null;

//     const lastMarketDayIndex = dateLabels.findIndex((label) => label.isMarketDay);
//     const lastForecast = forecast[lastMarketDayIndex];

//     if (typeof lastForecast === 'undefined') return null;

//     const change = ((lastForecast - currentPrice) / currentPrice) * 100;
//     return change.toFixed(2);
//   };

//   return (
//     <div className="portfolio-container">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="portfolio-header"
//       >
//         <h2 className="portfolio-title">
//           <FaChartBar style={{ marginRight: '0.75rem', color: '#007bff' }} />
//           Stock Portfolio Tracker
//         </h2>
//       </motion.div>

//       <SearchBar onAdd={handleAddStock} darkMode={darkMode} />

//       {stocks.length === 0 ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="portfolio-empty"
//         >
//           <FaInfoCircle
//             style={{
//               fontSize: '3rem',
//               color: darkMode ? '#555' : '#ccc',
//               marginBottom: '1rem'
//             }}
//           />
//           <p>
//             Your portfolio is empty. Search for stocks to add above.
//           </p>
//         </motion.div>
//       ) : (
//         <div style={{ marginTop: '1rem' }}>
//           {stocks.map((stock) => {
//             const prediction = predictions[stock.symbol];
//             const isLoading = loading[stock.symbol];
//             const isExpanded = expandedCards[stock.symbol];

//             const chartData = prediction
//               ? (() => {
//                   const dateLabels = generateMarketDateLabels(
//                     prediction.forecast.length
//                   );
//                   return [
//                     ...(isMarketDay(new Date())
//                       ? [
//                           {
//                             ...dateLabels[0],
//                             price: prediction.current_price
//                           }
//                         ]
//                       : []),
//                     ...prediction.forecast.map((p, i) => ({
//                       ...dateLabels[i],
//                       price: p
//                     }))
//                   ].filter((item) => item.isMarketDay);
//                 })()
//               : [];

//             const performance = prediction
//               ? getPerformance(
//                   prediction.current_price,
//                   prediction.forecast,
//                   generateMarketDateLabels(prediction.forecast.length)
//                 )
//               : null;

//             return (
//               <motion.div
//                 key={stock.symbol}
//                 className="stock-card"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 layout
//               >
//                 <div
//                   className="stock-summary"
//                   style={{
//                     backgroundColor: isExpanded ? 'var(--hover-bg)' : 'transparent'
//                   }}
//                   onClick={() => toggleCard(stock.symbol)}
//                 >
//                   <div className="stock-info">
//                     <div className="stock-symbol-icon">
//                       {stock.symbol.substring(0, 3)}
//                     </div>
//                     <div>
//                       <h3 className="stock-name">{stock.name}</h3>
//                       <p className="stock-symbol">{stock.symbol}</p>
//                     </div>
//                   </div>

//                   <div className="stock-actions">
//                     {prediction && (
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                         <span className="stock-price">
//                           ₹{prediction.current_price.toFixed(2)}
//                         </span>
//                         {performance && (
//                           <span className={`stock-change ${parseFloat(performance) > 0 ? 'positive' : 'negative'}`}>
//                             {parseFloat(performance) > 0 ? (
//                               <FaArrowUp style={{ marginRight: '0.25rem' }} />
//                             ) : (
//                               <FaArrowDown style={{ marginRight: '0.25rem' }} />
//                             )}
//                             {Math.abs(parseFloat(performance))}%
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handlePredict(stock.symbol);
//                         }}
//                         disabled={isLoading}
//                         className="stock-button"
//                         style={{ opacity: isLoading ? 0.7 : 1 }}
//                       >
//                         <FaChartLine />
//                         {isLoading ? '...' : 'Predict'}
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRemoveStock(stock.symbol);
//                         }}
//                         className="stock-button remove"
//                       >
//                         <FaTimes />
//                       </button>
//                       {isExpanded ? (
//                         <FaChevronUp
//                           style={{
//                             color: 'var(--secondary-text)',
//                             marginLeft: '0.5rem'
//                           }}
//                         />
//                       ) : (
//                         <FaChevronDown
//                           style={{
//                             color: 'var(--secondary-text)',
//                             marginLeft: '0.5rem'
//                           }}
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {isExpanded && prediction && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.3 }}
//                     style={{ overflow: 'hidden' }}
//                   >
//                     <div className="stock-details">
//                       <div className="stats-grid">
//                         <div className="stat-card">
//                           <p className="stat-label">
//                             <FaChartLine style={{ marginRight: '0.5rem' }} />
//                             Moving Average (20)
//                           </p>
//                           <p className="stat-value">
//                             ₹{prediction.moving_average.toFixed(2)}
//                           </p>
//                         </div>

//                         <div className="stat-card">
//                           <p className="stat-label">
//                             <FaPercentage style={{ marginRight: '0.5rem' }} />
//                             RSI (14)
//                           </p>
//                           <p
//                             className="stat-value"
//                             style={{
//                               color:
//                                 prediction.rsi > 70
//                                   ? 'var(--negative)'
//                                   : prediction.rsi < 30
//                                   ? 'var(--positive)'
//                                   : 'inherit'
//                             }}
//                           >
//                             {prediction.rsi.toFixed(2)}
//                           </p>
//                         </div>

//                         <div className="stat-card">
//                           <p className="stat-label">
//                             <FaDollarSign style={{ marginRight: '0.5rem' }} />
//                             Today's Range
//                           </p>
//                           <p className="stat-value">
//                             ₹{prediction.today_low?.toFixed(2) || 'N/A'} - ₹
//                             {prediction.today_high?.toFixed(2) || 'N/A'}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="chart-container">
//                         <ResponsiveContainer>
//                           <LineChart
//                             data={chartData}
//                             margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
//                           >
//                             <CartesianGrid
//                               strokeDasharray="3 3"
//                               stroke={darkMode ? '#444' : '#eee'}
//                             />
//                             <XAxis
//                               dataKey="date"
//                               tick={{
//                                 fill: 'var(--secondary-text)',
//                                 fontSize: '0.75rem'
//                               }}
//                               tickFormatter={(value, index) => {
//                                 if (
//                                   index === 0 ||
//                                   index === chartData.length - 1 ||
//                                   index % 2 === 0
//                                 ) {
//                                   return `${value}\n${chartData[index].day}`;
//                                 }
//                                 return value;
//                               }}
//                             />
//                             <YAxis
//                               tick={{
//                                 fill: 'var(--secondary-text)',
//                                 fontSize: '0.75rem'
//                               }}
//                             />
//                             <Tooltip
//                               contentStyle={{
//                                 background: 'var(--card-bg)',
//                                 borderColor: darkMode ? '#444' : '#ddd',
//                                 borderRadius: '8px',
//                                 boxShadow: darkMode
//                                   ? '0 2px 8px rgba(0,0,0,0.3)'
//                                   : '0 2px 8px rgba(0,0,0,0.1)'
//                               }}
//                               itemStyle={{
//                                 color: 'var(--text-color)'
//                               }}
//                               labelStyle={{
//                                 color: 'var(--text-color)',
//                                 fontWeight: 'bold'
//                               }}
//                             />
//                             <Legend />
//                             <Line
//                               type="monotone"
//                               dataKey="price"
//                               stroke="#007bff"
//                               strokeWidth={2}
//                               activeDot={{ r: 6 }}
//                               name="Price (₹)"
//                             />
//                           </LineChart>
//                         </ResponsiveContainer>
//                       </div>

//                       <div className="stats-grid">
//                         <div className="strategy-card">
//                           <h4 className="strategy-title">
//                             <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
//                             Suggested Trade Plan
//                           </h4>
//                           {(() => {
//                             const dateLabels = generateMarketDateLabels(
//                               prediction.forecast.length
//                             );
//                             const strategy = getBuySellStrategy(
//                               prediction.forecast,
//                               dateLabels
//                             );

//                             if (!strategy || !strategy.isValid) {
//                               return (
//                                 <p>
//                                   No valid trade strategy could be determined
//                                   (market closed on predicted days)
//                                 </p>
//                               );
//                             }

//                             return (
//                               <div style={{ lineHeight: '1.6' }}>
//                                 <p style={{ margin: '0.5rem 0' }}>
//                                   <strong>Buy on {strategy.buy.date}</strong> (
//                                   {strategy.buy.day}) @{' '}
//                                   <strong>
//                                     ₹{strategy.buy.price.toFixed(2)}
//                                   </strong>
//                                 </p>
//                                 <p style={{ margin: '0.5rem 0' }}>
//                                   <strong>Sell on {strategy.sell.date}</strong> (
//                                   {strategy.sell.day}) @{' '}
//                                   <strong>
//                                     ₹{strategy.sell.price.toFixed(2)}
//                                   </strong>
//                                 </p>
//                                 <p
//                                   style={{
//                                     margin: '0.5rem 0',
//                                     paddingTop: '0.5rem',
//                                     borderTop: darkMode
//                                       ? '1px solid #2a3a4a'
//                                       : '1px solid #cce0ff'
//                                   }}
//                                 >
//                                   <strong>Expected Profit:</strong>{' '}
//                                   <span
//                                     style={{
//                                       color: 'var(--positive)',
//                                       fontWeight: 'bold'
//                                     }}
//                                   >
//                                     ₹{strategy.profit}
//                                   </span>{' '}
//                                   (
//                                   {(
//                                     ((strategy.sell.price - strategy.buy.price) /
//                                       strategy.buy.price) *
//                                     100
//                                   ).toFixed(2)}
//                                   %)
//                                 </p>
//                               </div>
//                             );
//                           })()}
//                         </div>

//                         <div className="performance-card">
//                           <h4 className="performance-title">
//                             <FaInfoCircle
//                               style={{
//                                 marginRight: '0.5rem',
//                                 color: 'var(--positive)'
//                               }}
//                             />
//                             Performance Overview
//                           </h4>
//                           {(() => {
//                             const dateLabels = generateMarketDateLabels(
//                               prediction.forecast.length
//                             );
//                             const change = getPerformance(
//                               prediction.current_price,
//                               prediction.forecast,
//                               dateLabels
//                             );

//                             if (change === null) {
//                               return (
//                                 <p>
//                                   Performance data not available (market closed)
//                                 </p>
//                               );
//                             }

//                             const isPositive = parseFloat(change) > 0;
//                             const lastMarketDay = dateLabels.findLast(
//                               (label) => label.isMarketDay
//                             );
//                             const lastDate =
//                               lastMarketDay?.fullDate ||
//                               `Day ${prediction.forecast.length}`;

//                             return (
//                               <div style={{ lineHeight: '1.6' }}>
//                                 <p className={`performance-change ${isPositive ? 'positive' : 'negative'}`}>
//                                   {isPositive ? (
//                                     <FaArrowUp
//                                       style={{
//                                         marginRight: '0.5rem',
//                                         verticalAlign: 'middle'
//                                       }}
//                                     />
//                                   ) : (
//                                     <FaArrowDown
//                                       style={{
//                                         marginRight: '0.5rem',
//                                         verticalAlign: 'middle'
//                                       }}
//                                     />
//                                   )}
//                                   {Math.abs(parseFloat(change))}%{' '}
//                                   {isPositive ? 'increase' : 'decrease'} from
//                                   current price to {lastDate}
//                                 </p>

//                                 <div className="performance-stats">
//                                   <div>
//                                     <p className="performance-stat-label">
//                                       Open Price
//                                     </p>
//                                     <p className="performance-stat-value">
//                                       ₹{prediction.open_price?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>

//                                   <div>
//                                     <p className="performance-stat-label">
//                                       Previous Close
//                                     </p>
//                                     <p className="performance-stat-value">
//                                       ₹{prediction.previous_close?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>

//                                   <div>
//                                     <p className="performance-stat-label">
//                                       52W Low
//                                     </p>
//                                     <p className="performance-stat-value">
//                                       ₹{prediction.week52_low?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>

//                                   <div>
//                                     <p className="performance-stat-label">
//                                       52W High
//                                     </p>
//                                     <p className="performance-stat-value">
//                                       ₹{prediction.week52_high?.toFixed(2) ||
//                                         'N/A'}
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>
//                             );
//                           })()}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Portfolio;






import React, { useState, useEffect } from 'react';
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
import SearchBar from './SearchBar';
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
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import './Portfolio.css';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Portfolio = ({ darkMode }) => {
  const [stocks, setStocks] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState({});
  const [expandedCards, setExpandedCards] = useState({});

  // CSS variables based on dark mode
  const cssVariables = {
    '--background': darkMode ? '#121212' : '#f4f4f4',
    '--text-color': darkMode ? '#ffffff' : '#1e1e2f',
    '--secondary-text': darkMode ? '#aaa' : '#666',
    '--card-bg': darkMode ? '#1f1f2e' : '#ffffff',
    '--card-shadow': darkMode ? '0 2px 8px rgba(255,255,255,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
    '--hover-bg': darkMode ? '#2a2a3a' : '#f0f0f0',
    '--border-color': darkMode ? '1px solid #333' : '1px solid #e0e0e0',
    '--primary': '#007bff',
    '--symbol-bg': darkMode ? '#007bff' : '#e6f0ff',
    '--symbol-color': darkMode ? '#fff' : '#007bff',
    '--positive': '#28a745',
    '--negative': '#dc3545',
    '--stat-bg': darkMode ? '#2a2a3a' : '#f8f9fa',
    '--strategy-bg': darkMode ? '#1d2733' : '#e6f0ff'
  };

  // Apply CSS variables to the document
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [darkMode, cssVariables]);

  // Toggle card expansion
  const toggleCard = (symbol) => {
    setExpandedCards(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

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

  // Load stocks from Firestore
  useEffect(() => {
    const stocksRef = collection(db, 'stocks');
    const unsubscribe = onSnapshot(
      stocksRef,
      (snapshot) => {
        const loadedStocks = [];
        snapshot.forEach((doc) => {
          loadedStocks.push({ id: doc.id, ...doc.data() });
        });
        setStocks(loadedStocks);
        
        // Initialize expanded state for new stocks
        const initialExpanded = {};
        loadedStocks.forEach(stock => {
          if (expandedCards[stock.symbol] === undefined) {
            initialExpanded[stock.symbol] = false;
          }
        });
        setExpandedCards(prev => ({ ...prev, ...initialExpanded }));
      },
      (error) => {
        console.error('Error loading stocks:', error);
        alert('Failed to load stocks. Please refresh the page.');
      }
    );

    return () => unsubscribe();
  }, []);

  // Load predictions from Firestore
  useEffect(() => {
    const predictionsRef = collection(db, 'predictions');
    const unsubscribe = onSnapshot(
      predictionsRef,
      (snapshot) => {
        const loadedPredictions = {};
        snapshot.forEach((doc) => {
          loadedPredictions[doc.id] = doc.data();
        });
        setPredictions(loadedPredictions);
      },
      (error) => {
        console.error('Error loading predictions:', error);
        alert('Failed to load predictions. Please refresh the page.');
      }
    );

    return () => unsubscribe();
  }, []);

  // Add stock to Firestore
  const handleAddStock = async (stock) => {
    if (!stocks.find((s) => s.symbol === stock.symbol)) {
      try {
        await setDoc(doc(db, 'stocks', stock.symbol), {
          ...stock,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error adding stock:', error);
        alert('Failed to add stock. Please try again.');
      }
    }
  };

  // Remove stock from Firestore
  const handleRemoveStock = async (symbol) => {
    try {
      // Remove stock
      await deleteDoc(doc(db, 'stocks', symbol));
      // Remove corresponding prediction
      await deleteDoc(doc(db, 'predictions', symbol));
    } catch (error) {
      console.error('Error removing stock:', error);
      alert('Failed to remove stock. Please try again.');
    }
  };

  // Save prediction to Firestore
  const handlePredict = async (symbol) => {
    setLoading((prev) => ({ ...prev, [symbol]: true }));
    try {
      // const response = await axios.post('http://localhost:5000/api/predict', { symbol });
      const response = await axios.post('https://backend-qb53.onrender.com/api/predict', { symbol });
      await setDoc(doc(db, 'predictions', symbol), {
        ...response.data,
        predictedAt: serverTimestamp(),
        symbol: symbol
      });
    } catch (error) {
      console.error('Prediction Error:', error);
      alert(`Failed to get prediction for ${symbol}. Please try again.`);
    } finally {
      setLoading((prev) => ({ ...prev, [symbol]: false }));
    }
  };

  const getBuySellStrategy = (forecast, dateLabels) => {
    if (!forecast || !dateLabels || forecast.length === 0 || dateLabels.length === 0) {
      return null;
    }

    const marketDayForecasts = forecast.filter(
      (_, index) => index < dateLabels.length && dateLabels[index]?.isMarketDay
    );

    if (marketDayForecasts.length === 0) return null;

    const min = Math.min(...marketDayForecasts);
    const max = Math.max(...marketDayForecasts);

    const buyDayIndex = forecast.indexOf(min);
    const sellDayIndex = forecast.indexOf(max);

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

  const getPerformance = (currentPrice, forecast, dateLabels) => {
    if (!currentPrice || !forecast || !dateLabels || forecast.length === 0 || dateLabels.length === 0) {
      return null;
    }

    const lastMarketDayIndex = dateLabels.findIndex((label) => label?.isMarketDay);
    if (lastMarketDayIndex === -1) return null;

    const lastForecast = forecast[lastMarketDayIndex];
    if (typeof lastForecast === 'undefined') return null;

    const change = ((lastForecast - currentPrice) / currentPrice) * 100;
    return change.toFixed(2);
  };

  return (
    <div className="portfolio-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="portfolio-header"
      >
        <h2 className="portfolio-title">
          <FaChartBar style={{ marginRight: '0.75rem', color: '#007bff' }} />
          Stock Portfolio Tracker
        </h2>
      </motion.div>

      <SearchBar onAdd={handleAddStock} darkMode={darkMode} />

      {stocks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="portfolio-empty"
        >
          <FaInfoCircle
            style={{
              fontSize: '3rem',
              color: darkMode ? '#555' : '#ccc',
              marginBottom: '1rem'
            }}
          />
          <p>
            Your portfolio is empty. Search for stocks to add above.
          </p>
        </motion.div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          {stocks.map((stock) => {
            const prediction = predictions[stock.symbol];
            const isLoading = loading[stock.symbol];
            const isExpanded = expandedCards[stock.symbol];

            const chartData = prediction?.forecast
              ? (() => {
                  const dateLabels = generateMarketDateLabels(
                    prediction.forecast?.length || 0
                  );
                  return [
                    ...(isMarketDay(new Date())
                      ? [
                          {
                            ...dateLabels[0],
                            price: prediction.current_price
                          }
                        ]
                      : []),
                    ...(prediction.forecast?.map((p, i) => ({
                      ...dateLabels[i],
                      price: p
                    })) || [])
                  ].filter((item) => item?.isMarketDay);
                })()
              : [];

            const performance = prediction
              ? getPerformance(
                  prediction.current_price,
                  prediction.forecast,
                  generateMarketDateLabels(prediction.forecast?.length || 0)
                )
              : null;

            return (
              <motion.div
                key={stock.symbol}
                className="stock-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div
                  className="stock-summary"
                  style={{
                    backgroundColor: isExpanded ? 'var(--hover-bg)' : 'transparent'
                  }}
                  onClick={() => toggleCard(stock.symbol)}
                >
                  <div className="stock-info">
                    <div className="stock-symbol-icon">
                      {stock.symbol.substring(0, 3)}
                    </div>
                    <div>
                      <h3 className="stock-name">{stock.name}</h3>
                      <p className="stock-symbol">{stock.symbol}</p>
                    </div>
                  </div>

                  <div className="stock-actions">
                    {prediction && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="stock-price">
                          ₹{prediction.current_price?.toFixed(2) || 'N/A'}
                        </span>
                        {performance && (
                          <span className={`stock-change ${parseFloat(performance) > 0 ? 'positive' : 'negative'}`}>
                            {parseFloat(performance) > 0 ? (
                              <FaArrowUp style={{ marginRight: '0.25rem' }} />
                            ) : (
                              <FaArrowDown style={{ marginRight: '0.25rem' }} />
                            )}
                            {Math.abs(parseFloat(performance))}%
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePredict(stock.symbol);
                        }}
                        disabled={isLoading}
                        className="stock-button"
                        style={{ opacity: isLoading ? 0.7 : 1 }}
                      >
                        <FaChartLine />
                        {isLoading ? '...' : 'Predict'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveStock(stock.symbol);
                        }}
                        className="stock-button remove"
                      >
                        <FaTimes />
                      </button>
                      {isExpanded ? (
                        <FaChevronUp
                          style={{
                            color: 'var(--secondary-text)',
                            marginLeft: '0.5rem'
                          }}
                        />
                      ) : (
                        <FaChevronDown
                          style={{
                            color: 'var(--secondary-text)',
                            marginLeft: '0.5rem'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && prediction && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="stock-details">
                      <div className="stats-grid">
                        <div className="stat-card">
                          <p className="stat-label">
                            <FaChartLine style={{ marginRight: '0.5rem' }} />
                            Moving Average (20)
                          </p>
                          <p className="stat-value">
                            ₹{prediction.moving_average?.toFixed(2) || 'N/A'}
                          </p>
                        </div>

                        <div className="stat-card">
                          <p className="stat-label">
                            <FaPercentage style={{ marginRight: '0.5rem' }} />
                            RSI (14)
                          </p>
                          <p
                            className="stat-value"
                            style={{
                              color:
                                prediction.rsi > 70
                                  ? 'var(--negative)'
                                  : prediction.rsi < 30
                                  ? 'var(--positive)'
                                  : 'inherit'
                            }}
                          >
                            {prediction.rsi?.toFixed(2) || 'N/A'}
                          </p>
                        </div>

                        <div className="stat-card">
                          <p className="stat-label">
                            <FaDollarSign style={{ marginRight: '0.5rem' }} />
                            Today's Range
                          </p>
                          <p className="stat-value">
                            ₹{prediction.today_low?.toFixed(2) || 'N/A'} - ₹
                            {prediction.today_high?.toFixed(2) || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {prediction.forecast && (
                        <div className="chart-container">
                          <ResponsiveContainer>
                            <LineChart
                              data={chartData}
                              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={darkMode ? '#444' : '#eee'}
                              />
                              <XAxis
                                dataKey="date"
                                tick={{
                                  fill: 'var(--secondary-text)',
                                  fontSize: '0.75rem'
                                }}
                                tickFormatter={(value, index) => {
                                  if (
                                    index === 0 ||
                                    index === chartData.length - 1 ||
                                    index % 2 === 0
                                  ) {
                                    return `${value}\n${chartData[index]?.day || ''}`;
                                  }
                                  return value;
                                }}
                              />
                              <YAxis
                                tick={{
                                  fill: 'var(--secondary-text)',
                                  fontSize: '0.75rem'
                                }}
                              />
                              <Tooltip
                                contentStyle={{
                                  background: 'var(--card-bg)',
                                  borderColor: darkMode ? '#444' : '#ddd',
                                  borderRadius: '8px',
                                  boxShadow: darkMode
                                    ? '0 2px 8px rgba(0,0,0,0.3)'
                                    : '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                                itemStyle={{
                                  color: 'var(--text-color)'
                                }}
                                labelStyle={{
                                  color: 'var(--text-color)',
                                  fontWeight: 'bold'
                                }}
                              />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#007bff"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                                name="Price (₹)"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      <div className="stats-grid">
                        <div className="strategy-card">
                          <h4 className="strategy-title">
                            <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                            Suggested Trade Plan
                          </h4>
                          {(() => {
                            if (!prediction.forecast) {
                              return <p>No forecast data available</p>;
                            }

                            const dateLabels = generateMarketDateLabels(
                              prediction.forecast.length
                            );
                            const strategy = getBuySellStrategy(
                              prediction.forecast,
                              dateLabels
                            );

                            if (!strategy || !strategy.isValid) {
                              return (
                                <p>
                                  No valid trade strategy could be determined
                                  (market closed on predicted days)
                                </p>
                              );
                            }

                            return (
                              <div style={{ lineHeight: '1.6' }}>
                                <p style={{ margin: '0.5rem 0' }}>
                                  <strong>Buy on {strategy.buy.date}</strong> (
                                  {strategy.buy.day}) @{' '}
                                  <strong>
                                    ₹{strategy.buy.price.toFixed(2)}
                                  </strong>
                                </p>
                                <p style={{ margin: '0.5rem 0' }}>
                                  <strong>Sell on {strategy.sell.date}</strong> (
                                  {strategy.sell.day}) @{' '}
                                  <strong>
                                    ₹{strategy.sell.price.toFixed(2)}
                                  </strong>
                                </p>
                                <p
                                  style={{
                                    margin: '0.5rem 0',
                                    paddingTop: '0.5rem',
                                    borderTop: darkMode
                                      ? '1px solid #2a3a4a'
                                      : '1px solid #cce0ff'
                                  }}
                                >
                                  <strong>Expected Profit:</strong>{' '}
                                  <span
                                    style={{
                                      color: 'var(--positive)',
                                      fontWeight: 'bold'
                                    }}
                                  >
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
                            );
                          })()}
                        </div>

                        <div className="performance-card">
                          <h4 className="performance-title">
                            <FaInfoCircle
                              style={{
                                marginRight: '0.5rem',
                                color: 'var(--positive)'
                              }}
                            />
                            Performance Overview
                          </h4>
                          {(() => {
                            if (!prediction.forecast) {
                              return <p>No performance data available</p>;
                            }

                            const dateLabels = generateMarketDateLabels(
                              prediction.forecast.length
                            );
                            const change = getPerformance(
                              prediction.current_price,
                              prediction.forecast,
                              dateLabels
                            );

                            if (change === null) {
                              return (
                                <p>
                                  Performance data not available (market closed)
                                </p>
                              );
                            }

                            const isPositive = parseFloat(change) > 0;
                            const lastMarketDay = dateLabels.findLast(
                              (label) => label?.isMarketDay
                            );
                            const lastDate =
                              lastMarketDay?.fullDate ||
                              `Day ${prediction.forecast.length}`;

                            return (
                              <div style={{ lineHeight: '1.6' }}>
                                <p className={`performance-change ${isPositive ? 'positive' : 'negative'}`}>
                                  {isPositive ? (
                                    <FaArrowUp
                                      style={{
                                        marginRight: '0.5rem',
                                        verticalAlign: 'middle'
                                      }}
                                    />
                                  ) : (
                                    <FaArrowDown
                                      style={{
                                        marginRight: '0.5rem',
                                        verticalAlign: 'middle'
                                      }}
                                    />
                                  )}
                                  {Math.abs(parseFloat(change))}%{' '}
                                  {isPositive ? 'increase' : 'decrease'} from
                                  current price to {lastDate}
                                </p>

                                <div className="performance-stats">
                                  <div>
                                    <p className="performance-stat-label">
                                      Open Price
                                    </p>
                                    <p className="performance-stat-value">
                                      ₹{prediction.open_price?.toFixed(2) ||
                                        'N/A'}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="performance-stat-label">
                                      Previous Close
                                    </p>
                                    <p className="performance-stat-value">
                                      ₹{prediction.previous_close?.toFixed(2) ||
                                        'N/A'}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="performance-stat-label">
                                      52W Low
                                    </p>
                                    <p className="performance-stat-value">
                                      ₹{prediction.week52_low?.toFixed(2) ||
                                        'N/A'}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="performance-stat-label">
                                      52W High
                                    </p>
                                    <p className="performance-stat-value">
                                      ₹{prediction.week52_high?.toFixed(2) ||
                                        'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Portfolio;