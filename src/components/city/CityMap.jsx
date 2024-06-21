import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { cityCoordinates } from './DataCity';

const CityMap = ({ startDate, endDate }) => {
  const [cityCounts, setCityCounts] = useState({});
  const [error, setError] = useState(null);

  const fetchCityCounts = async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await axios.get('http://localhost:3000/vhp/getCityCounts', { params });
      if (response.data.success) {
        setCityCounts(response.data.localregionCounts);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching city counts:', error);
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchCityCounts(startDate, endDate);
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <MapContainer center={[-2.548926, 125.0148634]} zoom={5} scrollWheelZoom={false} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {Object.entries(cityCounts).map(([city, { count, totalNight }]) => {
        const coordinates = cityCoordinates[city];
        if (!coordinates) return null;
        return (
          <CircleMarker
            key={city}
            center={coordinates}
            radius={Math.sqrt(count) * 2}
            color="blue"
            fillColor="blue"
            fillOpacity={0.5}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <span>{`${city}: ${count} records, ${totalNight} nights`}</span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default CityMap;
