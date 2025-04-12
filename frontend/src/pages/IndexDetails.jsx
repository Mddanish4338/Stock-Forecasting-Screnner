// src/pages/IndexDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function IndexDetails() {
  const { symbol } = useParams();
  const [details, setDetails] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/index-details?symbol=${symbol}`)
      .then(res => {
        setDetails(res.data.details);
        setChartData({
          labels: res.data.history.dates,
          datasets: [{
            label: 'Close Price',
            data: res.data.history.prices,
            borderColor: '#4f46e5',
            fill: false
          }]
        });
      })
      .catch(err => console.error(err));
  }, [symbol]);

  if (!details || !chartData) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">{details.name} ({symbol})</h1>
      <p className="text-lg mb-2">Price: ₹{details.price}</p>
      <p className="mb-4">Change: {details.change} ({details.percent}%)</p>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Performance</h2>
        <p>Open: ₹{details.open}</p>
        <p>High: ₹{details.high}</p>
        <p>Low: ₹{details.low}</p>
        <p>Previous Close: ₹{details.prevClose}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Candlestick/Chart</h2>
        <Line data={chartData} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Top 100 Companies in {details.name}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {details.companies.map((comp, i) => (
            <li key={i} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow">
              {comp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
