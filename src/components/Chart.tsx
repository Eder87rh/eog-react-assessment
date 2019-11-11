import * as React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import { getMultipleMeasurements } from '../apollo/queries';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

export interface ChartProps {
  metricsSelected: object
}

const Chart: React.SFC<ChartProps> = (props: ChartProps) => {
  const [ selectedMetrics, setSelectedMetrics ] = React.useState<Array<string>>([])
  const [ inputArray, setInputArray ] = React.useState<Array<string>>([])
  const [ chartData, setChartData ] = React.useState<Array<any>>([])

  React.useEffect(() => {
    let selectedValues:Array<string> = [];
    Object.keys(props.metricsSelected).map(k=> {
      if(props.metricsSelected[k as keyof typeof props.metricsSelected]===true) {
        selectedValues.push(k);
      }
    });

    setSelectedMetrics(selectedValues);

    console.log("USEEFFECT: rops.metricsSelected", props.metricsSelected)
   
  }, [props.metricsSelected])

  React.useEffect(() => {
    console.log("TCL: useEffect ->selectedMetrics", selectedMetrics)
    const inputArray:Array<any> = [];
    selectedMetrics.map(metric => {
      inputArray.push({
        metricName: metric,
        after: moment().subtract(30, 'minutes').unix(),
        before: moment().unix()
      })
    })
    setInputArray(inputArray);
  }, [selectedMetrics])
  

  let data:Array<any> = []
  //let chartData:Array<any> = []

  

  const { 
    data: measurementData, 
    loading: measurementLoading, 
    error: measurementError 
  } = useQuery(getMultipleMeasurements, {
    variables: {
      input: inputArray
    }
  });

  React.useEffect(() => {
    console.log("USEEFFECT ->inputArray", inputArray)

    if(measurementData) {
      measurementData.getMultipleMeasurements.map((el: any) => {
        el.measurements.map((el2: any) => { 
          el2.at = moment(el2.at).format('MMMM Do YYYY, h:mm:ss a')
          el2.yaxis = el2.at.slice(-11)
          el2[el2.metric]= el2.value
          data.push(el2)
        });  
      })
      //chartData = data
      setChartData(data);
      console.log("TCL: data", chartData)

    }


  }, [measurementData])

  if (measurementLoading) return <p>Loading...</p>;
  if (measurementError) return <p>Error :(</p>;

 


  return (
    <div>
      <LineChart width={900} height={500} data={chartData} margin={{ top: 50, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="injValveOpen" stroke="#8884d8" />
        <Line type="monotone" dataKey="oilTemp" stroke="#8884d8" />
        <Line type="monotone" dataKey="tubingPressure" stroke="#8884d8" />
        <Line type="monotone" dataKey="flareTemp" stroke="#8884d8" />
        <Line type="monotone" dataKey="casingPressure" stroke="#8884d8" />
        <Line type="monotone" dataKey="waterTemp" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="yaxis" />
        <YAxis dataKey="value"/>
        <Legend/>
        <Tooltip/>
      </LineChart>
    </div>
  );
}
 
export default Chart;