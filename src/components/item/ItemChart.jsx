import React, { useEffect, useState } from 'react';
import { get } from '../../services/ApiEndpoint';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CustomTreemapContent = ({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: colors[index % colors.length],
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 20 && height > 20 ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          style={{
            fontSize: Math.min(width, height) / 20,
            fontWeight: 'bold',
          }}
        >
          {name}
        </text>
      ) : null}
    </g>
  );
};

const ItemChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItem = async () => {
    try {
      const params = {};
      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        params.startdate = startDate.toISOString().split('T')[0];
        params.enddate = adjustedEndDate.toISOString().split('T')[0];
      }

      const response = await get('/request', params );
      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      const filteredData = dataArray.filter(record => {
        const executionTime = new Date(record.executionTime);
        const isWithinDateRange = (!startDate || (executionTime && executionTime >= new Date(startDate))) &&
                                  (!endDate || (executionTime && executionTime <= new Date(endDate)));
        return isWithinDateRange;
      });

      const itemCounts = filteredData.reduce((acc, data) => {
        acc[data.item] = (acc[data.item] || 0) + 1;
        return acc;
      }, {});
      
      const transformedData = Object.keys(itemCounts).map(item => ({
        name: item,
        size: itemCounts[item],
      }));

      setData(transformedData);
      setTotalRecords(filteredData.length);
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('Error fetching item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchItem();
  }, [startDate, endDate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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
            Item Requested
          </div>
          <ResponsiveContainer width="100%" height={600}>
            <Treemap
              data={data}
              dataKey="size"
              nameKey="name"
              ratio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
              content={<CustomTreemapContent colors={['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']} />}
            >
              <Tooltip />
            </Treemap>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default ItemChart;
