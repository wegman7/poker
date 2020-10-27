import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import { Card } from 'react-casino';
import mp3_file from '../assets/insight.mp3';

import Chips from './Chips';
import CommunityChips from './CommunityChips';

const tableBorderStyle = {
    position: 'absolute',
    backgroundColor: '#cc6600', 
    backgroundImage: 'linear-gradient(to right, #cc6600, #ffad33, #cc6600)',
    margin: '4.5% 3.5% 3% 3.5%',
    borderRadius: '50%',
    border: 'solid .1vw black',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0'
};
const tableStyle = {
    position: 'absolute',
    backgroundColor: 'green', 
    backgroundImage: 'linear-gradient(to bottom, green, #99ff99, green)',
    boxShadow: 'inset 0px 1px 50px #888',
    margin: '5% 5% 5% 5%',
    borderRadius: '50%',
    border: 'solid .06vw black',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0'
};
const playerAreaStyle = { 
    position: 'absolute', 
    // backgroundColor: 'blue', 
    width: '13%', 
    height: '40%' 
};
var playerBarStyle = { 
    backgroundColor: 'lightGrey', 
    // padding: '0', 
    textAlign: 'center', 
    position: 'absolute', 
    fontSize: '1.1vw',
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
    height: '4.7vw', 
    width: '3.8vw', 
    // top: '50%', 
    overflow: 'hidden'
}
const chipAreaStyle = { 
    position: 'absolute', 
    height: '10%', 
    width: '8%', 
    // backgroundColor: 'red' 
}
const communityCardsAreaStyle = { 
    position: 'absolute', 
    // backgroundColor: 'teal', 
    left: '35%', 
    top: '35%', 
    width: '30%',
    height: '35%'
}
const logoStyle = {
    position: 'absolute', 
    // backgroudColor: 'pink',
    top: '19%', 
    width: '100%',
    textAlign: 'center',
    fontSize: '3vw',
    // color: '#46427F'
    color: '#0f3e3e'
}

class Table extends Component {

    state = { displayLastAction: true }

