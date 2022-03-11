import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  base: {
    position: 'absolute',
    width: '25%',
    height: '30%',
    left: '0%',
    bottom: '0%',
    backgroundColor: 'purple'
  },
  sitIn: {
    position: 'absolute',
    width: '33.3%',
    height: '33.3%',
    left: '0%',
    top: '33.3%',
    fontSize: '1.3vw',
    padding: 0,
    minWidth: '20px'
  },
  sitOut: {
    position: 'absolute',
    width: '33.3%',
    height: '33.3%',
    left: '0%',
    top: '33.3%',
    fontSize: '1.3vw',
    padding: 0,
    minWidth: '20px'
  },
  addOn: {
    position: 'absolute',
    width: '33.3%',
    height: '33.3%',
    left: '0%',
    top: '0%',
    fontSize: '1.3vw',
    padding: 0,
    minWidth: '20px'
  },
  standUp: {
    position: 'absolute',
    width: '33.3%',
    height: '33.3%',
    left: '0%',
    bottom: '0%',
    fontSize: '1.3vw',
    padding: 0,
    minWidth: '20px'
  },
}));

// NEED TO MAKE THESE BUTTONS WORK!!!!!!

const SitIn = (props) => {
  return (
    <Button className={props.sitInStyle} variant="contained" color="primary" onClick={() => props.makeSitAction('sit_in', props.player.username)}>
      Sit in
    </Button>
  );
}

const SitOut = (props) => {
  return (
    <Button className={props.sitOutStyle} variant="contained" color="primary" onClick={() => props.makeSitAction('sit_out', props.player.username)}>
      Sit out
    </Button>
  );
}

// need to add a popup box to enter addon amount
const AddOn = (props) => {
  return (
    <Button className={props.addOnStyle} variant="contained" color="primary">
      Add chips
    </Button>
  );
}

const StandUp = (props) => {
  return (
    <Button className={props.standUpStyle} variant="contained" color="primary" onClick={() => props.makeSitAction('stand_up', props.player.username)}>
      Stand up
    </Button>
  );
}

const ActionBar = (props) => {
  const classes = useStyles();

  if (props.player === undefined) {
    return null;
  }

  return (
    <div className={classes.base}>
      {
        props.player.sitting_out ?
        <SitIn sitInStyle={classes.sitIn} makeSitAction={props.makeSitAction} player={props.player} />
        :
        <SitOut sitOutStyle={classes.sitOut} makeSitAction={props.makeSitAction} player={props.player} />
      }
      <AddOn addOnStyle={classes.addOn} addChips={props.addChips} player={props.player} />
      <StandUp standUpStyle={classes.standUp} makeSitAction={props.makeSitAction} player={props.player} />
    </div>
  );
}

export default ActionBar;