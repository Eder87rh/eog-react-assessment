import * as React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { getMultipleMeasurements } from '../apollo/queries';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

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
  metricsSelected: object
}

const Chart: React.SFC<ChartProps> = (props: ChartProps) => {
  const [ selectedMetrics, setSelectedMetrics ] = React.useState<Array<string>>([])

  React.useEffect(() => {
    let selectedValues:Array<string> = [];
    Object.keys(props.metricsSelected).map(k=> {
      if(props.metricsSelected[k as keyof typeof props.metricsSelected]===true) {
        selectedValues.push(k);
      }
    });

    setSelectedMetrics(selectedValues);
  }, [props.metricsSelected])

  console.log("TCL: selectedValues", selectedMetrics)

  const { 
    data: measurementData, 
    loading: measurementLoading, 
    error: measurementError 
  } = useQuery(getMultipleMeasurements, {
    variables: {
      input: [
        {
          metricName: "oilTemp",
          after: moment().subtract(30, 'minutes').unix(),
          before: moment().unix()
        }
      ]
    }
  });

  if (measurementLoading) return <p>Loading...</p>;
  if (measurementError) return <p>Error :(</p>;

  


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