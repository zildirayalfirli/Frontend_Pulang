import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PurposeChart = ({ startDate, endDate }) => {
  const [purposeCounts, setPurposeCounts] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNight, setTotalNight] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPurposeCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await axios.get('http://localhost:3000/vhp/getGuestPurposeCounts', { params });
      if (response.data.success) {
        setPurposeCounts(response.data.guestPurposeCounts || {});
        setTotalRecords(response.data.totalRecords || 0);
        setTotalNight(response.data.totalNight || 0);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching purpose counts:', error);
      setError('Error fetching data');
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPurposeCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const data = {
    labels: Object.keys(purposeCounts),
    datasets: [
      {
        label: 'Purpose Counts',
        data: Object.keys(purposeCounts).map(key => purposeCounts[key].count),
        backgroundColor: [
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
        ],
        borderColor: [
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
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const purpose = context.label;
            const purposeData = purposeCounts[purpose];
            return `${purpose}: ${purposeData.count} records, ${purposeData.totalNight} nights`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full flex flex-col border-2 border-black">
      {loading ? (
        <>
          <Skeleton height={30} width={150} />
          <Skeleton height={40} width={100} className="mb-4" />
          <Skeleton height={300} />
        </>
      ) : (
        <>
      <div className='flex gap-8 mb-10'>
        <div className="text-heading-6">Total Records: {totalRecords}</div>
        <div className="text-heading-6">Total Nights: {totalNight}</div>
      </div>
        
      <div className='flex justify-center items-center mb-8 text-heading-5'>
        Purpose
      </div>
      <Pie data={data} options={options}/>
      </>
      )}
    </div>
  );
};

export default PurposeChart;
