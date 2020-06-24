import React, { Component } from 'react';
import { Row, Col, Form, Button, Input } from 'antd';
import { Card } from 'react-casino';

const style = { backgroundColor: 'white', padding: '30px 0', textAlign: 'center', position: 'relative'};
const communityCardsStyle = { height: '70px', width: '45px', paddingLeft: '3px' }

class Table extends Component {

    state = {}
    
    onFinish = (values) => {
        this.props.sitPlayer(this.props.username, this.props.mySeatId, values.chips);
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
                        <Card suit={cards[1].suit} face={cards[1].rank}  style={{height: '70px', width: '45px', position: 'absolute', left: '115px'}} />
                    </div>
                )
            } else {
                return (
                    <div>
                        <Card suit='' face='' style={{height: '70px', width: '45px'}} />
                        <Card suit='' face=''  style={{height: '70px', width: '45px', position: 'absolute', left: '115px'}} />
                    </div>
                )
            }}
        }

        const renderSeat = (seatId) => {
            if (this.props.gameState === undefined) { return; }
            
            let player = this.props.gameState.players[seatId]
            
            // if this seat is empty
            if (player === null) {
                // if we are currently sitting at the table
                if (this.props.mySeatId) {
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
                    // this.setState({ mySeat: seatId})
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
            // if there is a player in this seat
            } else {
                // if we are drawing for the dealer chip
                let cards = player.hole_cards;
                if (this.props.gameState.draw_for_dealer) {
                    // let cards = player.hole_cards;
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
                            My seat
                            {renderCards(true, cards)}
                        </div>
                    )
                // if someone else is sitting in this seat
                } else {
                    // return face down hold cards
                    return (
                        <div>
                            {this.props.gameState.players[seatId].username}
                            {renderCards(false, cards)}
                        </div>
                    )
                }
            }
        }

        const renderDealerChip = (seatId) => {
            if (this.props.gameState === undefined) { return; }
            if (this.props.gameState.players[seatId] !== null) {

                let player = this.props.gameState.players[seatId];

                // player is sitting out
                if (!player.reserved && player.sitting_out) {
                    return (
                        <div>
                            sitting out
                        </div>
                    )
                } else if (player.reserved) {
                    return;
                }

                // determine dealer chip and blinds
                if (player.dealer && player.small_blind) {
                    return (
                        <div>
                            dealer and small blind <br />
                            chips: {player.chips} <br />
                            {
                                player.in_hand
                                ?
                                <div>bet amount: {player.chips_in_pot}</div>
                                :
                                null
                            }
                        </div>
                    )
                } else if (player.dealer) {
                    return (
                        <div>
                            dealer <br />
                            chips: {player.chips} <br />
                            {
                                player.in_hand
                                ?
                                <div>bet amount: {player.chips_in_pot}</div>
                                :
                                null
                            }
                        </div>
                    )
                } else if (player.small_blind) {
                    return (
                        <div>
                            small blind <br />
                            chips: {player.chips} <br />
                            {
                                player.in_hand
                                ?
                                <div>bet amount: {player.chips_in_pot}</div>
                                :
                                null
                            }
                        </div>
                    )
                } else if (player.big_blind) {
                    return (
                        <div>
                            big blind <br />
                            chips: {player.chips} <br />
                            {
                                player.in_hand
                                ?
                                <div>bet amount: {player.chips_in_pot}</div>
                                :
                                null
                            }
                        </div>
                    )
                } else {
                    return (
                        <div>
                            chips: {player.chips} <br />
                            {
                                player.in_hand
                                ?
                                <div>bet amount: {player.chips_in_pot}</div>
                                :
                                null
                            }
                        </div>
                    )
                }
            }
        }

        const renderCommunityCards = () => {
            if (this.props.gameState === undefined) { return; }
            let communityCards = this.props.gameState.community_cards
            if (communityCards.length === 0) {
                return (
                    <div>
                        <Card style={{height: '70px', width: '45px'}} />
                        <br />
                        Pot: {this.props.gameState.pot}
                    </div>
                )
            } else if (communityCards.length === 3) {
                return (
                    <div>
                        <Card style={{height: '70px', width: '45px'}} />
                        <Card suit={communityCards[0].suit} face={communityCards[0].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[1].suit} face={communityCards[1].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[2].suit} face={communityCards[2].rank} style={communityCardsStyle} />
                        <br />
                        Pot: {this.props.gameState.pot}
                    </div>
                )
            } else if (communityCards.length === 4) {
                return (
                    <div>
                        <Card style={{height: '70px', width: '45px'}} />
                        <Card suit={communityCards[0].suit} face={communityCards[0].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[1].suit} face={communityCards[1].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[2].suit} face={communityCards[2].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[3].suit} face={communityCards[3].rank} style={communityCardsStyle} />
                        <br />
                        Pot: {this.props.gameState.pot}
                    </div>
                )
            } else if (communityCards.length === 5) {
                return (
                    <div>
                        <Card style={{height: '70px', width: '45px'}} />
                        <Card suit={communityCards[0].suit} face={communityCards[0].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[1].suit} face={communityCards[1].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[2].suit} face={communityCards[2].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[3].suit} face={communityCards[3].rank} style={communityCardsStyle} />
                        <Card suit={communityCards[4].suit} face={communityCards[4].rank} style={communityCardsStyle} />
                        <br />
                        Pot: {this.props.gameState.pot}
                    </div>
                )
            }
        }

        return (
            <div style={{minWidth: '1100px', backgroundColor: 'green', margin: '20px', padding: '20px', borderRadius: '25px'}}>
                <Row gutter={[16, 16]}>
                    <Col id="8" span={6}>
                        <div style={style}>
                            {renderSeat(8)}
                            {renderDealerChip(8)}
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={style}>Dealer</div>
                    </Col>
                    <Col id="0" span={6}>
                        <div style={style}>
                            {renderSeat(0)}
                            {renderDealerChip(0)}
                        </div>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col id="7" span={6}>
                        <div style={style}>
                            {renderSeat(7)}
                            {renderDealerChip(7)}
                        </div>
                    </Col>
                    {/* community cards */}
                    <Col span={12}>
                        <div style={{ backgroundColor: 'white', padding: '30px 60px', position: 'relative'}}>
                            {renderCommunityCards()}
                        </div>
                    </Col>
                    <Col id="1" span={6}>
                        <div style={style}>
                            {renderSeat(1)}
                            {renderDealerChip(1)}
                        </div>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col id="6" span={6}>
                        <div style={style}>
                            {renderSeat(6)}
                            {renderDealerChip(6)}
                        </div>
                    </Col>
                    <Col span={6}>
                        {/* <div style={style}>col-6</div> */}
                    </Col>
                    <Col span={6}>
                        {/* <div style={style}>col-6</div> */}
                    </Col>
                    <Col id="2" span={6}>
                        <div style={style}>
                            {renderSeat(2)}
                            {renderDealerChip(2)}
                        </div>
                    </Col>
                </Row>
                <Row gutter={16} justify="center">
                    <Col id="5" span={6}>
                        <div style={style}>
                            {renderSeat(5)}
                            {renderDealerChip(5)}
                        </div>
                    </Col>
                    <Col id="4" span={6}>
                        <div style={style}>
                            {renderSeat(4)}
                            {renderDealerChip(4)}
                        </div>
                    </Col>
                    <Col id="3" span={6}>
                        <div style={style}>
                            {renderSeat(3)}
                            {renderDealerChip(3)}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Table;