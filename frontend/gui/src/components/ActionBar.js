import React from 'react';

const fold = (makeAction, username, chips, chips_in_pot) => {
    console.log('fold');
    makeAction('fold', username, chips, chips_in_pot);
}

const check = (makeAction, username, chips, chips_in_pot) => {
    console.log('check');
    makeAction('check', username, chips, chips_in_pot);
}

const call = (makeAction, username, chips, chips_in_pot) => {
    console.log('call');
    makeAction('call', username, chips, chips_in_pot);
}

const raise = (makeAction, username, chips, chips_in_pot, current_bet, big_blind) => (event) => {
    event.preventDefault();
    console.log('raise', event.target.chips.value);
    let raise_amount = event.target.chips.value;
    if (current_bet > 0) {
        if (raise_amount < current_bet * 2) {
            alert('Invalid raise!');
            return;
    }}
    if (raise_amount < big_blind) {
        alert('Invalid bet!');
        return;
    }
    chips_in_pot = raise_amount;
    makeAction('bet', username, chips, chips_in_pot);
}

function ActionBar(props) {
    if (props.gameState === undefined) { return null; }
    let myPlayer = null;
    for (let player of props.gameState.players) {
        if (player !== null) {
            if (player.username === props.username) {
                myPlayer = player;
            }
        }
    }
    if (myPlayer !== null) {
        if (myPlayer.spotlight) {
            return (
                <div>
                    action bar!
                    {
                        myPlayer.chips_in_pot === props.gameState.current_bet
                        ?
                        <button onClick={() => check(props.makeAction, props.username, myPlayer.chips, myPlayer.chips_in_pot)}>Check</button>
                        :
                        <div>
                            <button onClick={() => fold(props.makeAction, props.username, myPlayer.chips, myPlayer.chips_in_pot)}>Fold</button>
                            <button onClick={() => call(props.makeAction, props.username, myPlayer.chips, myPlayer.chips_in_pot)}>Call</button>
                        </div>
                    }
                    <form onSubmit={raise(props.makeAction, props.username, myPlayer.chips, myPlayer.chips_in_pot, props.gameState.current_bet, props.gameState.big_blind)}>
                        <input type="text" name="chips" placeholder="Amount" />
                        {
                            props.gameState.current_bet === 0
                            ?
                            <input type="submit" value="Bet" />
                            :
                            <input type="submit" value="Raise" />
                        }
                    </form>
                </div>
            )
        }
    }
    return null;
}

export default ActionBar;