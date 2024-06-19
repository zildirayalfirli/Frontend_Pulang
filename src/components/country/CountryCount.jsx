import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NationalityCountsMap from './NationalityCountsMap';

const CountryCount = ({ startDate, endDate }) => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNight, setTotalNight] = useState(0);
  const [error, setError] = useState(null);

  const fetchSegmentCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await axios.get('http://localhost:3000/vhp/getCountryCounts', { params });
      if (response.data.success) {
        setTotalRecords(response.data.totalRecords);
        setTotalNight(response.data.totalNight);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching segment counts:', error);
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchSegmentCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full flex flex-col">
      <div className="text-heading-6 mb-4">Total Records: {totalRecords}</div>
      <div className="text-heading-6 mb-4">Total Nights: {totalNight}</div>
      <div className='flex justify-center items-center mb-8 text-heading-3'>
        Country
      </div>
      <NationalityCountsMap startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default CountryCount;
