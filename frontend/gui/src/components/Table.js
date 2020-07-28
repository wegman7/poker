import React, { Component } from 'react';
import { Row, Col, Form, Button, Input } from 'antd';
import { Card } from 'react-casino';
import mp3_file from '../assets/insight.mp3';

import Chips from './Chips';
import CommunityChips from './CommunityChips';

const playerBarStyle = { backgroundColor: 'lightGrey', padding: '15px', textAlign: 'center', position: 'relative', borderRadius: '50px'};
const communityCardsStyle = { height: '70px', width: '45px', paddingLeft: '3px' }

class Table extends Component {

    state = {}
    
    onFinish = (values) => {
        let seatId = this.props.gameState.players[this.props.username].seat_id;
        this.props.sitPlayer(this.props.username, seatId, values.chips);
    };
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    render() {

        const renderCards = (visable, cards) => {
            
            if (cards) { if (cards.length === 0) {
                return <div></div>
            } else if (cards.length === 1) {
                return (
                    <Card suit={cards[0].suit} face={cards[0].rank} style={{height: '70px', width: '45px'}} />
                )
            } else if (visable) {
                return (
                    <div>
                        <Card suit={cards[0].suit} face={cards[0].rank} style={{height: '70px', width: '45px'}} />
                        <Card suit={cards[1].suit} face={cards[1].rank}  style={{height: '70px', width: '45px', position: 'absolute', left: '100px'}} />
                    </div>
                )
            } else {
                return (
                    <div>
                        <Card suit='' face='' style={{height: '70px', width: '45px'}} />
                        <Card suit='' face=''  style={{height: '70px', width: '45px', position: 'absolute', left: '100px'}} />
                    </div>
                )
            }}
        }

        const renderSeat = (seatId) => {
            if (this.props.gameState === undefined) { return; }

            let player = undefined;

            for (let loop_player in this.props.gameState.players) {
                if (this.props.gameState.players[loop_player].seat_id === seatId) {
                    player = this.props.gameState.players[loop_player];
                }
            }

            // if there is a player in this seat
            if (player === undefined) { return null; }
            let cards = player.hole_cards;
            // if we are drawing for the dealer chip
            if (this.props.gameState.draw_for_dealer) {
                return (
                    <div>
                        {renderCards(true, cards)}
                    </div>
                )
                // if we are sitting in this seat
            } else if (player.username === this.props.username) {
                let cards = player.hole_cards;
                // return face up hole cards
                return (
                    <div>
                        {renderCards(true, cards)}
                    </div>
                )
            // if someone else is sitting in this seat
            } else {
                // return face down hold cards
                return (
                    <div>
                        {renderCards(false, cards)}
                    </div>
                )
            }
        }

        const renderPlayerBar = (seatId) => {
            if (this.props.gameState === undefined) { return; }

            let player = undefined;
            let myPlayer = this.props.gameState.players[this.props.username];
            for (let loop_player in this.props.gameState.players) {
                if (this.props.gameState.players[loop_player].seat_id === seatId) {
                    player = this.props.gameState.players[loop_player];
                }
            }
            
            // if this seat is empty
            if (player === undefined) {
                // if we are currently sitting at the table
                if (myPlayer !== undefined) {
                    return (
                        <div>
                            empty
                        </div>
                    )
                // if we are not currently sitting at the table
                } else {
                    return (
                        <div>
                            <button onClick={() => this.props.reserveSeat(seatId)}>Click to sit</button>
                        </div>
                    )
                }
            // if seat is reserved
            } else if (player.reserved === true) {
                // if it's our seat
                if (player.username === this.props.username) {
                    return (
                        <div>
                            <Form
                                onFinish={this.onFinish}
                                onFinishFailed={this.onFinishFailed}
                            >
                                <Form.Item name="chips" >
                                    <Input style={{width: 120, textAlign: 'centered'}} placeholder="Add chips" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    )
                }
                // if it's someone elses seat
                return (
                    <div>
                        Reserved for {player.username}
                    </div>
                )
            }

            if (player !== undefined) {
                console.log(player);
                let playerStyle = {};
                if (player.spotlight) {
                    playerStyle = { backgroundColor: 'darkGrey', borderRadius: '40px', width: '70%', margin: 'auto', paddingLeft: '1px', paddingRight: '1px', paddingTop: '10px', paddingBottom: '10px', marginTop: '10px' }
                    if (player.username === this.props.username) {
                        let audio = new Audio(mp3_file);
                        audio.play();
                    }
                }

                // player is sitting out
                if (!player.reserved && player.sitting_out) {
                    return (
                        <div>
                            {player.username} <br />
                            Chips: {player.chips} <br />
                            Sitting out
                        </div>
                    )
                } else if (player.reserved) {
                    return (
                        <div>
                            Reserved
                        </div>
                    )
                }
                
                // normal player in hand
                return (
                    <div style={playerStyle}>
                        {player.username} <br />
                        {player.chips} <br />
                    </div>
                )
            }
        }

        const renderCommunityCards = () => {
            if (this.props.gameState === undefined) { return; }
            let communityCards = this.props.gameState.community_cards
            if (communityCards.length === 0) {
                return (
                    <div>
                        Pot: {this.props.gameState.pot} <br />
                        <Card style={{height: '70px', width: '45px'}} />
                    </div>
                )
            } else if (communityCards.length === 3) {
                return (
                    <div>
                        Pot: {this.props.gameState.pot} <br />
                        <Card style={{height: '70px', width: '45px'}} />
                        <Card suit={communityCards[0].suit} face={communityCards[0].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[1].suit} face={communityCards[1].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[2].suit} face={communityCards[2].rank} style={communityCardsStyle} />
                    </div>
                )
            } else if (communityCards.length === 4) {
                return (
                    <div>
                        Pot: {this.props.gameState.pot} <br />
                        <Card style={{height: '70px', width: '45px'}} />
                        <Card suit={communityCards[0].suit} face={communityCards[0].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[1].suit} face={communityCards[1].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[2].suit} face={communityCards[2].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[3].suit} face={communityCards[3].rank} style={communityCardsStyle} />
                    </div>
                )
            } else if (communityCards.length === 5) {
                return (
                    <div>
                        Pot: {this.props.gameState.pot} <br />
                        <Card style={{height: '70px', width: '45px'}} />
                        <Card suit={communityCards[0].suit} face={communityCards[0].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[1].suit} face={communityCards[1].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[2].suit} face={communityCards[2].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[3].suit} face={communityCards[3].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[4].suit} face={communityCards[4].rank} style={communityCardsStyle} />
                    </div>
                )
            }
        }

        const playerAreaStyle = { marginLeft: '15px', marginRight: '15px' }
        const playerAvatarStyle = { height: '0px', padding: '30px', textAlign: 'center', position: 'relative' }

        return (
            <div style={{width: '1100px', backgroundColor: 'green', margin: '20px', padding: '20px', borderRadius: '100px'}}>
                <Row gutter={[16, 16]}>
                    <Col id="8" span={6}>
                        <div style={playerAreaStyle}>
                            <div style={playerAvatarStyle}>
                                {renderSeat(8)}
                            </div>
                            <div style={playerBarStyle}>
                                {renderPlayerBar(8)}
                            </div>
                            <Chips gameState={this.props.gameState} seatId={8} />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={playerBarStyle}>Dealer</div>
                    </Col>
                    <Col id="0" span={6}>
                        <div style={playerAreaStyle}>
                            <div style={playerAvatarStyle}>
                                {renderSeat(0)}
                            </div>
                            <div style={playerBarStyle}>
                                {renderPlayerBar(0)}
                            </div>
                            <Chips gameState={this.props.gameState} seatId={0} />
                        </div>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col id="7" span={6}>
                        <div style={playerAreaStyle}>
                            <div style={playerAvatarStyle}>
                                {renderSeat(7)}
                            </div>
                            <div style={playerBarStyle}>
                                {renderPlayerBar(7)}
                            </div>
                            <Chips gameState={this.props.gameState} seatId={7} />
                        </div>
                    </Col>
                    {/* community cards */}
                    <Col span={12}>
                        <div style={{ padding: '30px 60px', position: 'relative'}}>
                            {renderCommunityCards()}
                            <CommunityChips gameState={this.props.gameState} />
                        </div>
                    </Col>
                    <Col id="1" span={6}>
                        <div style={playerAreaStyle}>
                            <div style={playerAvatarStyle}>
                                {renderSeat(1)}
                            </div>
                            <div style={playerBarStyle}>
                                {renderPlayerBar(1)}
                            </div>
                            <Chips gameState={this.props.gameState} seatId={1} />
                        </div>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col id="6" span={6}>
                        <div style={playerAreaStyle}>
                            <div style={playerAvatarStyle}>
                                {renderSeat(6)}
                            </div>
                            <div style={playerBarStyle}>
                                {renderPlayerBar(6)}
                            </div>
                            <Chips gameState={this.props.gameState} seatId={6} />
                        </div>
                    </Col>
                    <Col span={6}>
                        {/* <div style={style}>col-6</div> */}
                    </Col>
                    <Col span={6}>
                        {/* <div style={style}>col-6</div> */}
                    </Col>
                    <Col id="2" span={6}>
                        <div style={playerAreaStyle}>
                            <div style={playerAvatarStyle}>
                                {renderSeat(2)}
                            </div>
                            <div style={playerBarStyle}>
                                {renderPlayerBar(2)}
                            </div>
                            <Chips gameState={this.props.gameState} seatId={2} />
                        </div>
                    </Col>
                </Row>
                <Row gutter={16} justify="center">
                    <Col id="5" span={6}>
                        <div style={playerAreaStyle}>
                            <div style={playerAvatarStyle}>
                                {renderSeat(5)}
                            </div>
                            <div style={playerBarStyle}>
                                {renderPlayerBar(5)}
                            </div>
                            <Chips gameState={this.props.gameState} seatId={5} />
                        </div>
                    </Col>
                    <Col id="4" span={6}>
                        <div style={playerAreaStyle}>
                            <div style={playerAvatarStyle}>
                                {renderSeat(4)}
                            </div>
                            <div style={playerBarStyle}>
                                {renderPlayerBar(4)}
                            </div>
                            <Chips gameState={this.props.gameState} seatId={4} />
                        </div>
                    </Col>
                    <Col id="3" span={6}>
                        <div style={playerAreaStyle}>
                            <div style={playerAvatarStyle}>
                                {renderSeat(3)}
                            </div>
                            <div style={playerBarStyle}>
                                {renderPlayerBar(3)}
                            </div>
                            <Chips gameState={this.props.gameState} seatId={3} />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Table;