import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  pot: {
    left: '50%',
    top: '50%',
  },
}));

const Pot = (props) => {
  const classes = useStyles();

  return (
    <div className={`${classes.pot} ${props.baseStyle}`}>
      pot: {props.pot}
    </div>
  );
}

export default Pot;