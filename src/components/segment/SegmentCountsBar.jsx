import React, { useEffect, useState } from 'react';
import { get } from '../../services/ApiEndpoint';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SegmentCountsBar = ({ startDate, endDate }) => {
  const [segmentCounts, setSegmentCounts] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNight, setTotalNight] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSegmentCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      console.log("Fetching data with params:", params);

      const response = await get('/vhp/getSegmentCounts', params );
      if (response.data.success) {
        console.log("Fetched data:", response.data.segmentCounts);
        const segmentData = response.data.segmentCounts || {};
        const transformedData = Object.keys(segmentData).map(segment => ({
          segment,
          count: segmentData[segment].count,
          totalNight: segmentData[segment].totalNight
        }));
        setSegmentCounts(transformedData);
        setTotalRecords(response.data.totalRecords);
        setTotalNight(response.data.totalNight);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching segment counts:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSegmentCounts(startDate, endDate);
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
            Segment Counts
          </div>
          <ResponsiveContainer width="100%" height={600}>
            <BarChart
              data={segmentCounts}
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
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

export default SegmentCountsBar;
