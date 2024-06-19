import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SexCountsChart = ({ startDate, endDate }) => {
  const [sexCounts, setSexCounts] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState(null);

  const fetchSexCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await axios.get('http://localhost:3000/vhp/getSexCounts', { params });
      if (response.data.success) {
        setSexCounts(response.data.sexCounts);
        setTotalRecords(response.data.totalRecords);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching sex counts:', error);
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchSexCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const data = {
    labels: Object.keys(sexCounts),
    datasets: [
      {
        label: 'Sex Counts',
        data: Object.values(sexCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full flex flex-col">
      <div className="text-heading-6 mb-4">Total Records: {totalRecords}</div>
      <div className='flex justify-center items-center mb-4 text-heading-5'>
        Gender
      </div>
      <Pie data={data} />
    </div>
  );
};

export default SexCountsChart;
