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
    if (chipsInPotDisplay === 0 || props.gameState.pot === 0) { chipsInPotDisplay = null }

    // convert chipsInPot to actual chips
    var redChipsTotal = parseInt(chipsInPot / 5);
    chipsInPot = chipsInPot % 5;
    var blueChipsTotal = parseInt(chipsInPot / 1);
    chipsInPot = chipsInPot % 1;
    var blackChipsTotal = parseInt(chipsInPot / .25);

    const redChips = () => {
        var chips = []
        var position = 10;
        for (let i = 0; i < redChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'vw', left: '8.75vw' }} className="pokerchip iso red" ></div>)
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
        var position = 10;
        for (let i = 0; i < blueChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'vw', left: '11.75vw' }} className="pokerchip iso blue" ></div>)
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
        var position = 10;
        for (let i = 0; i < blackChipsTotal; i++) {
            chips.push(<div style={{ position: 'absolute', top: position.toString() + 'vw', left: '14.75vw' }} className="pokerchip iso" ></div>)
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
            {redChips()}
            {blueChips()}
            {blackChips()}
            <div style={{ position: 'absolute', bottom: '0%', left: '0%', width: '100%', height: '15%', /* backgroundColor: 'orange' */ }}>
                <div style={{ position: 'relative', textAlign: 'centered' }}>
                    {chipsInPotDisplay}
                </div>
            </div>
        </div>
    );
}

export default CommunityChips;