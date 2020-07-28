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
                    <div style={{ position: 'absolute', top: '20px', left: '170px' }} class="pokerchip flat dealer">Dealer</div>
                );
            }
        } else {
            return null;
        }
    }

    const redChips = () => {
        var chips = []
        var position = 20;
        for (let i = 0; i < redChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'px', left: '68px' }} className="pokerchip iso red" ></div>)
            position -= 6;
        }
        return (
            <div style={{ position: 'relative'}} >
                {chips.map(thing => thing)}
            </div>
        )
    }

    const blueChips = () => {
        var chips = []
        var position = 20;
        for (let i = 0; i < blueChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'px', left: '98px' }} className="pokerchip iso blue" ></div>)
            position -= 6;
        }
        return (
            <div style={{ position: 'relative'}} >
                {chips.map(thing => thing)}
            </div>
        )
    }

    const blackChips = () => {
        var chips = []
        var position = 20;
        for (let i = 0; i < blackChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'px', left: '128px' }} className="pokerchip iso" ></div>)
            position -= 6;
        }
        return (
            <div style={{ position: 'relative'}} >
                {chips.map(thing => thing)}
            </div>
        )
    }
    
    return (
        <div style={{ height: '40px' }}>
            <div style={{ position: 'relative'}}>
                {dealerChip()}
                {redChips()}
                {blueChips()}
                {blackChips()}
                <div style={{ position: 'absolute', top: '45px', marginLeft: 'auto', marginRight: 'auto', left: '0', right: '0', textAlign: 'center' }}>
                    {chipsInPotDisplay}
                </div>
            </div>
        </div>
    );
}

export default Chips;