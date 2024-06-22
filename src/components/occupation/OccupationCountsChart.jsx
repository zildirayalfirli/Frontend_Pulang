import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const OccupationCountsChart = ({ startDate, endDate }) => {
  const [occupationCounts, setOccupationCounts] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNight, setTotalNight] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOccupationCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await axios.get('http://192.168.1.141:3000/vhp/getOccupationCounts', { params });
      if (response.data.success) {
        setOccupationCounts(response.data.data || []);
        const totalRecords = response.data.data.reduce((acc, item) => acc + item.count, 0);
        const totalNight = response.data.data.reduce((acc, item) => acc + item.totalNight, 0);
        setTotalRecords(totalRecords);
        setTotalNight(totalNight);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching occupation counts:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOccupationCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Transform data for bar chart
  const data = occupationCounts.map(item => ({
    occupation: item.occupation,
    count: item.count,
    totalNight: item.totalNight
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
          <div className="text-heading-6 mb-4">Total Records: {totalRecords}</div>
          <div className="text-heading-6 mb-4">Total Nights: {totalNight}</div>
          <div className='flex justify-center items-center mb-4 text-heading-3'>
            Occupation Counts
          </div>
          <ResponsiveContainer width="100%" height={600}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="occupation" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
              <Bar dataKey="totalNight" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default OccupationCountsChart;
