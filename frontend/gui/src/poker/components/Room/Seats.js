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
import seatStyles from './seatStyles';
import Chips from './Chips';
import Pot from './Pot';
import CommunityCards from './CommunityCards';

const seats = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
const seatChips = ['chipsZero', 'chipsOne', 'chipsTwo', 'chipsThree', 'chipsFour', 'chipsFive', 'chipsSix', 'chipsSeven', 'chipsEight']

const Seats = (props) => {
  const classes = useCallback(seatStyles(), []);
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
          myPlayer={props.gameState.players[props.user.username]}
        />
      ))}
      {seatChips.map((seat, index) => (
        <Chips
          key={index}
          seatNumber={index}
          chipStyle={classes[seat]} 
          baseStyle={classes.base} 
          player={players[index]}
          myPlayer={props.gameState.players[props.user.username]}
        />
      ))}
      <CommunityCards
        baseStyle={classes.base}
        communityCards={props.gameState.community_cards}
      />
      <Pot 
        baseStyle={classes.base}
        pot={props.gameState.pot}
      />
      {
        props.gameState.players[props.user.username] === undefined || props.gameState.players[props.user.username].spotlight !== true
        ?
        null
        :
        <ActionBar
          player={props.gameState.players[props.user.username]}
          makeAction={props.makeAction}
          gameState={props.gameState}
        />
      }
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