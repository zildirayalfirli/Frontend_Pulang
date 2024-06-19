import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const RoomCountsChart = ({ startDate, endDate }) => {
  const [roomCounts, setRoomCounts] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNight, setTotalNight] = useState(0);
  const [error, setError] = useState(null);

  const fetchRoomCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await axios.get('http://localhost:3000/vhp/getRoomCounts', { params });
      if (response.data.success) {
        setRoomCounts(response.data.roomtypeCounts);
        setTotalRecords(response.data.totalRecords);
        setTotalNight(response.data.totalNight);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching room counts:', error);
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchRoomCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(255, 99, 71, 0.6)',
    'rgba(75, 0, 130, 0.6)',
    'rgba(60, 179, 113, 0.6)',
    'rgba(255, 20, 147, 0.6)',
    'rgba(0, 255, 127, 0.6)',
    'rgba(0, 191, 255, 0.6)',
    'rgba(139, 69, 19, 0.6)',
    'rgba(255, 165, 0, 0.6)',
    'rgba(75, 83, 32, 0.6)',
    'rgba(64, 224, 208, 0.6)',
    'rgba(210, 105, 30, 0.6)',
    'rgba(220, 20, 60, 0.6)',
    'rgba(255, 215, 0, 0.6)',
    'rgba(255, 69, 0, 0.6)',
  ];

  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 71, 1)',
    'rgba(75, 0, 130, 1)',
    'rgba(60, 179, 113, 1)',
    'rgba(255, 20, 147, 1)',
    'rgba(0, 255, 127, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(139, 69, 19, 1)',
    'rgba(255, 165, 0, 1)',
    'rgba(75, 83, 32, 1)',
    'rgba(64, 224, 208, 1)',
    'rgba(210, 105, 30, 1)',
    'rgba(220, 20, 60, 1)',
    'rgba(255, 215, 0, 1)',
    'rgba(255, 69, 0, 1)',
  ];

  const data = {
    labels: Object.keys(roomCounts),
    datasets: [
      {
        label: 'Room Counts',
        data: Object.values(roomCounts).map(room => room.count),
        backgroundColor: colors.slice(0, Object.keys(roomCounts).length),
        borderColor: borderColor.slice(0, Object.keys(roomCounts).length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const roomType = context.label;
            const room = roomCounts[roomType];
            return `${roomType}: ${room.count} records, ${room.totalNight} nights`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full flex flex-col">
      <div className="text-heading-6 mb-4">Total Records: {totalRecords}</div>
      <div className="text-heading-6 mb-4">Total Nights: {totalNight}</div>
      <div className='flex justify-center items-center mb-8 text-heading-3'>
        Room
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RoomCountsChart;
