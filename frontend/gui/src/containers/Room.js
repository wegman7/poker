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

        // this ACTUALLY keeps correct borders, but does not keep aspect ratios
        // const style = {
        //     position: 'fixed',
        //     top: '100px',
        //     bottom: '100px',
        //     left: '100px',
        //     right: '100px',

        //     /* Size limit */
        //     // maxWidth: '100%',
        //     // maxHeight: '100%',

        //     /* Other required settings */
        //     margin: 'auto',
        //     overflow: 'auto',
        //     backgroundColor: 'purple'
        // }

        return (
            <div>
                <div>
                    <Table
                        gameState={this.state.gameState}
                        username={this.props.username}
                        sitPlayer={this.sitPlayer}
                        reserveSeat={this.reserveSeat}
                    />
                </div>
                <Row gutter={40}>
                    <Col className="gutter-row" span={8}>
                        <ActionBar
                            gameState={this.state.gameState}
                            username={this.props.username}
                            makeAction={this.makeAction}
                        />
                    </Col>
                    <Col className="gutter-row" span={8} />
                    <Col className="gutter-row" span={8}>
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