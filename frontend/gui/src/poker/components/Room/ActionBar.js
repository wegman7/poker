import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  base: {
    position: 'absolute',
    width: '25%',
    height: '30%',
    right: '0%',
    bottom: '0%',
    // backgroundColor: 'purple'
  },
  min: {
    position: 'absolute',
    width: '33.3%',
    height: '25%',
    left: '0%',
    top: '0%',
    fontSize: '1.3vw',
    padding: 0,
    minWidth: '20px'
  },
  pot: {
    position: 'absolute',
    width: '33.3%',
    height: '25%',
    left: '33.3%',
    top: '0%',
    fontSize: '1.3vw',
    padding: 0,
    minWidth: '20px'
  },
  max: {
    position: 'absolute',
    width: '33.3%',
    height: '25%',
    right: '0%',
    top: '0%',
    fontSize: '1.3vw',
    padding: 0,
    minWidth: '20px'
  },
  value: {
    position: 'absolute',
    width: '60%',
    height: '43%',
    left: '20%',
    top: '30%',
  },
  decrement: {
    position: 'absolute',
    width: '15%',
    height: '15%',
    left: '0%',
    top: '56%',
    fontSize: '1.3vw',
    minWidth: '0px',
    padding: 0
  },
  slider: {
    position: 'absolute',
    backgroundColor: 'orange',
    width: '70%',
    // height: '25%',
    left: '15%',
    top: '63%',
    padding: 0,
    minWidth: '5px',
  },
  increment: {
    position: 'absolute',
    width: '15%',
    height: '15%',
    right: '0%',
    top: '56%',
    fontSize: '1.3vw',
    minWidth: '0px',
    padding: 0
  },
  fold: {
    position: 'absolute',
    width: '33.3%',
    height: '25%',
    left: '0%',
    bottom: '0%',
    fontSize: '1.3vw',
    minWidth: '20px',
    padding: 0
  },
  call: {
    position: 'absolute',
    width: '33.3%',
    height: '25%',
    left: '33.3%',
    bottom: '0%',
    fontSize: '1.3vw',
    minWidth: '20px',
    padding: 0
  },
  bet: {
    position: 'absolute',
    width: '33.3%',
    height: '25%',
    right: '0%',
    bottom: '0%',
    fontSize: '1.3vw',
    minWidth: '20px',
    padding: 0
  },
}));

const Fold = (props) => {
  return (
    <Button className={props.foldStyle} variant="contained" color="primary" onClick={() => props.makeAction('fold')}>
      fold
    </Button>
  );
}

const Call = (props) => {
  return (
    <Button className={props.callStyle} variant="contained" color="primary" onClick={() => props.makeAction('call')}>
      call
    </Button>
  );
}

const Bet = (props) => {
  return (
    <Button className={props.betStyle} variant="contained" color="primary" onClick={() => props.makeAction('bet')}>
      bet
    </Button>
  );
}

const Increment = (props) => {
  return (
    <Button className={props.incrementStyle} variant="contained" color="primary">
      +
    </Button>
  );
}

const Decrement = (props) => {
  return (
    <Button className={props.decrementStyle} variant="contained" color="primary">
      -
    </Button>
  );
}

const Min = (props) => {
  return (
    <Button className={props.minStyle} variant="contained" color="primary">
      Min
    </Button>
  );
}

const Pot = (props) => {
  return (
    <Button className={props.potStyle} variant="contained" color="primary">
      Pot
    </Button>
  );
}

const Max = (props) => {
  return (
    <Button className={props.maxStyle} variant="contained" color="primary">
      Max
    </Button>
  );
}

const ActionBar = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(30);

  const handleValueChange = (event, newValue) => {
    setValue(newValue);
  };

  const makeAction = (action) => {
    props.makeAction(action, props.player.username, value, value + props.player.chips_in_pot);
  }

  if (props.player === undefined || !props.player.spotlight) {
    return null;
  }

  return (
    <div className={classes.base}>
      <Min minStyle={classes.min} />
      <Pot potStyle={classes.pot} />
      <Max maxStyle={classes.max} />
      <TextField 
        className={classes.value} 
        inputProps={{ style: { fontSize: '1.9vw', padding: 5, margin: 0 } }} 
        value={value} 
        onChange={handleValueChange}
        variant="outlined" 
        size="small"
      />
      <Decrement decrementStyle={classes.decrement} />
      <Slider
        className={classes.slider}
        value={value}
        onChange={handleValueChange}
        aria-labelledby="discrete-slider"
        step={10}
        min={0}
        max={100}
      />
      <Increment incrementStyle={classes.increment} />
      <Fold foldStyle={classes.fold} makeAction={makeAction} />
      <Call callStyle={classes.call} makeAction={makeAction} />
      <Bet betStyle={classes.bet} makeAction={makeAction} />
    </div>
  );
}

export default ActionBar;