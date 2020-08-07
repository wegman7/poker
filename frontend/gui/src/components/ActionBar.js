import React, { Component } from 'react';

const actionBarContainerStyle = { 
    position: 'absolute', 
    height: '25%', 
    width: '27%', 
    top: '91%', 
    left: '70%', 
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
    fontSize: '.8vw'
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
    width: '60%',
    left: '20%',
    top: '33.3%'
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
const incrementBetStyle = {
    position: 'absolute',
    width: '20%',
    height: '33.3%',
    left: '80%',
    top: '33.3%'
}
const decreaseBetStyle = {
    position: 'absolute',
    width: '20%',
    height: '33.3%',
    top: '33.3%',
    left: '0%'
}

class ActionBar extends Component {

    state = {
        betAmount: 0,
        minimumBet: 0,
        maxBet: 0
    }

    componentDidUpdate() {
        if (this.props.gameState !== undefined && this.state.betAmount === 0 && this.props.gameState.players[this.props.username] !== undefined) {
            if (this.props.gameState.current_bet === 0) {
                this.setState({
                    minimumBet: this.props.gameState.big_blind,
                    betAmount: this.props.gameState.big_blind,
                    maxBet: this.props.gameState.players[this.props.username].chips + this.props.gameState.players[this.props.username].chips_in_pot
                });
            } else {
                this.setState({
                    minimumBet: this.props.gameState.current_bet * 2,
                    betAmount: this.props.gameState.current_bet * 2,
                    maxBet: this.props.gameState.players[this.props.username].chips + this.props.gameState.players[this.props.username].chips_in_pot
                });
            }
        }
    }

    fold = (myPlayer) => {
        console.log('fold');
        this.props.makeAction('fold', this.props.username, myPlayer.chips, myPlayer.chips_in_pot);
    }

    check = (myPlayer) => {
        console.log('check');
        this.props.makeAction('check', this.props.username, myPlayer.chips, myPlayer.chips_in_pot);
    }

    call = (myPlayer) => {
        console.log('call');
        this.props.makeAction('call', this.props.username, myPlayer.chips, myPlayer.chips_in_pot);
    }

    raise = (myPlayer, current_bet, big_blind) => (event) => {
        event.preventDefault();
        console.log('raise', event.target.chips.value);
        let raise_amount = parseFloat(event.target.chips.value);
        if (current_bet > 0) {
            if (raise_amount < current_bet * 2 && raise_amount + myPlayer.chips_in_pot < myPlayer.chips) {
                alert('Invalid raise!');
                return;
        }}
        if (raise_amount < big_blind && raise_amount + myPlayer.chips_in_pot < myPlayer.chips) {
            alert('Invalid bet!');
            return;
        }
        this.props.makeAction('bet', this.props.username, myPlayer.chips, raise_amount);
    }

    updateBet = (event) => {
        this.setState({
            betAmount: event.target.value
        });
    }

    incrementBet = () => {
        if (this.state.betAmount + this.props.gameState.big_blind <= this.state.maxBet) {
            this.setState({
                betAmount: this.state.betAmount + this.props.gameState.big_blind
            });
        }
    }

    decreaseBet = () => {
        if (this.state.betAmount - this.props.gameState.big_blind >= this.state.minimumBet) {
            this.setState({
                betAmount: this.state.betAmount - this.props.gameState.big_blind
            });
        }
    }

    render() {
        if (this.props.gameState === undefined) { return null; }
        let myPlayer = this.props.gameState.players[this.props.username];
        if (myPlayer !== undefined) {
            if (myPlayer.spotlight) {
                return (
                    <div style={actionBarContainerStyle}>
                        {
                            myPlayer.chips_in_pot === this.props.gameState.current_bet
                            ?
                            <button style={checkButtonStyle} onClick={() => this.check(myPlayer)}>
                                Check
                            </button>
                            :
                            <div>
                                <button style={foldButtonStyle} onClick={() => this.fold(myPlayer)}>Fold</button>
                                <button style={callButtonStyle} onClick={() => this.call(myPlayer)}>Call</button>
                            </div>
                        }
                        <form style={betButtonContainerStyle} onSubmit={this.raise(myPlayer, this.props.gameState.current_bet, this.props.gameState.big_blind)}>
                            <input style={valueStyle} type="text" name="chips" placeholder="Amount"  value={this.state.betAmount} onChange={this.updateBet} />
                            <input style={decreaseBetStyle} type="button" onClick={this.decreaseBet} value="-" />
                            {/* <div style={sliderContainerStyle}> */}
                                <input style={sliderStyle} type="range" min={this.state.minimumBet} max={this.state.maxBet} value={this.state.betAmount} onChange={this.updateBet} step={this.props.gameState.big_blind} />
                            {/* </div> */}
                            <input style={incrementBetStyle} type="button" onClick={this.incrementBet} value="+" />
                            {
                                this.props.gameState.current_bet === 0
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
}

export default ActionBar;