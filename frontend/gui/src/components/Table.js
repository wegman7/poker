import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import { Card } from 'react-casino';
import mp3_file from '../assets/insight.mp3';

import Chips from './Chips';
import CommunityChips from './CommunityChips';

const tableStyle = {
    position: 'absolute',
    backgroundColor: 'green', 
    margin: '5% 5% 5% 5%',
    borderRadius: '50%',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0'
};
const playerAreaStyle = { 
    position: 'absolute', 
    backgroundColor: 'blue', 
    width: '11%', 
    height: '28.5%' 
};
var playerBarStyle = { 
    backgroundColor: 'lightGrey', 
    padding: '0', 
    textAlign: 'center', 
    position: 'absolute', 
    borderRadius: '50px', 
    fontSize: '.8vw',
    width: '100%',
    bottom: '0%'
};
const communityCardsStyle = {
    position: 'absolute',
    height: '6.8vw', 
    width: '4.7vw', 
    top: '15%' 
};
const cardStyle = {
    position: 'absolute', 
    height: '9vw', 
    width: '6vw', 
    // top: '50%', 
    overflow: 'hidden'
}
const chipAreaStyle = { 
    position: 'absolute', 
    height: '10%', 
    width: '8%', 
    backgroundColor: 'red' 
}
const communityCardsAreaStyle = { 
    position: 'absolute', 
    backgroundColor: 'teal', 
    left: '35%', 
    top: '35%', 
    width: '30%',
    height: '35%'
}

class Table extends Component {

    state = {}
    
    onFinish = (values) => {
        if (values.chips !== undefined && values.chips >= this.props.gameState.big_blind * 40) { 
            let seatId = this.props.gameState.players[this.props.username].seat_id;
            this.props.sitPlayer(this.props.username, seatId, values.chips, localStorage.getItem('avatar'));
        } else {
            alert('Must buy in with at least 40 big blinds');
        }
    };

