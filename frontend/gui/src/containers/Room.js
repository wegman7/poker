import React, { Component } from 'react';
import { Row, Col } from 'antd';

import ActionBar from '../components/ActionBar';
import Table from '../components/Table';
import SitBar from '../components/SitBar';

class Room extends Component {

    state = {}

    componentDidMount() {
        this.props.authCheckState();
        if (this.props.username === null) { this.props.history.push('/'); return; }
        this.props.pokerSocket.addCallbacks(this.updateState, this.seatReserved);
    }

    componentDidUpdate() {
        this.props.authCheckState();
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

    addChips = (action, username, chips) => {
        this.props.pokerSocket.addChips(action, username, chips);
    }

    makeSitAction = (action, username) => {
        this.props.pokerSocket.makeSitAction(action, username);
    }

    render() {

        const roomStyle = {
            backgroundColor: 'purple',
            position: 'relative', /* If you want text inside of it */
            width: '100%',
            paddingTop: '45%', /* 1:1 Aspect Ratio */
        };

        const tableAreaStyle = {
            position: 'absolute',
            top: '0',
            left: '0',
            bottom: '0',
            right: '0',
            textAlign: 'center',
            fontSize: '1.3vw',
            color: 'white',
         };

        if (this.state.gameState !== undefined) {
            console.log(this.state.gameState.show_hands);
        };

        return (
            <div style={roomStyle}>
                <div style={tableAreaStyle}>
                    <Table
                        gameState={this.state.gameState}
                        username={this.props.username}
                        sitPlayer={this.sitPlayer}
                        reserveSeat={this.reserveSeat}
                        makeSitAction={this.makeSitAction}
                    />
                </div>
                <ActionBar
                    gameState={this.state.gameState}
                    username={this.props.username}
                    makeAction={this.makeAction}
                />
                <SitBar
                    gameState={this.state.gameState}
                    username={this.props.username}
                    addChips={this.addChips}
                    makeSitAction={this.makeSitAction}
                />
            </div>
        )
    }
}

export default Room;