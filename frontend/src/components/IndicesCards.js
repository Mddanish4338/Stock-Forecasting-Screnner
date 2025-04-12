import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IndicesCards = () => {
  const [indices, setIndices] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/indices')
      .then(response => setIndices(response.data))
      .catch(err => console.error("Failed to fetch indices", err));
  }, []);

  const toggleShowAll = () => setShowAll(prev => !prev);

  const displayedIndices = showAll ? indices : indices.slice(0, 4); // show only 4 initially

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ marginBottom: '12px' }}>Market Indices</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {displayedIndices.map((index, i) => (
          <div key={i} style={{
            border: '1px solid #ccc',
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{index.name}</h3>
            <p style={{ margin: 0 }}>Price: ₹{index.price}</p>
            {index.changePercent !== undefined && (
              <p style={{
                color: index.changePercent >= 0 ? 'green' : 'red',
                margin: '4px 0 0'
              }}>
                {index.changePercent >= 0 ? '+' : ''}{index.changePercent}%
              </p>
            )}
          </div>
        ))}

        {/* View All / Collapse Card */}
        <div onClick={toggleShowAll} style={{
          cursor: 'pointer',
          border: '2px dashed #999',
          padding: '12px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
          backgroundColor: '#fff'
        }}>
          {showAll ? 'Collapse ▲' : 'View All ▼'}
        </div>
      </div>
    </div>
  );
};

export default IndicesCards;
