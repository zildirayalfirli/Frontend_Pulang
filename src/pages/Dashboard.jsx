import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import AgeCountsChart from '../components/age/AgeCountsChart';
import SexCountsChart from '../components/sex/SexCountsChart';
import OccupationCountsChart from '../components/occupation/OccupationCountsChart';
// import SegmentCountsChart from '../components/segment/SegmentCountsChart';
import CountryCount from '../components/country/CountryCount';
import CityCount from '../components/city/CityCount';
import RoomCountsChart from '../components/room/RoomCountsChart';
import SegmentCountsBar from '../components/segment/SegmentCountsBar';
import NightGuestCount from '../components/night/NightGuestCount';
import RepeaterGuestCount from '../components/repeater/RepeaterGuestCount';
import CompanyRecord from '../components/company/CompanyRepeater';
import CategoryChart from '../components/category/CategoryChart';
import PurposeChart from '../components/purpose/PurposeChart';
import EscortChart from '../components/escort/EscortChart';
import ItemChart from '../components/item/ItemChart';
import RequestChart from '../components/request/RequestChart';

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [search, setSearch] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!search) {
      // Reset date range if search is not triggered
      setDateRange({ start: null, end: null });
    }
    setLoading(false);
  }, [search]);

  const handleSearch = () => {
    if (startDate && endDate) {
      setDateRange({ start: startDate, end: endDate });
      setLoading(true);
      setSearch(true);
      setTimeout(() => setLoading(false), 1000); // Simulate loading delay
    } else {
      alert('Please select both start and end dates.');
    }
  };

  const renderContent = (Component, props) => (
    loading ? <Skeleton height={250} /> : <Component {...props} />
  );

  return (
    <div className="container mx-auto p-8 border-2 rounded-lg border-secondary-300">
      <div className="flex justify-center mb-10">
        <h1 className="text-heading-1">Dashboard</h1>
      </div>
      <div className="flex justify-center items-center mb-6 mx-4 p-4  rounded-lg">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="border border-black rounded p-2"
        />
        <span className="mx-2">-</span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
          className="border border-black rounded p-2"
        />
        <button
          onClick={handleSearch}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      <div className='flex flex-col justify-center items-center gap-8 p-4'>
        <div className='flex flex-col justify-center gap-8 w-full'>
          {renderContent(AgeCountsChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(ItemChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(RequestChart, { startDate: dateRange.start, endDate: dateRange.end })}
        </div>

        <div className='flex justify-center gap-8 w-full'>
            <div className='w-1/2'>
              {renderContent(SexCountsChart, { startDate: dateRange.start, endDate: dateRange.end })}
            </div>
            {/* <div className='w-1/3'>
              {renderContent(SegmentCountsChart, { startDate: dateRange.start, endDate: dateRange.end })}
            </div> */}
            <div className='w-1/2'>
              {renderContent(PurposeChart, { startDate: dateRange.start, endDate: dateRange.end })}
            </div>
          </div>

          <div className='flex justify-center gap-8 w-full'>
            <div className='w-1/2'>
              {renderContent(CategoryChart, { startDate: dateRange.start, endDate: dateRange.end })}
            </div>
            <div className='w-1/2'>
              {renderContent(EscortChart, { startDate: dateRange.start, endDate: dateRange.end })}
            </div>
          </div>

        <div className='flex justify-center gap-8 flex-wrap w-full h-fit'>
          {renderContent(NightGuestCount, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(RepeaterGuestCount, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(CompanyRecord, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(OccupationCountsChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(RoomCountsChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(SegmentCountsBar, { startDate: dateRange.start, endDate: dateRange.end })}
          
        </div>

        <div className='flex justify-center items-center w-full gap-8'>
          <div className='flex justify-center flex-wrap w-1/2 h-fit'>
            {renderContent(CityCount, { startDate: dateRange.start, endDate: dateRange.end })}
          </div>
          <div className='flex justify-center g flex-wrap w-1/2 h-fit'>
            {renderContent(CountryCount, { startDate: dateRange.start, endDate: dateRange.end })}
          </div>
          </div>

      </div>
    </div>
  );
};

export default Dashboard;
