import React, { Component } from 'react';

const actionBarContainerStyle = { 
    position: 'absolute', 
    height: '29%', 
    width: '27%', 
    top: '86%', 
    left: '70%', 
    backgroundColor: 'red' 
}
const foldButtonStyle = {
    position: 'absolute',
    height: '25%', 
    width: '33.3%' ,
    bottom: '0%',
    fontSize: '1.05vw',
}
const checkButtonStyle = { 
    position: 'absolute',
    height: '25%', 
    width: '33.3%' ,
    bottom: '0%',
    fontSize: '.8vw'
}
const callButtonStyle = {
    position: 'absolute',
    height: '25%', 
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
    height: '25%',
    width: '60%',
    left: '20%',
    top: '50%'
}
const betButtonStyle = {
    position: 'absolute',
    height: '25%', 
    width: '100%',
    bottom: '0%',
    left: '0%',
    fontSize: '1.05vw'
}
const valueStyle = {
    position: 'absolute',
    height: '25%',
    width: '100%',
    top: '25%'
}
const incrementBetStyle = {
    position: 'absolute',
    width: '20%',
    height: '25%',
    left: '80%',
    top: '50%'
}
const decreaseBetStyle = {
    position: 'absolute',
    width: '20%',
    height: '25%',
    top: '50%',
    left: '0%'
}
const minBetStyle = {
    position: 'absolute',
    width: '33.3%',
    height: '25%',
    top: '0%',
    left: '0%'
}
const potBetStyle = {
    position: 'absolute',
    width: '33.3%',
    height: '25%',
    top: '0%',
    left: '33.3%'
}
const maxBetStyle = {
    position: 'absolute',
    width: '33.3%',
    height: '25%',
    top: '0%',
    left: '66.7%'
}

class ActionBar extends Component {

    // create gameStateCopy to determine whenever there is a new gameState
    state = {
        betAmount: 0,
        minimumBet: 0,
        maxBet: 0,
        gameStateCopy: null
    };

    componentDidUpdate() {
        if (this.state.gameStateCopy !== this.props.gameState) {
            if (this.props.gameState !== undefined && this.props.gameState.hand_in_action && this.props.gameState.players[this.props.username].spotlight) {
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
                this.setState({ gameStateCopy: this.props.gameState });
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

    minBet = () => {
        if (this.state.minimumBet <= this.state.maxBet) {
            this.setState({
                betAmount: this.state.minimumBet
            });
        } else {
            this.setState({
                betAmount: this.state.maxBet
            });
        }
    }

    potBet = () => {
        const pot = this.props.gameState.pot * 2;
        if (pot <= this.state.maxBet) {
            this.setState({
                betAmount: pot
            });
        } else {
            this.setState({
                betAmount: this.state.maxBet
            });
        }
    }

    maxBet = () => {
        this.setState({
            betAmount: this.state.maxBet
        });
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
                                {
                                    this.state.minimumBet <= this.state.maxBet
                                    ?
                                    <button style={callButtonStyle} onClick={() => this.call(myPlayer)}>Call</button>
                                    :
                                    <button style={callButtonStyle} onClick={() => this.call(myPlayer)}>All in</button>
                                }
                            </div>
                        }
                        {
                            this.state.minimumBet <= this.state.maxBet
                            ?
                            <form style={betButtonContainerStyle} onSubmit={this.raise(myPlayer, this.props.gameState.current_bet, this.props.gameState.big_blind)}>
                                <input style={minBetStyle} type="button" onClick={this.minBet} value="Min" />
                                <input style={potBetStyle} type="button" onClick={this.potBet} value="Pot" />
                                <input style={maxBetStyle} type="button" onClick={this.maxBet} value="Max" />
                                <input style={valueStyle} type="text" name="chips" placeholder="Amount"  value={this.state.betAmount} onChange={this.updateBet} />
                                <input style={decreaseBetStyle} type="button" onClick={this.decreaseBet} value="-" />
                                <input style={sliderStyle} type="range" min={this.state.minimumBet} max={this.state.maxBet} value={this.state.betAmount} onChange={this.updateBet} step={this.props.gameState.big_blind} />
                                <input style={incrementBetStyle} type="button" onClick={this.incrementBet} value="+" />
                                {
                                    this.props.gameState.current_bet === 0
                                    ?
                                    <input style={betButtonStyle} type="submit" value="Bet" />
                                    :
                                    <input style={betButtonStyle} type="submit" value="Raise" />
                                }
                            </form>
                            :
                            null
                        }
                    </div>
                )
            }
        }
        return null;
    }
}

export default ActionBar;