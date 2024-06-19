import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { nationalityCoordinates } from './DataCountry';

const NationalityCountsMap = ({ startDate, endDate }) => {
  const [nationalityCounts, setNationalityCounts] = useState({});
  const [error, setError] = useState(null);

  const fetchNationalityCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      console.log("Fetching data with params:", params);

      const response = await axios.get('http://localhost:3000/vhp/getCountryCounts', { params });
      if (response.data.success) {
        console.log("Fetched data:", response.data.nationalityCounts);
        setNationalityCounts(response.data.nationalityCounts);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching nationality counts:', error);
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchNationalityCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <MapContainer center={[20, 20]} zoom={2.5} scrollWheelZoom={false} style={{ height: '1000px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {Object.entries(nationalityCounts).map(([nationality, { count, totalNight }]) => {
        const coordinates = nationalityCoordinates[nationality] || [0, 0];
        return (
          <CircleMarker
            key={nationality}
            center={coordinates}
            radius={Math.sqrt(count) * 2}
            color="blue"
            fillColor="blue"
            fillOpacity={0.5}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <span>{`${nationality}: ${count} records, ${totalNight} nights`}</span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default NationalityCountsMap;
