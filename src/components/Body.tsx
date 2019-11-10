import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { minHeight } from '@material-ui/system';
import Chart from './Chart';

export interface BodyProps {
  
}

const useStyles = makeStyles({
  root: {
    margin: '5% 25%',
    backgroundColor: "white",
    padding: "20px",
    minHeight: "600px",
  },
});
 
const Body: React.SFC<BodyProps> = () => {
  const classes = useStyles();
  return (
  <div className={classes.root}>
    <Typography variant="h5">
      Real time dashboard by Eder Ramírez
    </Typography>
    <Chart/>
  </div>
  );
}
 
export default Body;