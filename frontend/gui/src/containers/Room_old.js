import React, { Component } from 'react';

import ActionBar from '../components/ActionBar';
import Table from '../components/Table';

class Room extends Component {

    state = {}

    componentDidMount() {
        if (this.props.username === null) { this.props.history.push('/'); return; }
        this.props.pokerSocket.addCallbacks(this.updateState, this.seatReserved);
    }

    componentDidUpdate() {
        if (this.props.username === null) { this.props.history.push('/'); return; }
        this.props.pokerSocket.addCallbacks(this.updateState, this.seatReserved);
    }

    updateState = (data) => {

        let mySeatId = null;
        let i = 0;
        for (const seat of data.state.players) {
            if (seat !== null) {
                if (seat.username === this.props.username) {
                    mySeatId = i;
                }
            }
            i++;
        }

        this.setState({
            gameState: data.state,
            mySeatId: mySeatId
        });
        console.log(this.state.gameState.players);
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
                    mySeatId={this.state.mySeatId}
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