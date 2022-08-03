import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  cards: {
    left: '50%',
    top: '40%',
  },
}));

const CommunityCards = (props) => {
  const classes = useStyles();

  if (props.communityCards.length === 0) {
    return null;
  }

  return (
    <div className={`${classes.cards} ${props.baseStyle}`}>
      {props.communityCards[0].rank}{props.communityCards[0].suit} {props.communityCards[1].rank}{props.communityCards[1].suit} {props.communityCards[2].rank}{props.communityCards[2].suit}
    </div>
  );
}

export default CommunityCards;