import React from 'react';

function Chips(props) {
    if (props.gameState === undefined) { return null; }

    let username = Object.keys(props.gameState.players).filter(player => props.gameState.players[player].seat_id === props.seatId)[0];
    if (username) {
        var player = props.gameState.players[username];
        var chipsInPot = player.chips_in_pot;
        var chipsInPotDisplay = chipsInPot;
        if (chipsInPotDisplay === 0) { chipsInPotDisplay = null }
    
        // convert chipsInPot to actual chips
        var redChipsTotal = parseInt(chipsInPot / 5);
        chipsInPot = chipsInPot % 5;
        var blueChipsTotal = parseInt(chipsInPot / 1);
        chipsInPot = chipsInPot % 1;
        var blackChipsTotal = parseInt(chipsInPot / .25);
    }

    const dealerChip = () => {
        if (player) {
            if (player.dealer) {
                return (
                    <div style={{ position: 'absolute', left: '110%' }} className="pokerchip flat dealer">Dealer</div>
                );
            }
        } else {
            return null;
        }
    }

    const redChips = () => {
        var chips = []
        var position = 0;
        for (let i = 0; i < redChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'vw', left: '0vw' }} className="pokerchip iso red" ></div>)
            position -= .55;
        }
        return (
            <div style={{ position: 'absolute'}} >
                {chips.map(thing => thing)}
            </div>
        )
    }

    const blueChips = () => {
        var chips = []
        var position = 0;
        for (let i = 0; i < blueChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'vw', left: '2.5vw' }} className="pokerchip iso blue" ></div>)
            position -= .55;
        }
        return (
            <div style={{ position: 'absolute'}} >
                {chips.map(thing => thing)}
            </div>
        )
    }

    const blackChips = () => {
        var chips = []
        var position = 0;
        for (let i = 0; i < blackChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'vw', left: '5vw' }} className="pokerchip iso" ></div>)
            position -= .55;
        }
        return (
            <div style={{ position: 'absolute'}} >
                {chips.map(thing => thing)}
            </div>
        )
    }
    
    return (
        <div>
            {dealerChip()}
            {redChips()}
            {blueChips()}
            {blackChips()}
            <div style={{ position: 'absolute', bottom: '0%', marginLeft: 'auto', marginRight: 'auto', left: '0', right: '0', textAlign: 'center', fontSize: '.8vw' }}>
                {
                    chipsInPotDisplay !== undefined && chipsInPotDisplay !== null && chipsInPotDisplay !== 0
                    ?
                    <span>${chipsInPotDisplay}</span>
                    :
                    null
                }
            </div>
        </div>
    );
}

export default Chips;