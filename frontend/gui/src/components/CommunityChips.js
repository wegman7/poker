import React from 'react';

function CommunityChips(props) {
    if (props.gameState === undefined) { return null; }

    const players = Object.keys(props.gameState.players);
    var total = 0;
    for (const player of players) {
        if (props.gameState.players[player].chips_in_pot !== undefined) {
            total += props.gameState.players[player].chips_in_pot;
        }
    }
    var chipsInPot = props.gameState.pot - total;
    var chipsInPotDisplay = chipsInPot;
    if (chipsInPotDisplay === 0) { chipsInPotDisplay = null }

    // convert chipsInPot to actual chips
    var redChipsTotal = parseInt(chipsInPot / 5);
    chipsInPot = chipsInPot % 5;
    var blueChipsTotal = parseInt(chipsInPot / 1);
    chipsInPot = chipsInPot % 1;
    var blackChipsTotal = parseInt(chipsInPot / .25);

    const redChips = () => {
        var chips = []
        var position = 30;
        for (let i = 0; i < redChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'px', left: '67px' }} className="pokerchip iso red" ></div>)
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
        var position = 30;
        for (let i = 0; i < blueChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'px', left: '97px' }} className="pokerchip iso blue" ></div>)
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
        var position = 30;
        for (let i = 0; i < blackChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'px', left: '127px' }} className="pokerchip iso" ></div>)
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
                {redChips()}
                {blueChips()}
                {blackChips()}
                <div style={{ position: 'absolute', top: '55px', left: '99px' }}>
                    {chipsInPotDisplay}
                </div>
            </div>
        </div>
    );
}

export default CommunityChips;