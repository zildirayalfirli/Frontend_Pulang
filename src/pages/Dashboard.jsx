import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import AgeCountsChart from '../components/age/AgeCountsChart';
import SexCountsChart from '../components/sex/SexCountsChart';
import OccupationCountsChart from '../components/occupation/OccupationCountsChart';
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
import PriorityTable from '../components/priorities/PriorityTable';
import CommentChart from '../components/comment/CommentChart';

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [search, setSearch] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!search) {
      setDateRange({ start: null, end: null });
    }
    setLoading(false);
  }, [search]);

  const handleSearch = () => {
    if (startDate && endDate) {
      setDateRange({ start: startDate, end: endDate });
      setLoading(true);
      setSearch(true);
      setTimeout(() => setLoading(false), 1000);
    } else {
      alert('Please select both start and end dates.');
    }
  };

  const renderContent = (Component, props) => (
    loading ? <Skeleton height={250} /> : <Component {...props} />
  );

  return (
    <div className="container mx-auto p-4 border-2 bg-white rounded-lg border-secondary-300">
      <div className="flex justify-center mb-10">
        <h1 className="text-heading-2">Dashboard</h1>
      </div>
      <div className="flex flex-col w-fit items-center mb-6 mx-auto p-4 border-2 border-black rounded-lg gap-4">
        <div className="flex justify-center">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="border border-black rounded p-2"
          />
          <span className="mx-2 my-auto">-</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
            className="border border-black rounded p-2"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {renderContent(PriorityTable, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(AgeCountsChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(CityCount, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(CountryCount, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(OccupationCountsChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(SegmentCountsBar, { startDate: dateRange.start, endDate: dateRange.end })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderContent(SexCountsChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(CategoryChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(PurposeChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(EscortChart, { startDate: dateRange.start, endDate: dateRange.end })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {renderContent(ItemChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(CommentChart, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(NightGuestCount, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(RepeaterGuestCount, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(CompanyRecord, { startDate: dateRange.start, endDate: dateRange.end })}
          {renderContent(RoomCountsChart, { startDate: dateRange.start, endDate: dateRange.end })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
