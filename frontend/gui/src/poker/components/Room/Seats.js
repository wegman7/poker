import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Seat from './Seat';
import ActionBar from './ActionBar';
import SitBar from './SitBar';

const seats = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

const useStyles = makeStyles((theme) => ({
  base: {
    position: 'absolute',
  },
  zero: {
    top: '0%', left: '60%'
  },
  one: {
    top: '0%', left: '85%'
  },
  two: {
    top: '49%', left: '87%'
  },
  three: {
    top: '80%', left: '68%'
  },
  four: {
    top: '88%', left: '44%'
  },
  five: {
    top: '80%', left: '19%'
  },
  six: {
    top: '49%', left: '0%'
  },
  seven: {
    top: '0%', left: '2%'
  },
  eight: {
    top: '0%', left: '30%'
  },
  buyin: {
    width: 225,
    height: 350,
    textAlign: 'center'
  },
  buyinButton: {
    margin: 10
  },
  buyinContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  buyinElement: {
    flexGrow: 1,
  },
}));

const Seats = (props) => {
  const classes = useCallback(useStyles(), []);
  const [sitting, setSitting] = useState(false);
  const [showBuyinBox, setShowBuyinBox] = useState(false);
  const [buyin, setBuyin] = useState('');

  // BUG WHERE IF YOU JOIN ONE GAME, GO TO LOBBY, THEN JOIN ANOTHER GAME GAMESTATE IS UNDEFINED
  if (props.gameState.hasOwnProperty(props.user.username)) {
    setSitting(true);
  }

  const handleOpenBuyinBox = () => {
    setShowBuyinBox(true);
  }

  const handleCloseBuyinBox = () => {
    console.log('inside handleCloseBuyinBox');
    setShowBuyinBox(false);
  }

  const handleBuyinChange = (event) => {
    setBuyin(event.target.value);
  }

  const handleJoinGame = () => {
    props.sitPlayer(props.user.username, props.gameState.players[props.user.username].seat_id, buyin, props.user.avatarUrl);
    handleCloseBuyinBox(false);
  }

  const handleCancelBuyin = () => {
    props.makeSitAction('stand_up', props.user.username);
    setShowBuyinBox(false);
  }

  const players = {};
  for (const player in props.gameState.players) {
    players[props.gameState.players[player].seat_id] = props.gameState.players[player];
  }

  return (
    <>
      {seats.map((seat, index) => (
        <Seat 
          key={index}
          seatNumber={index}
          seatStyle={classes[seat]} 
          baseStyle={classes.base} 
          reserveSeat={props.reserveSeat}
          sitPlayer={props.sitPlayer}
          username={props.user.username}
          handleOpenBuyinBox={handleOpenBuyinBox}
          player={players[index]}
        />
      ))}
      <ActionBar
        player={props.gameState.players[props.user.username]}
        makeAction={props.makeAction}
      />
      <SitBar
        player={props.gameState.players[props.user.username]}
        addChips={props.addChips}
        standUp={props.standup}
        makeSitAction={props.makeSitAction}
      />
      {/* MAYBE WE COULD PUT ACTIONBAR, SITBAR AND PLAYERBAR (MAYBE RENAME?) HERE THE SAME WAY AS SEAT. MAYBE
        ALL COULD BE IN A THEIR OWN FILE. NOT SURE YET BUT THAT MIGHT BE THE CLEANEST WAY. */}
      {/* WE MAY ALSO WANT TO PUT THIS DIALOGUE BOX (BUYIN FORM) IN ANOTHER FILE CAUSE IT'S UGLY! NOT A 
        PRIORITY THOUGH */}
      <Dialog open={showBuyinBox} onClose={handleCancelBuyin}>
        <Paper className={classes.buyin}>
          <Box className={classes.buyinContainer}>
            <Box p={3}>
              <TextField 
                className={classes.buyinElement} 
                onChange={handleBuyinChange}
                id="standard-basic" 
                label="Buyin" 
              />
            </Box>
            <Box className={classes.buyinElement} style={{ flexGrow: 3 }} />
            <Box className={classes.buyinElement} >
              <Button className={classes.buyinButton} onClick={handleJoinGame} variant="contained" color="primary">
                Join
              </Button>
              <Button className={classes.buyinButton} onClick={handleCancelBuyin} variant="contained" color="secondary">
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Dialog>
    </>
  );
}

export default Seats;