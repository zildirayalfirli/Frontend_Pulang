import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { get } from '../../services/ApiEndpoint';

const AgeCountsChart = ({ startDate, endDate }) => {
  const [ageCounts, setAgeCounts] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAgeCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await get('/vhp/getAgeCounts', params);
      if (response.data.success) {
        setAgeCounts(response.data.ageCounts);
        setTotalRecords(response.data.totalRecords);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching age counts:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAgeCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const data = Object.keys(ageCounts).map(age => ({
    age,
    count: ageCounts[age],
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
          <div className='flex justify-center items-center mb-8 text-heading-3'>
            Age
          </div>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age">
                <Label value="Umur" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }}>
                  Jumlah
                </Label>
              </YAxis>
              <Tooltip />
              <Bar dataKey="count" fill="#FF6384" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default AgeCountsChart;
