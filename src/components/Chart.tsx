import * as React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import { getMultipleMeasurements } from '../apollo/queries';
import { newMeasurement } from '../apollo/subscriptions';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import moment from 'moment';

export interface ChartProps {
  metricsSelected: object
}

const Chart: React.SFC<ChartProps> = (props: ChartProps) => {
  const [ selectedMetrics, setSelectedMetrics ] = React.useState<Array<string>>([])
  const [ inputArray, setInputArray ] = React.useState<Array<string>>([])
  const [ chartData, setChartData ] = React.useState<Array<any>>([])
  const before = moment().unix();
  const after = moment().subtract(30, 'minutes').unix();


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
        after,
        before
      })
    })
    setInputArray(inputArray);
  }, [selectedMetrics])
  


  const { 
    data: measurementData, 
    loading: measurementLoading, 
    error: measurementError 
  } = useQuery(getMultipleMeasurements, {
    variables: {
      input: inputArray
    }
  });

  const { data: newData } = useSubscription(newMeasurement)

  if(newData) {
    console.log("TCL: newData", newData)

    const currentTime = localStorage.getItem("currentTimestamp");
    localStorage.setItem("currentTimestamp", newData.newMeasurement.at)
    console.log("TCL: currentTime", currentTime)
    let currentData = newData.newMeasurement;

    if(currentData.at.toString() === currentTime) {
      console.log("No");
      
      let newElement = localStorage.getItem("newElement")

      if(newElement) {
        newElement = JSON.parse(newElement)
        
        var newVal = {
          // @ts-ignore
          ...newElement,
          ...currentData,
        };
        
        newVal.at = moment(currentData.at).format('MMMM Do YYYY, h:mm:ss a');
        newVal.yaxis = newVal.at.slice(-11);
        newVal[currentData.metric] = currentData.value;
      
        localStorage.setItem("newElement", JSON.stringify(newVal));
      } else {
        var newVal = currentData;
        
        newVal.at = moment(currentData.at).format('MMMM Do YYYY, h:mm:ss a');
        newVal.yaxis = newVal.at.slice(-11);
        newVal[currentData.metric] = currentData.value;
      
        localStorage.setItem("newElement", JSON.stringify(newVal));
      }

    } else {
      console.log("Yes")

      let newElement = localStorage.getItem("newElement")
      if(newElement && chartData.length > 0) {
        newElement = JSON.parse(newElement)
        console.log("TCL: chartData", chartData)
        console.log("TCL: newElement", newElement)

        let finalElement = [
          ...chartData,
          newElement
        ]/* .shift() */;
        console.log("TCL: finalElement", finalElement)
        finalElement.shift();
        console.log("TCL: finalElement", finalElement)

        localStorage.removeItem("newElement");
  
        var newVal = {
          // @ts-ignore
          ...newElement,
          ...currentData,
        };
  
        newVal.at = moment(currentData.at).format('MMMM Do YYYY, h:mm:ss a');
        newVal.yaxis = newVal.at.slice(-11);
        newVal[currentData.metric] = currentData.value;
        
        localStorage.setItem("newElement", JSON.stringify(newVal));
  
        setChartData(finalElement);
      }

    }
  }

  React.useEffect(() => {
    console.log("USEEFFECT ->inputArray", inputArray)
    let data:Array<any> = []
    if(measurementData && measurementData.getMultipleMeasurements.length > 0) {
      const arrayLength = measurementData.getMultipleMeasurements[0].measurements.length;
      measurementData.getMultipleMeasurements.map((el: any, index: number) => {

        el.measurements.map((el2: any, index2:number) => { 
          el2.at = moment(el2.at).format('MMMM Do YYYY, h:mm:ss a')
          el2.yaxis = el2.at.slice(-11)
          el2[el2.metric]= el2.value
          
          if (index > 0) {
            data[index2] = { 
              ...data[index2],
              ...el2
            }
          } else {
            data.push(el2)
          }

        });  
      })
      setChartData(data);
      console.log("TCL: data", chartData)

    }


  }, [measurementData])

  if (measurementLoading) return <p>Loading...</p>;
  if (measurementError) return <p>Error :(</p>;

 
  return (
    <div>
      <LineChart width={900} height={800} data={chartData} margin={{ top: 50, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="injValveOpen" stroke="#8884d8" />
        <Line type="monotone" dataKey="oilTemp" stroke="#82ca9d" />
        <Line type="monotone" dataKey="tubingPressure" stroke="#133972" />
        <Line type="monotone" dataKey="flareTemp" stroke="#bf3555" />
        <Line type="monotone" dataKey="casingPressure" stroke="#e8df35" />
        <Line type="monotone" dataKey="waterTemp" stroke="#5eef2d" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="yaxis" />
        <YAxis />
        <Legend/>
        <Tooltip/>
      </LineChart>
    </div>
  );
}
 
export default Chart;