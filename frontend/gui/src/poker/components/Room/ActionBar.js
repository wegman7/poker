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

const Check = (props) => {
  return (
    <Button className={props.callStyle} variant="contained" color="primary" onClick={() => props.makeAction('check')}>
      check
    </Button>
  );
}

const Call = (props) => {
  return (
    <Button className={props.callStyle} variant="contained" color="primary" onClick={() => props.makeAction('call')}>
      call {props.callAmount}
    </Button>
  );
}

const Bet = (props) => {
  var betAmount = props.value;
  betAmount = setMinAndMaxBounds(props.minBet, props.maxBet, betAmount);

  return (
    <Button className={props.betStyle} variant="contained" color="primary" onClick={() => props.makeAction('bet')}>
      {
        props.chipsInPot === 0
        ?
        <div>bet {betAmount}</div>
        :
        <div>raise {betAmount}</div>
      }
    </Button>
  );
}

const Increment = (props) => {
  return (
    <Button className={props.incrementStyle} onClick={props.handleInc} variant="contained" color="primary">
      +
    </Button>
  );
}

const Decrement = (props) => {
  return (
    <Button className={props.decrementStyle} onClick={props.handleDec} variant="contained" color="primary">
      -
    </Button>
  );
}

const Min = (props) => {
  return (
    <Button className={props.minStyle} onClick={props.handleMin} variant="contained" color="primary">
      Min
    </Button>
  );
}

const Pot = (props) => {
  return (
    <Button className={props.potStyle} onClick={props.handlePot} variant="contained" color="primary">
      Pot
    </Button>
  );
}

const Max = (props) => {
  return (
    <Button className={props.maxStyle} onClick={props.handleMax} variant="contained" color="primary">
      Max
    </Button>
  );
}

// set min and max bounds
const setMinAndMaxBounds = (minBet, maxBet, betAmount) => {
  betAmount = Math.max(minBet, betAmount);
  betAmount = Math.min(maxBet, betAmount);
  return betAmount;
}

const ActionBar = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  useEffect(() => {
    handleValueChange(null, minBet);
  }, [props.gameState.current_bet]);

  var minBet;
  if (props.gameState.current_bet !== 0) {
    minBet = Math.min(props.gameState.current_bet * 2, props.player.chips + props.player.chips_in_pot);
  } else {
    minBet = Math.min(props.gameState.big_blind, props.player.chips + props.player.chips_in_pot);
  }
  var maxBet = props.player.chips + props.player.chips_in_pot;
  var noCurrBet = props.player.chips_in_pot === props.gameState.current_bet;

  const makeAction = (action) => {
    var betAmount = value;
    betAmount = setMinAndMaxBounds(minBet, maxBet, betAmount);
    props.makeAction(action, props.player.username, null, betAmount);
  }

  const handleValueChange = (event, newValue) => {
    if (newValue === null) {
      newValue = event.target.value;
    }
    newValue = setMinAndMaxBounds(minBet, maxBet, newValue);
    setValue(newValue);
  }

  const handleTextValueChange = (event) => {
    var newValue = event.target.value;
    if (!isNaN(newValue)) {
      setValue(newValue);
    }
  }

  const handleMax = () => {
    handleValueChange(null, maxBet);
  }

  const handleMin = () => {
    handleValueChange(null, minBet);
  }

  const handleInc = () => {
    handleValueChange(null, parseFloat(value) + props.gameState.big_blind);
  }

  const handleDec = () => {
    handleValueChange(null, parseFloat(value) - props.gameState.big_blind);
  }

  const handlePot = () => {
    var pot;
    if (props.gameState.current_bet !== 0) {
      pot = props.gameState.current_bet * 3 + (props.gameState.pot - props.gameState.current_bet) - props.player.chips_in_pot;
    } else {
      pot = props.gameState.pot;
    }
    handleValueChange(null, pot);
  }

  if (props.player === undefined || !props.player.spotlight) {
    return null;
  }

  return (
    <div className={classes.base}>
      <Min minStyle={classes.min} handleMin={handleMin} />
      <Pot potStyle={classes.pot} handlePot={handlePot} />
      <Max maxStyle={classes.max} handleMax={handleMax} />
      <TextField 
        className={classes.value} 
        inputProps={{ style: { fontSize: '1.9vw', padding: 5, margin: 0 } }} 
        value={value} 
        onChange={handleTextValueChange}
        variant="outlined" 
        size="small"
      />
      <Decrement decrementStyle={classes.decrement} handleDec={handleDec} />
      <Slider
        className={classes.slider}
        value={value}
        onChange={handleValueChange}
        aria-labelledby="discrete-slider"
        step={props.gameState.big_blind}
        min={minBet}
        max={maxBet}
      />
      <Increment incrementStyle={classes.increment} handleInc={handleInc} />
      {noCurrBet ? null : <Fold foldStyle={classes.fold} makeAction={makeAction} />}
      {
        noCurrBet
        ?
        <Check callStyle={classes.call} makeAction={makeAction} />
        :
        <Call callStyle={classes.call} makeAction={makeAction} callAmount={props.gameState.current_bet} />
      }
      <Bet betStyle={classes.bet} makeAction={makeAction} value={value} chipsInPot={props.player.chips_in_pot} minBet={minBet} maxBet={maxBet} />
    </div>
  );
}

export default ActionBar;