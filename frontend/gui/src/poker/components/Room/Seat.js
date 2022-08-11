import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Card } from 'react-casino';
import zIndex from '@material-ui/core/styles/zIndex';
// import { createTheme, ThemeProvider, styled } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.text.primary
  },
  paper: {
    padding: 5,
    textAlign: 'center',
    // backgroundColor: 'green',
    position: 'relative',
    zIndex: 2,
    height: '100%'
  },
  cardStyle: {
    position: 'absolute', 
    // top: '50%', 
    // overflow: 'hidden',
    // backgroundColor: 'pink',
    zIndex: '1'
  }
}));

// const darkTheme = createTheme({ palette: { mode: 'dark' } });
// WE NEED TO FIGURE OUT HOW TO DO DARK MODE ON MATERIAL UI V4, BUT WE CAN PROBABLY JUST DO THIS LATER. FIRST GET ALL THE BASIC PIECES SET UP

const Cards = (props) => {

  if (props.holeCards.length === 0) {
    return null;
  }

  var rank0 = '';
  var suit0 = '';
  var rank1 = '';
  var suit1 = '';
  if (props.player === props.myPlayer || props.showHands) {
    rank0 = props.holeCards[0].rank;
    suit0 = props.holeCards[0].suit;
    rank1 = props.holeCards[1].rank;
    suit1 = props.holeCards[1].suit;
  }

  return (
    <div>
      <Card suit={suit0} face={rank0} style={{ position: 'absolute', left: '10%', top: '-220%', height: '10vw', width: '7.5vw' }} />
      <Card suit={suit1} face={rank1} style={{ position: 'absolute', left: '50%', top: '-220%', height: '10vw', width: '7.5vw' }} />
    </div>
  );
}

const Seat = (props) => {
  const classes = useStyles();

  const handleReserveSeat = (seatNumber, username) => {
    console.log('reserving seat');
    props.reserveSeat(username, seatNumber);
    props.handleOpenBuyinBox();
  }

  // render click to sit button
  if (props.player === undefined && props.myPlayer === undefined) {
    return (
      <div className={`${props.seatStyle} ${props.baseStyle}`}>
        {props.seatNumber}
        <button onClick={() => {handleReserveSeat(props.seatNumber, props.username)}}>Reserve</button>
      </div>
    );
  // render empty seat
  } else if (props.player === undefined) {
    return (
      null
    );
  }

  // render reserved seat
  if (props.player !== undefined && props.player.reserved) {
    return (
      <div className={`${props.seatStyle} ${props.baseStyle}`}>
        {props.seatNumber}
        Seat reserved
      </div>
    );
  }

  // render player
  return (
    <div className={`${props.seatStyle} ${props.baseStyle}`}>
      <Paper className={classes.paper} elevation={3}>
        {props.player.username}<br/>
        {props.player.chips}
        {
          props.player.sitting_out
          ?
          <div>sitting out</div>
          :
          null
        }
      </Paper>
      <Cards 
        holeCards={props.player.hole_cards} 
        cardStyle={classes.cardStyle} 
        player={props.player}
        myPlayer={props.myPlayer}
        showHands={props.showHands}
      />
    </div>
  );

}

export default Seat;