    cancel = () => {
        this.props.makeSitAction('stand_up', this.props.username);
    }
    
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
                    <div style={{ position: 'absolute', top: '60%', width: '100%', height: '40%' }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                            <Card suit={cards[0].suit} face={cards[0].rank} style={{ ...cardStyle, left: '10%'}} />
                            <Card suit={cards[1].suit} face={cards[1].rank}  style={{ ...cardStyle, left: '28%'}}  />
                        </div>
                    </div>
                )
            } else {
                return (
                    <div style={{ position: 'absolute', top: '60%', width: '100%', height: '40%' }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                            <Card suit='' face='' style={{ ...cardStyle, left: '10%'}} />
                            <Card suit='' face=''  style={{ ...cardStyle, left: '28%'}} />
                        </div>
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
                        <img style={{ position: 'absolute', width: '100%', height: '80%' }} src={player.avatar} alt="" />
                        {renderCards(true, cards)}
                    </div>
                )
                // if we are sitting in this seat
            } else if (player.username === this.props.username) {
                let cards = player.hole_cards;
                // return face up hole cards
                return (
                    <div>
                        <img style={{ position: 'absolute', width: '100%', height: '80%', left: '0%' }} src={player.avatar} alt="" />
                        {renderCards(true, cards)}
                    </div>
                )
            // if someone else is sitting in this seat
            } else {
                // return face down hold cards
                return (
                    <div>
                        <img style={{ position: 'absolute', width: '100%', height: '80%', left: '0%' }} src={player.avatar} alt="" />
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
                        // <div>
                        //     empty <br />
                        //     <br />
                        // </div>
                        null
                    )
                // if we are not currently sitting at the table
                } else {
                    return (
                        <div style={{ position: 'absolute', top: '45%', width: '100%', fontSize: '1.2vw'}} >
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
                                    <Input style={{textAlign: 'centered'}} placeholder="Add chips" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                    <Button htmlType="button" onClick={this.cancel}>
                                        Cancel
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
                if (player.spotlight) {
                    playerBarStyle = { ...playerBarStyle, backgroundColor: 'darkGrey' }
                    if (player.username === this.props.username) {
                        let audio = new Audio(mp3_file);
                        audio.play();
                    }
                } else { playerBarStyle = { ...playerBarStyle, backgroundColor: 'lightGrey' }}

                // player is sitting out
                if (!player.reserved && player.sitting_out) {
                    return (
                        <div>
                            <div style={playerBarStyle}>
                                {player.username} <br />
                                {player.chips} <br />
                            </div>
                            Sitting out
                        </div>
                    )
                } else if (player.reserved) {
                    return (
                        <div style={playerBarStyle}>
                            Reserved <br />
                            <br />
                        </div>
                    )
                }
                
                // normal player in hand
                return (
                    <div style={playerBarStyle}>
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
                        <div style={{ position: 'absolute', width: '100%', height: '15%', backgroundColor: 'yellow' }}>
                            <div style={{ position: 'relative', textAlign: 'centered' }}>
                                Pot: {this.props.gameState.pot}
                            </div>
                        </div>
                        {/* <Card style={{height: '70px', width: '45px'}} /> */}
                    </div>
                )
            } else if (communityCards.length === 3) {
                return (
                    <div>
                        <div style={{ position: 'absolute', width: '100%', height: '15%', backgroundColor: 'yellow' }}>
                            <div style={{ position: 'relative', textAlign: 'centered' }}>
                                Pot: {this.props.gameState.pot}
                            </div>
                        </div>
                        {/* <Card style={{height: '70px', width: '45px'}} /> */}
                        <Card suit={communityCards[0].suit} face={communityCards[0].rank} style={{ ...communityCardsStyle, left: '0%' }} />
                        <Card suit={communityCards[1].suit} face={communityCards[1].rank} style={{ ...communityCardsStyle, left: '20%' }} />
                        <Card suit={communityCards[2].suit} face={communityCards[2].rank} style={{ ...communityCardsStyle, left: '40%' }} />
                    </div>
                )
            } else if (communityCards.length === 4) {
                return (
                    <div>
                        <div style={{ position: 'absolute', width: '100%', height: '15%', backgroundColor: 'yellow' }}>
                            <div style={{ position: 'relative', textAlign: 'centered' }}>
                                Pot: {this.props.gameState.pot}
                            </div>
                        </div>
                        {/* <Card style={{height: '70px', width: '45px'}} /> */}
                        <Card suit={communityCards[0].suit} face={communityCards[0].rank} style={{ ...communityCardsStyle, left: '0%' }} />
                        <Card suit={communityCards[1].suit} face={communityCards[1].rank} style={{ ...communityCardsStyle, left: '20%' }} />
                        <Card suit={communityCards[2].suit} face={communityCards[2].rank} style={{ ...communityCardsStyle, left: '40%' }} />
                        <Card suit={communityCards[3].suit} face={communityCards[3].rank} style={{ ...communityCardsStyle, left: '60%' }} />
                    </div>
                )
            } else if (communityCards.length === 5) {
                return (
                    <div>
                        <div style={{ position: 'absolute', width: '100%', height: '15%', backgroundColor: 'yellow' }}>
                            <div style={{ position: 'relative', textAlign: 'centered' }}>
                                Pot: {this.props.gameState.pot}
                            </div>
                        </div>
                        {/* <Card style={{height: '70px', width: '45px'}} /> */}
                        <Card suit={communityCards[0].suit} face={communityCards[0].rank} style={{ ...communityCardsStyle, left: '0%' }} />
                        <Card suit={communityCards[1].suit} face={communityCards[1].rank} style={{ ...communityCardsStyle, left: '20%' }} />
                        <Card suit={communityCards[2].suit} face={communityCards[2].rank} style={{ ...communityCardsStyle, left: '40%' }} />
                        <Card suit={communityCards[3].suit} face={communityCards[3].rank} style={{ ...communityCardsStyle, left: '60%' }} />
                        <Card suit={communityCards[4].suit} face={communityCards[4].rank} style={{ ...communityCardsStyle, left: '80%' }} />
                    </div>
                )
            }
        }
        return (
            <div>
            <div style={tableStyle}></div>
                <div style={{ ...playerAreaStyle, top: '-3%', left: '30%' }}>
                    {renderSeat(8)}
                    {renderPlayerBar(8)}
                </div>
                <div style={{ ...chipAreaStyle, top: '26%', left: '31.5%' }}>
                    <Chips gameState={this.props.gameState} seatId={8} />
                </div>
                <div style={{...playerAreaStyle, top: '15%', left: '5%'}}>
                    {renderSeat(7)}
                    {renderPlayerBar(7)}
                </div>
                <div style={{ ...chipAreaStyle, top: '44%', left: '7%' }}>
                    <Chips gameState={this.props.gameState} seatId={7} />
                </div>
                <div style={{...playerAreaStyle, top: '60%', left: '2%'}}>
                    {renderSeat(6)}
                    {renderPlayerBar(6)}
                </div>
                <div style={{ ...chipAreaStyle, top: '62%', left: '13%' }}>
                    <Chips gameState={this.props.gameState} seatId={6} />
                </div>
                <div  style={{...playerAreaStyle, top: '80%', left: '21%'}}>
                    {renderSeat(5)}
                    {renderPlayerBar(5)}
                </div>
                <div style={{ ...chipAreaStyle, top: '69%', left: '26%' }}>
                    <Chips gameState={this.props.gameState} seatId={5} />
                </div>
                <div  style={{...playerAreaStyle, top: '88%', left: '45%'}}>
                    {renderSeat(4)}
                    {renderPlayerBar(4)}
                </div>
                <div style={{ ...chipAreaStyle, top: '77%', left: '46.5%' }}>
                    <Chips gameState={this.props.gameState} seatId={4} />
                </div>
                <div style={{...playerAreaStyle, top: '80%', left: '69%'}}>
                    {renderSeat(3)}
                    {renderPlayerBar(3)}
                </div>
                <div style={{ ...chipAreaStyle, top: '69%', left: '67%' }}>
                    <Chips gameState={this.props.gameState} seatId={3} />
                </div>
                <div style={{...playerAreaStyle, top: '60%', left: '87%'}}>
                    {renderSeat(2)}
                    {renderPlayerBar(2)}
                </div>
                <div style={{ ...chipAreaStyle, top: '62%', left: '79%' }}>
                    <Chips gameState={this.props.gameState} seatId={2} />
                </div>
                <div style={{...playerAreaStyle, top: '15%', left: '85%'}}>
                    {renderSeat(1)}
                    {renderPlayerBar(1)}
                </div>
                <div style={{ ...chipAreaStyle, top: '44%', left: '86%' }}>
                    <Chips gameState={this.props.gameState} seatId={1} />
                </div>
                <div style={{...playerAreaStyle, left: '60%', top: '-3%'}}>
                    {renderSeat(0)}
                    {renderPlayerBar(0)}
                </div>
                <div style={{ ...chipAreaStyle, top: '26%', left: '61.5%' }}>
                    <Chips gameState={this.props.gameState} seatId={0} />
                </div>
                {/* community cards */}
                <div style={communityCardsAreaStyle}>
                    {renderCommunityCards()}
                    <CommunityChips gameState={this.props.gameState} />
                </div>
            </div>
        )
    }
}

export default Table;