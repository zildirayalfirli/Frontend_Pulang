import React, { useEffect, useState } from 'react';
import CityMap from './CityMap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { get } from '../../services/ApiEndpoint';

const CityCount = ({ startDate, endDate }) => {
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

      const response = await get('/vhp/getCityCounts', params );
      if (response.data.success) {
        setTotalRecords(response.data.totalRecords);
        setTotalNight(response.data.totalNight);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching segment counts:', error);
      setError('Error fetching data');
    } setLoading(false);
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
            City
          </div>
          <CityMap startDate={startDate} endDate={endDate} />
        </>
      )}
    </div>
  );
};

export default CityCount;
