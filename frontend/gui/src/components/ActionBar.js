import React, { Component } from 'react';

const actionBarContainerStyle = { 
    position: 'absolute', 
    height: '40%', 
    width: '33%', 
    top: '89%', 
    left: '66.5%', 
    // backgroundColor: 'red' 
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
    fontSize: '1.05vw'
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
    // backgroundColor: 'pink',
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

    state = {
        betAmount: 0,
        minimumBet: 0,
        maxBet: 0
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.username === null || newProps.gameState ===undefined || newProps.gameState.players[newProps.username] === undefined) { return; }
        if (newProps.gameState.current_bet === 0) {
            this.setState({
                minimumBet: newProps.gameState.big_blind,
                betAmount: newProps.gameState.big_blind,
                maxBet: newProps.gameState.players[this.props.username].chips + newProps.gameState.players[this.props.username].chips_in_pot
            });
        } else {
            this.setState({
                minimumBet: newProps.gameState.current_bet * 2,
                betAmount: newProps.gameState.current_bet * 2,
                maxBet: newProps.gameState.players[newProps.username].chips + newProps.gameState.players[newProps.username].chips_in_pot
            });
        }
    }

    fold = (myPlayer) => {
        this.props.makeAction('fold', this.props.username, myPlayer.chips, myPlayer.chips_in_pot);
    }

    check = (myPlayer) => {
        this.props.makeAction('check', this.props.username, myPlayer.chips, myPlayer.chips_in_pot);
    }

    call = (myPlayer) => {
        this.props.makeAction('call', this.props.username, myPlayer.chips, myPlayer.chips_in_pot);
    }

    raise = (myPlayer, current_bet, big_blind) => (event) => {
        event.preventDefault();
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
        if (this.state.betAmount < this.state.minimumBet) { this.setState({ betAmount: this.state.minimumBet }); return; }
        if (this.state.betAmount > this.state.maxBet) { this.setState({ betAmount: this.state.maxBet }); return; }
        if (this.state.betAmount + this.props.gameState.big_blind <= this.state.maxBet) {
            this.setState({
                betAmount: this.state.betAmount + this.props.gameState.big_blind
            });
        }
    }

    decreaseBet = () => {
        if (this.state.betAmount < this.state.minimumBet) { this.setState({ betAmount: this.state.minimumBet }); return; }
        if (this.state.betAmount > this.state.maxBet) { this.setState({ betAmount: this.state.maxBet }); return; }
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
        var pot;
        if (this.props.gameState.current_bet > 0) {
            pot = this.props.gameState.current_bet * 3 + (this.props.gameState.pot - this.props.gameState.current_bet) - this.props.gameState.players[this.props.username].chips_in_pot;
        } else {
            pot = this.props.gameState.pot;
        }
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
        // if it tries to render before we have a gamestate
        if (this.props.gameState === undefined) { return null; }
        // if we have timed out and this.props.username has become undefined, or we are not seated at the table
        if (this.props.username === undefined || this.props.gameState.players[this.props.username] === undefined) { return null; }
        let myPlayer = this.props.gameState.players[this.props.username];
        var callOrAllIn;
        if (this.props.gameState.current_bet < myPlayer.chips + myPlayer.chips_in_pot) {
            callOrAllIn = 'Call';
        } else {
            callOrAllIn = 'All in';
        }
        var raiseOrAllIn;
        var raiseBarInputStyle;
        if (this.state.minimumBet < this.state.maxBet) {
            raiseOrAllIn = 'Raise';
            raiseBarInputStyle = {}
        } else {
            raiseOrAllIn = 'All in';
            raiseBarInputStyle = { display: 'none' }
        }

        if (myPlayer !== undefined) {
            if (myPlayer.spotlight) {
                return (
                    <div style={actionBarContainerStyle}>
                        {
                            myPlayer.chips_in_pot === this.props.gameState.current_bet
                            ?
                            <button style={checkButtonStyle} className="button" onClick={() => this.check(myPlayer)}>
                                Check
                            </button>
                            :
                            <div>
                                <button style={foldButtonStyle} className="button" onClick={() => this.fold(myPlayer)}>Fold</button>
                                <button style={callButtonStyle} className="button" onClick={() => this.call(myPlayer)}>{callOrAllIn}<br />{Math.min(this.props.gameState.current_bet - myPlayer.chips_in_pot, myPlayer.chips + myPlayer.chips_in_pot)}</button>
                            </div>
                        }
                        {
                            this.props.gameState.current_bet < myPlayer.chips + myPlayer.chips_in_pot
                            ?
                            <form style={betButtonContainerStyle} onSubmit={this.raise(myPlayer, this.props.gameState.current_bet, this.props.gameState.big_blind)}>
                                <div style={raiseBarInputStyle}>
                                    <input style={minBetStyle} className="button" type="button" onClick={this.minBet} value="Min" />
                                    <input style={potBetStyle} className="button" type="button" onClick={this.potBet} value="Pot" />
                                    <input style={maxBetStyle} className="button" type="button" onClick={this.maxBet} value="Max" />
                                    <input style={valueStyle} className="input" type="text" name="chips" placeholder="Amount"  value={this.state.betAmount} onChange={this.updateBet} />
                                    <input style={decreaseBetStyle} className="button" type="button" onClick={this.decreaseBet} value="-" />
                                    <input style={sliderStyle} className="button" type="range" min={this.state.minimumBet} max={this.state.maxBet} value={this.state.betAmount} onChange={this.updateBet} step={this.props.gameState.big_blind} />
                                    <input style={incrementBetStyle} className="button" type="button" onClick={this.incrementBet} value="+" />
                                </div>
                                {
                                    this.props.gameState.current_bet === 0
                                    ?
                                    <button style={betButtonStyle} className="button" type="submit">Bet<br />{this.state.betAmount}</button>
                                    :
                                    <button style={betButtonStyle} className="button" type="submit">{raiseOrAllIn}<br />{this.state.betAmount}</button>
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