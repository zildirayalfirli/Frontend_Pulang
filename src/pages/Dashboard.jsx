import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AgeCountsChart from '../components/AgeCountsChart';
import SexCountsChart from '../components/SexCountsChart';
import OccupationCountsChart from '../components/OccupationCountsChart';
import SegmentCountsChart from '../components/SegmentCountsChart';
import CountryCount from '../components/country/CountryCount';
import CityCount from '../components/city/CityCount';
import RoomCountsChart from '../components/RoomCountsChart';
import SegmentCountsBar from '../components/SegmentCountsBar';
import NightGuestCount from '../components/NightGuestCount';
import RepeaterGuestCount from '../components/RepeaterGuestCount';
import CompanyRecord from '../components/CompanyRepeater';

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>
      </div>
      <div className="flex justify-center items-center mb-6">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="border rounded p-2"
        />
        <span className="mx-2">to</span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
          className="border rounded p-2"
        />
      </div>
      <div className='flex flex-col justify-center items-center gap-8'>
        <div className='flex flex-col justify-center gap-8 w-full'>
          <AgeCountsChart startDate={startDate} endDate={endDate} />
          <RoomCountsChart startDate={startDate} endDate={endDate} />
          <SegmentCountsBar startDate={startDate} endDate={endDate} />
          <NightGuestCount startDate={startDate} endDate={endDate} />
          <RepeaterGuestCount startDate={startDate} endDate={endDate} />
          <CompanyRecord startDate={startDate} endDate={endDate} />
          <div className='flex justify-center gap-8 w-full'>
            <div className='w-1/4'>
              <SexCountsChart startDate={startDate} endDate={endDate} />
            </div>
            <div className='w-2/4'>
              <SegmentCountsChart startDate={startDate} endDate={endDate} />
            </div>
          </div>
        </div>
        <div className='flex justify-center gap-8 flex-wrap w-full h-fit'>
          <OccupationCountsChart startDate={startDate} endDate={endDate} />
        </div>
        <div className='flex justify-center gap-8 flex-wrap w-full h-fit'>
          <CityCount startDate={startDate} endDate={endDate} />
        </div>
        <div className='flex justify-center gap-8 flex-wrap w-full h-fit'>
          <CountryCount startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
