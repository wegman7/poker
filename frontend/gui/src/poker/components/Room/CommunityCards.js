import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from 'react-casino';

const useStyles = makeStyles((theme) => ({
  cards: {
    position: 'absolute',
    // fontSize: '1.3vw',
    // width: '18%',
    // height: '12%',
    left: '31%',
    top: '25%',
  },
}));

const CommunityCards = (props) => {
  const classes = useStyles();

  if (props.communityCards.length === 0) {
    return null;
  }

  return (
    <div className={classes.cards}>
      {props.communityCards.map((card) => (
        <Card suit={card.suit} face={card.rank} style={{ height: '10vw', width: '7.5vw' }} />
      ))}
    </div>
  );
}

export default CommunityCards;