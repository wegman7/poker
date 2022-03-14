import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  test: {
    position: 'absolute',
    left: '50%',
    top: '50%'
  },
}));

const Chips = (props) => {
  const classes = useStyles();

  if (props.player === undefined) {
    return null;
  }

  return (
    <div className={`${props.chipStyle} ${props.baseStyle}`}>
      {props.player.chips_in_pot}
    </div>
  );
}

export default Chips;