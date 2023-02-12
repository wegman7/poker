import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  test: {
    position: 'absolute',
    left: '50%',
    top: '50%'
  },
}));

const DealerChip = (props) => {
    if (props.player.dealer) {
        return (
            <div style={{ position: 'absolute', left: '110%' }} className="pokerchip flat dealer">Dealer</div>
        );
    } else {
      return null;
    }
}

const RedChips = (props) => {
  var chips = []
  var position = 0;
  for (let i = 0; i < props.redChipsTotal; i++) {
      chips.push(<div key={i} style={{ position: 'absolute', top: position.toString() + 'vw', left: '0vw' }} className="pokerchip iso red" ></div>)
      position -= .55;
  }
  return (
      <div style={{ position: 'absolute'}} >
          {chips.map(thing => thing)}
      </div>
  )
}

const BlueChips = (props) => {
  var chips = []
  var position = 0;
  for (let i = 0; i < props.blueChipsTotal; i++) {
      chips.push(<div key={i} style={{ position: 'absolute', top: position.toString() + 'vw', left: '2.5vw' }} className="pokerchip iso blue" ></div>)
      position -= .55;
  }
  return (
      <div style={{ position: 'absolute'}} >
          {chips.map(thing => thing)}
      </div>
  )
}

const BlackChips = (props) => {
  var chips = []
  var position = 0;
  for (let i = 0; i < props.blackChipsTotal; i++) {
      chips.push(<div key={i} style={{ position: 'absolute', top: position.toString() + 'vw', left: '5vw' }} className="pokerchip iso" ></div>)
      position -= .55;
  }
  return (
      <div style={{ position: 'absolute'}} >
          {chips.map(thing => thing)}
      </div>
  )
}

const Chips = (props) => {
  const classes = useStyles();

  if (props.player === undefined) {
    return null;
  }

  var chipsInPot = props.player.chips_in_pot;
  var chipsInPotDisplay = chipsInPot;
  if (chipsInPotDisplay === 0) { 
    chipsInPotDisplay = null;
  }

  // convert chipsInPot to actual chips
  var redChipsTotal = parseInt(chipsInPot / 5);
  chipsInPot = chipsInPot % 5;
  var blueChipsTotal = parseInt(chipsInPot / 1);
  chipsInPot = chipsInPot % 1;
  var blackChipsTotal = parseInt(chipsInPot / .25);
  console.log(redChipsTotal, blueChipsTotal, blackChipsTotal);

  return (
    <div className={`${props.chipStyle} ${props.baseStyle}`}>
      {props.player.chips_in_pot === 0 ? null : <div style={{ position: 'absolute', top: '100%' }}>{props.player.chips_in_pot}</div>}
      
      <DealerChip player={props.player} />
      <RedChips redChipsTotal={redChipsTotal} />
      <BlueChips blueChipsTotal={blueChipsTotal} />
      <BlackChips blackChipsTotal={blackChipsTotal} />
    </div>
  );
}

export default Chips;