import React from 'react';

const actionBarContainerStyle = { 
    position: 'absolute', 
    height: '25%', 
    width: '20%', 
    top: '88%', 
    left: '0%', 
    backgroundColor: 'red' 
}
const foldButtonStyle = {
    position: 'absolute',
    height: '33.3%', 
    width: '33.3%' ,
    bottom: '0%',
    fontSize: '1.05vw',
}
const checkButtonStyle = { 
    position: 'absolute',
    height: '33.3%', 
    width: '33.3%' ,
    bottom: '0%',
    fontSize: '.8vw',
    // display: 'inline-block'
}
const callButtonStyle = {
    position: 'absolute',
    height: '33.3%', 
    width: '33.3%' ,
    bottom: '0%',
    left: '33.3%',
    fontSize: '1.05vw'
}
const betButtonContainerStyle = {
    position: 'absolute',
    backgroundColor: 'pink',
    height: '100%',
    width: '33.3%',
    left: '66.6%',
    fontSize: '1.05vw'
}
const sliderStyle = {
    position: 'absolute',
    height: '33.3%',
    width: '100%',
    left: '0%',
    top: '33.3%',
    // display: 'inline-block'
}
const betButtonStyle = {
    position: 'absolute',
    height: '33.3%', 
    width: '100%',
    bottom: '0%',
    left: '0%',
    fontSize: '1.05vw'
}
const valueStyle = {
    height: '33.3%',
    width: '100%',
}

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
    let raise_amount = parseFloat(event.target.chips.value);
    if (current_bet > 0) {
        if (raise_amount < current_bet * 2 && raise_amount + chips_in_pot < chips) {
            alert('Invalid raise!');
            return;
    }}
    if (raise_amount < big_blind && raise_amount + chips_in_pot < chips) {
        alert('Invalid bet!');
        return;
    }
    chips_in_pot = raise_amount;
    makeAction('bet', username, chips, chips_in_pot);
}

const updateBet = () => {

}

function ActionBar(props) {
    if (props.gameState === undefined) { return null; }
    let myPlayer = props.gameState.players[props.username];
    
    if (myPlayer !== undefined) {
        if (myPlayer.spotlight) {
            return (
                <div style={actionBarContainerStyle}>
                    {
                        myPlayer.chips_in_pot === props.gameState.current_bet
                        ?
                        <button style={checkButtonStyle} onClick={() => check(props.makeAction, props.username, myPlayer.chips, myPlayer.chips_in_pot)}>
                            Check
                        </button>
                        :
                        <div>
                            <button style={foldButtonStyle} onClick={() => fold(props.makeAction, props.username, myPlayer.chips, myPlayer.chips_in_pot)}>Fold</button>
                            <button style={callButtonStyle} onClick={() => call(props.makeAction, props.username, myPlayer.chips, myPlayer.chips_in_pot)}>Call</button>
                        </div>
                    }
                    <form style={betButtonContainerStyle} onSubmit={raise(props.makeAction, props.username, myPlayer.chips, myPlayer.chips_in_pot, props.gameState.current_bet, props.gameState.big_blind)}>
                        <input style={valueStyle} type="text" name="chips" placeholder="Amount" value="1" />
                        <input style={sliderStyle} type="range" min="1" max="101" defaultValue="40" step="20" onChange={updateBet(this.value)} />
                        {
                            props.gameState.current_bet === 0
                            ?
                            <input style={betButtonStyle} type="submit" value="Bet" />
                            :
                            <input style={betButtonStyle} type="submit" value="Raise" />
                        }
                    </form>
                </div>
            )
        }
    }
    return null;
}

export default ActionBar;