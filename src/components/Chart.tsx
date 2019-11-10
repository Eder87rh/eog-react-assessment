import * as React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useQuery } from '@apollo/react-hooks';
import { getMetrics } from '../apollo/queries';
const data = [
  {name: 'Page A', uv: 400, pv: 2400, amt: 2400},
  {name: 'Page A', uv: 500, pv: 2400, amt: 2400},
  {name: 'Page A', uv: 600, pv: 2400, amt: 2400},
  {name: 'Page A', uv: 200, pv: 2400, amt: 2400},
  {name: 'Page A', uv: 600, pv: 2400, amt: 2400},
  {name: 'Page A', uv: 100, pv: 2400, amt: 2400},
  {name: 'Page A', uv: 600, pv: 2400, amt: 2400},
];

export interface ChartProps {
  
}
 
const Chart: React.SFC<ChartProps> = () => {
  const { data: metricsData, loading: metricsLoading, error: metricsError } = useQuery(getMetrics);

  if (metricsLoading) return <p>Loading...</p>;
  if (metricsError) return <p>Error :(</p>;

  return (
    <div>
      <LineChart width={900} height={500} data={data} margin={{ top: 50, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </div>
  );
}
 
export default Chart;