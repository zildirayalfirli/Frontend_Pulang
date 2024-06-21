import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RoomCountsChart = ({ startDate, endDate }) => {
  const [roomCounts, setRoomCounts] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNight, setTotalNight] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const roomData = response.data.roomtypeCounts || {};
        const transformedData = Object.keys(roomData).map(room => ({
          room,
          count: roomData[room].count,
          totalNight: roomData[room].totalNight
        }));
        setRoomCounts(transformedData);
        setTotalRecords(response.data.totalRecords);
        setTotalNight(response.data.totalNight);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching room counts:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRoomCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full flex flex-col border-2 border-black">
      {loading ? (
        <>
          <Skeleton height={30} width={150} />
          <Skeleton height={30} width={150} />
          <Skeleton height={40} width={100} className="mb-4" />
          <Skeleton height={300} />
        </>
      ) : (
        <>
          <div className="text-heading-6 mb-4">Total Records: {totalRecords}</div>
          <div className="text-heading-6 mb-4">Total Nights: {totalNight}</div>
          <div className='flex justify-center items-center mb-8 text-heading-3'>
            Room Counts
          </div>
          <ResponsiveContainer width="100%" height={600}>
            <BarChart
              data={roomCounts}
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="room" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" stackId="a" fill="#8884d8" />
              <Bar dataKey="totalNight" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default RoomCountsChart;
