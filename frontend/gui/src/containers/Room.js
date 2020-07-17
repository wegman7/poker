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
        return (
            <div>
                <Table
                    gameState={this.state.gameState}
                    username={this.props.username}
                    sitPlayer={this.sitPlayer}
                    reserveSeat={this.reserveSeat}
                />
                <Row gutter={600}>
                    <Col className="gutter-row" span={30}>
                        <ActionBar
                            gameState={this.state.gameState}
                            username={this.props.username}
                            makeAction={this.makeAction}
                        />
                    </Col>
                    <Col className="gutter-row" span={30}>
                        <SitBar
                            gameState={this.state.gameState}
                            username={this.props.username}
                            addChips={this.addChips}
                            makeSitAction={this.makeSitAction}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Room;