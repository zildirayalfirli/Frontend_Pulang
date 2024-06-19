import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AgeCountsChart = ({ startDate, endDate }) => {
  const [ageCounts, setAgeCounts] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState(null);

  const fetchAgeCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await axios.get('http://localhost:3000/vhp/getAgeCounts', { params });
      if (response.data.success) {
        setAgeCounts(response.data.ageCounts);
        setTotalRecords(response.data.totalRecords);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching age counts:', error);
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchAgeCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const data = {
    labels: Object.keys(ageCounts),
    datasets: [
      {
        label: 'Age Counts',
        data: Object.values(ageCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
            const age = context.label;
            const count = ageCounts[age];
            return `${age}: ${count} records`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full flex flex-col">
      <div className="text-heading-6 mb-4">Total Records: {totalRecords}</div>
      <div className='flex justify-center items-center mb-8 text-heading-3'>
        Age
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AgeCountsChart;
