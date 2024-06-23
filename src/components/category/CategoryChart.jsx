import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { get } from '../../services/ApiEndpoint';

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6347', '#4B0082', 
  '#3CB371', '#FF1493', '#00FF7F', '#00BFFF', '#8B4513', '#FFA500', '#4B5320', '#40E0D0', 
  '#D2691E', '#DC143C', '#FFD700', '#FF4500'
];

const CategoryChart = ({ startDate, endDate }) => {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNight, setTotalNight] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategoryCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await get('/vhp/getVisitorCategoryCounts', params);
      console.log(response.data);
      if (response.data.success) {
        setCategoryCounts(response.data.guestCategoryCounts || {});
        setTotalRecords(response.data.totalRecords || 0);
        setTotalNight(response.data.totalNight || 0);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching category counts:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCategoryCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const data = Object.keys(categoryCounts).map((key, index) => ({
    name: key,
    value: categoryCounts[key].count,
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
          <div className='flex gap-8 mb-8'>
            <div className="text-heading-6">Total Records: {totalRecords}</div>
            <div className="text-heading-6">Total Nights: {totalNight}</div>
          </div>
          <div className='flex justify-center items-center mb-4 text-heading-3'>
            Category
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

export default CategoryChart;
