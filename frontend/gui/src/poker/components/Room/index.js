import React, { useEffect, useCallback } from 'react';

import { WebSocketPoker } from '../../../utils/websocket';
import Chat from '../Chat/index';

const Room = (props) => {

  const { setGameStates } = props;

  const updateState = useCallback(data => {
    setGameStates({ ...props.gameStates, [props.roomName]: data.state });
  }, [props.roomName, props.gameStates, setGameStates]);

  useEffect(() => {
    if (!props.pokerSockets.hasOwnProperty(props.roomName)) {
      props.pokerSockets[props.roomName] = new WebSocketPoker(props.roomName);
      props.pokerSockets[props.roomName].addCallbacks(updateState);
    }
  }, [props.pokerSockets, props.roomName, updateState]);

  const reserveSeat = useCallback((username, seatId) => {
    props.pokerSockets[props.roomName].reserveSeat(username, seatId);
  }, [props.pokerSockets, props.roomName]);

  const sitPlayer = useCallback((username, seatId, chips, avatar) => {
    props.pokerSockets[props.roomName].sitPlayer(username, seatId, chips, avatar);
  }, [props.pokerSockets, props.roomName]);

  const makeAction = useCallback((action, username, chips, chipsInPot) => {
      props.pokerSockets[props.roomName].makeAction(action, username, chips, chipsInPot);
  }, [props.pokerSockets, props.roomName]);

  const addChips = useCallback((action, username, chips) => {
      props.pokerSockets[props.roomName].addChips(action, username, chips);
  }, [props.pokerSockets, props.roomName]);

  const makeSitAction = useCallback((action, username) => {
      props.pokerSockets[props.roomName].makeSitAction(action, username);
  }, [props.pokerSockets, props.roomName]);
  
  return (
    <>
      room {props.roomName}
      {/* <Chat /> */}
    </>
  );
}

export default Room;
