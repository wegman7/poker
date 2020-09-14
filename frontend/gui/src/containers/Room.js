import React, { Component } from 'react';

import ActionBar from '../components/ActionBar';
import Table from '../components/Table';
import SitBar from '../components/SitBar';
// const image = require('../assets/vegas.jpg');

class Room extends Component {

    state = {}

    componentDidMount() {
        // this.props.authCheckState();
        // if (this.props.username === null) { this.props.history.push('/'); return; }
        this.props.pokerSocket.addCallbacks(this.updateState, this.seatReserved);
    }

    componentDidUpdate() {
        // this.props.authCheckState();
        // if (this.props.username === null) { this.props.history.push('/'); return; }
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

    sitPlayer = (username, seatId, chips, avatar) => {
        this.props.pokerSocket.sitPlayer(username, seatId, chips, avatar);
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

        const backgroundStyle = { 
            position: 'absolute', 
            width: '100%', 
            height: '120%', 
            left: '0', 
            top: '0',
            backgroundImage: 'linear-gradient(to top, teal, #9ae5e5, teal)'
        }

        const roomStyle = {
            backgroundColor: '#800000',
            backgroundImage: 'linear-gradient(to top, #800000, #ff6666, #800000)',
            boxShadow: 'inset 0px 1px 50px #888',
            border: '.1vw solid',
            borderImage: 'linear-gradient(to bottom, #258e8e 5%, #000066 100%) 25',
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

        return (
            <div>
                <div style={backgroundStyle}></div>
                <div className="room-background"></div>
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
            </div>
        )
    }
}

export default Room;