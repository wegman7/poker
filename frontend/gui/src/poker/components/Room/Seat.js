import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import { createTheme, ThemeProvider, styled } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.text.primary
  },
  paper: {
    padding: 5,
    textAlign: 'center'
  },
}));

// const darkTheme = createTheme({ palette: { mode: 'dark' } });
// WE NEED TO FIGURE OUT HOW TO DO DARK MODE ON MATERIAL UI V4, BUT WE CAN PROBABLY JUST DO THIS LATER. FIRST GET ALL THE BASIC PIECES SET UP

const Seat = (props) => {
  const classes = useStyles();

  const handleReserveSeat = (seatNumber, username) => {
    console.log('reserving seat');
    props.reserveSeat(username, seatNumber);
    props.handleOpenBuyinBox();
  }

  // render click to sit button
  if (props.player === undefined) {
    return (
      <div className={`${props.seatStyle} ${props.baseStyle}`}>
        {props.seatNumber}
        <button onClick={() => {handleReserveSeat(props.seatNumber, props.username)}}>Reserve</button>
      </div>
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

  // render my player
  if (props.player !== undefined && props.player.username === props.username) {
    return (
      <div className={`${props.seatStyle} ${props.baseStyle}`}>
        {/* <ThemeProvider theme={darkTheme}> */}
          <Paper className={classes.paper} elevation={3}>
            {props.player.username} (me)<br/>
            {props.player.chips}
          </Paper>
        {/* </ThemeProvider> */}
      </div>
    );
  }

  // render player
  if (props.player !== undefined && props.player.username !== props.username) {
    return (
      <div className={`${props.seatStyle} ${props.baseStyle}`}>
        <Paper className={classes.paper} elevation={3}>
          {props.player.username}<br/>
          {props.player.chips}
        </Paper>
      </div>
    );
  }
}

export default Seat;