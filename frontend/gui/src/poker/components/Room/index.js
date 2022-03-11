import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import Seats from './Seats';
import './index.css';

const useStyles = makeStyles((theme) => ({
  table: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '85%',
    backgroundColor: 'green',
    borderRadius: '50%',
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
}));

const Room = (props) => {
  const { setGameStates } = props;
  const classes = useCallback(useStyles(), []);
  const [loading, setLoading] = useState(true);

  // const updateState = useCallback(data => {
  //   setGameStates({ ...props.gameStates, [props.roomName]: data.state });
  // }, [props.roomName, props.gameStates, setGameStates]);

  useEffect(() => {
    const updateState = (data) => {
      setGameStates({ ...props.gameStates, [props.roomName]: data.state });
    }
    if (props.gameStates.hasOwnProperty(props.roomName)) {
      setLoading(false);
    }
    if (props.pokerSockets[props.roomName].updateState === undefined) {
      props.pokerSockets[props.roomName].addCallbacks(updateState);
    }
  }, [props.pokerSockets, props.roomName, props.gameStates, setGameStates]);

  const reserveSeat = useCallback((username, seatId) => {
    props.pokerSockets[props.roomName].reserveSeat(username, seatId);
  }, [props.pokerSockets, props.roomName]);

  const sitPlayer = useCallback((username, seatId, chips, avatar) => {
    props.pokerSockets[props.roomName].sitPlayer(username, seatId, chips, avatar);
  }, [props.pokerSockets, props.roomName]);

  const makeAction = useCallback((action, username, chips, chipsInPot) => {
    console.log(action, username, chips, chipsInPot);
      props.pokerSockets[props.roomName].makeAction(action, username, chips, chipsInPot);
  }, [props.pokerSockets, props.roomName]);

  const addChips = useCallback((action, username, chips) => {
      props.pokerSockets[props.roomName].addChips(action, username, chips);
  }, [props.pokerSockets, props.roomName]);

  const makeSitAction = useCallback((action, username) => {
      props.pokerSockets[props.roomName].makeSitAction(action, username);
  }, [props.pokerSockets, props.roomName]);

  if (loading) {
    return (
      <CircularProgress className={classes.spinner} />
    );
  }
  
  return (
    <>
      <div className="poker-room-container">
        <div className="poker-room">
          <div className={classes.table} />
          <Seats 
            gameState={props.gameStates[props.roomName]}
            user={props.user}
            sitPlayer={sitPlayer}
            reserveSeat={reserveSeat}
            makeSitAction={makeSitAction}
            makeAction={makeAction}
          />
        </div>
      </div>
    </>
  );
}

export default Room;
