import React, { Component } from 'react';

import ActionBar from '../components/ActionBar';
import Table from '../components/Table';

class Room extends Component {

    state = {}

    componentDidMount() {
        // this.props.authCheckState();
        if (this.props.username === null) { this.props.history.push('/'); return; }
        this.props.pokerSocket.addCallbacks(this.updateState, this.seatReserved);
    }

    componentDidUpdate() {
        // this.props.authCheckState();
        if (this.props.username === null) { this.props.history.push('/'); return; }
        this.props.pokerSocket.addCallbacks(this.updateState, this.seatReserved);
    }

    updateState = (data) => {
        this.setState({
            gameState: data.state
        });
    }

    reserveSeat = (seatId) => {
        this.props.pokerSocket.reserveSeat(this.props.username, seatId);
    }

    seatReserved = (data) => {
        console.log('seat reserved', data.seatId);
    }

    sitPlayer = (username, seatId, chips) => {
        this.props.pokerSocket.sitPlayer(username, seatId, chips);
    }

    makeAction = (action, username, chips, chipsInPot) => {
        this.props.pokerSocket.makeAction(action, username, chips, chipsInPot);
    }

    render() {
        return (
            <div>
                poker room
                <Table 
                    gameState={this.state.gameState}
                    username={this.props.username}
                    sitPlayer={this.sitPlayer}
                    reserveSeat={this.reserveSeat}
                />
                <ActionBar
                    gameState={this.state.gameState}
                    username={this.props.username}
                    makeAction={this.makeAction}
                />
            </div>
        )
    }
}

export default Room;