    UNSAFE_componentWillReceiveProps(newProps) {
        // console.log(this.props.gameState, newProps);
        if (this.props.gameState !== undefined && newProps.gameState.time !== this.props.gameState.time) {
            setTimeout(() => this.setState({ displayLastAction: false }), 2000);
            this.setState({ 
                displayLastAction: true
            });
            if (newProps.gameState.players[this.props.username] && newProps.gameState.players[this.props.username].spotlight) { 
                let audio = new Audio(mp3_file);
                // audio.play();
            }
        }
    }
    
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
                    <div style={{ position: 'absolute', top: '52%', width: '100%', height: '48%' }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                            <Card suit={cards[0].suit} face={cards[0].rank} style={{ ...cardStyle, right: '49.5%' }} />
                            <Card suit={cards[1].suit} face={cards[1].rank}  style={{ ...cardStyle, left: '50.5%' }}  />
                        </div>
                    </div>
                )
            } else {
                return (
                    <div style={{ position: 'absolute', top: '52%', width: '100%', height: '48%' }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                            <Card suit='' face='' style={{ ...cardStyle, right: '49.5%' }} />
                            <Card suit='' face=''  style={{ ...cardStyle, left: '50.5%' }} />
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
            var opacity;
            if (player.sitting_out) { opacity = '.6' } else { opacity = '1' }
            // if we are drawing for the dealer chip
            if (this.props.gameState.draw_for_dealer) {
                return (
                    <div>
                        <img style={{ position: 'absolute', width: '100%', height: '80%', opacity: opacity }} src={player.avatar} alt="" />
                        {renderCards(true, cards)}
                    </div>
                )
            // return face or down depending on if this is our seat, and if we are showing down
            } else {
                let cards = player.hole_cards;
                var showCards;
                if (player.username === this.props.username || this.props.gameState.show_hands) {
                    showCards = true;
                } else {
                    showCards = false;
                }
                return (
                    <div>
                        {
                            player.avatar !== undefined
                            ?
                            <img style={{ position: 'absolute', width: '100%', height: '78%', left: '0%', opacity: opacity }} src={player.avatar} alt="" />
                            :
                            null
                        }
                        {renderCards(showCards, cards)}
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
                        <div style={{ position: 'absolute', top: '45%', width: '100%', fontSize: '1.2vw', color: 'black' }} >
                            <button className="button" onClick={() => this.props.reserveSeat(seatId)}>Click to sit</button>
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
                    // playerBarStyle = { ...playerBarStyle, background: 'linear-gradient(to bottom, #f2f2f2 5%, #a6a6a6 100%)', color: 'black', animation: 'blinker 1s linear infinite' }
                    playerBarStyle = { ...playerBarStyle, background: 'linear-gradient(to bottom, #f2f2f2 5%, #a6a6a6 100%)', color: 'black' }
                } else { playerBarStyle = { ...playerBarStyle, background: 'linear-gradient(to bottom, #8c8c8c 5%, #404040 100%)', color: 'white', animation: 'none' }}

                // player is sitting out
                if (!player.reserved && player.sitting_out) {
                    return (
                        <div>
                            <div className="player-bar" style={playerBarStyle}>
                                {player.username} <br />
                                {player.chips} <br />
                            </div>
                            <div style={{ position: 'absolute', fontSize: '.8vw', width: '100%', top: '100%' }}>
                                Sitting out
                            </div>
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

                var username;
                if (player.username === this.props.gameState.last_action_username && this.state.displayLastAction) {
                    username = this.props.gameState.last_action;
                } else {
                    username = player.username;
                }
                
                // normal player in hand
                return (
                    // <div className="blink_me" style={playerBarStyle}>
                    <div className="player-bar" style={playerBarStyle}>
                        {username} <br />
                        {
                            player.in_hand && player.chips === 0
                            ?
                            <span>All in <br /></span>
                            :
                            <span>${player.chips} <br /></span>
                        }
                        {/* ${player.chips} <br /> */}
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
                        <div style={{ position: 'absolute', width: '100%', height: '15%', /* backgroundColor: 'yellow' */ }}>
                            <div style={{ position: 'relative', textAlign: 'centered' }}>
                                Pot: ${this.props.gameState.pot}
                            </div>
                        </div>
                        {/* <Card style={{height: '70px', width: '45px'}} /> */}
                    </div>
                )
            } else if (communityCards.length === 3) {
                return (
                    <div>
                        <div style={{ position: 'absolute', width: '100%', height: '15%', /* backgroundColor: 'yellow' */ }}>
                            <div style={{ position: 'relative', textAlign: 'centered' }}>
                                Pot: ${this.props.gameState.pot}
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
                        <div style={{ position: 'absolute', width: '100%', height: '15%', /* backgroundColor: 'yellow' */ }}>
                            <div style={{ position: 'relative', textAlign: 'centered' }}>
                                Pot: ${this.props.gameState.pot}
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
                        <div style={{ position: 'absolute', width: '100%', height: '15%', /* backgroundColor: 'yellow' */ }}>
                            <div style={{ position: 'relative', textAlign: 'centered' }}>
                                Pot: ${this.props.gameState.pot}
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
                <div style={tableBorderStyle}></div>
                <div style={tableStyle}></div>

                {/* seat 8 */}
                <div style={{ ...playerAreaStyle, top: '-17%', left: '30%' }}>
                    {renderSeat(8)}
                    {renderPlayerBar(8)}
                </div>
                <div style={{ ...chipAreaStyle, top: '24%', left: '32.5%' }}>
                    <Chips gameState={this.props.gameState} seatId={8} />
                </div>

                {/* seat 7 */}
                <div style={{...playerAreaStyle, top: '-5%', left: '2%'}}>
                    {renderSeat(7)}
                    {renderPlayerBar(7)}
                </div>
                <div style={{ ...chipAreaStyle, top: '36%', left: '11%' }}>
                    <Chips gameState={this.props.gameState} seatId={7} />
                </div>

                {/* seat 6 */}
                <div style={{...playerAreaStyle, top: '49%', left: '0%'}}>
                    {renderSeat(6)}
                    {renderPlayerBar(6)}
                </div>
                <div style={{ ...chipAreaStyle, top: '58%', left: '14%' }}>
                    <Chips gameState={this.props.gameState} seatId={6} />
                </div>

                {/* seat 5 */}
                <div  style={{...playerAreaStyle, top: '80%', left: '19%'}}>
                    {renderSeat(5)}
                    {renderPlayerBar(5)}
                </div>
                <div style={{ ...chipAreaStyle, top: '70%', left: '29%' }}>
                    <Chips gameState={this.props.gameState} seatId={5} />
                </div>

                {/* seat 4 */}
                <div  style={{...playerAreaStyle, top: '88%', left: '43.55%'}}>
                    {renderSeat(4)}
                    {renderPlayerBar(4)}
                </div>
                <div style={{ ...chipAreaStyle, top: '77%', left: '46.1%' }}>
                    <Chips gameState={this.props.gameState} seatId={4} />
                </div>

                {/* seat 3 */}
                <div style={{...playerAreaStyle, top: '80%', left: '68%'}}>
                    {renderSeat(3)}
                    {renderPlayerBar(3)}
                </div>
                <div style={{ ...chipAreaStyle, top: '70%', left: '64%' }}>
                    <Chips gameState={this.props.gameState} seatId={3} />
                </div>

                {/* seat 2 */}
                <div style={{...playerAreaStyle, top: '49%', left: '87%'}}>
                    {renderSeat(2)}
                    {renderPlayerBar(2)}
                </div>
                <div style={{ ...chipAreaStyle, top: '58%', left: '78%' }}>
                    <Chips gameState={this.props.gameState} seatId={2} />
                </div>

                {/* seat 1 */}
                <div style={{...playerAreaStyle, top: '-5%', left: '85%'}}>
                    {renderSeat(1)}
                    {renderPlayerBar(1)}
                </div>
                <div style={{ ...chipAreaStyle, top: '36%', left: '82%' }}>
                    <Chips gameState={this.props.gameState} seatId={1} />
                </div>

                {/* seat 0 */}
                <div style={{...playerAreaStyle, left: '60%', top: '-17%'}}>
                    {renderSeat(0)}
                    {renderPlayerBar(0)}
                </div>
                <div style={{ ...chipAreaStyle, top: '24%', left: '62.5%' }}>
                    <Chips gameState={this.props.gameState} seatId={0} />
                </div>

                {/* community cards */}
                <div style={communityCardsAreaStyle}>
                    <div className="logo" style={logoStyle}>
                        Wegman's Cardroom
                    </div>
                    {renderCommunityCards()}
                    <CommunityChips gameState={this.props.gameState} />
                </div>
            </div>
        )
    }
}

export default Table;