import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const OccupationCountsChart = ({ startDate, endDate }) => {
  const [occupationCounts, setOccupationCounts] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNight, setTotalNight] = useState(0);
  const [error, setError] = useState(null);

  const fetchOccupationCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await axios.get('http://localhost:3000/vhp/getOccupationCounts', { params });
      if (response.data.success) {
        setOccupationCounts(response.data.occupationCounts);
        setTotalRecords(response.data.totalRecords);
        setTotalNight(response.data.totalNight);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching occupation counts:', error);
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchOccupationCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Transform data for bubble chart
  const data = Object.keys(occupationCounts).map(occupation => ({
    occupation,
    count: occupationCounts[occupation].count,
    totalNight: occupationCounts[occupation].totalNight,
    radius: Math.sqrt(occupationCounts[occupation].count) * 5 // Adjust size for visibility
  }));

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full flex flex-col">
      <div className="text-heading-6 mb-4">Total Records: {totalRecords}</div>
      <div className="text-heading-6 mb-4">Total Nights: {totalNight}</div>
      <div className='flex justify-center items-center mb-4 text-heading-3'>
        Occupation
      </div>
      <ResponsiveContainer width="100%" height={600}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="count" name="Count" />
          <YAxis type="number" dataKey="totalNight" name="Total Nights" />
          <ZAxis type="number" dataKey="radius" range={[60, 400]} name="Radius" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Occupations" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupationCountsChart;
