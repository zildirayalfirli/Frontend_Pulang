import React, { useEffect, useState } from 'react';
import { get } from '../../services/ApiEndpoint';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
];

const SexCountsChart = ({ startDate, endDate }) => {
  const [sexCounts, setSexCounts] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSexCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await get('/vhp/getSexCounts', params );
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
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSexCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const data = Object.keys(sexCounts).map((key, index) => ({
    name: key,
    value: sexCounts[key],
    color: COLORS[index % COLORS.length],
  }));

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
          <div className="text-heading-6 mb-8">Total Records: {totalRecords}</div>
          <div className='flex justify-center items-center mb-4 text-heading-3'>
            Gender
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default SexCountsChart;
