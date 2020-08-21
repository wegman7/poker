import React, { Component } from 'react';

const sitBarContainerStyle = {
    position: 'absolute', 
    height: '22%', 
    width: '27%', 
    top: '94.5%', 
    left: '0%', 
    // backgroundColor: 'red' 
}
const sitOutStyle = {
    position: 'absolute',
    width: '33.3%',
    height: '33.3%',
    bottom: '0%',
    left: '0%',
    fontSize: '1.05vw'
}
const sitInStyle = {
    position: 'absolute',
    width: '33.3%',
    height: '33.3%',
    bottom: '0%',
    left: '0%',
    fontSize: '1.05vw'
}
const standUpStyle = {
    position: 'absolute',
    width: '33.3%',
    height: '33.3%',
    bottom: '0%',
    left: '33.3%',
    fontSize: '1.05vw'
}
const addChipsStyle = {
    position: 'absolute',
    width: '33.3%',
    height: '33.3%',
    bottom: '0%',
    left: '66.7%',
    fontSize: '1.05vw'
}
const addChipsFormContainer = {
    position: 'absolute',
    width: '33.3%',
    height: '66.7%',
    left: '66.7%',
    fontSize: '1.05vw',
    // backgroundColor: 'orange'
}
const addChipsAmountStyle = {
    position: 'absolute',
    width: '100%',
    height: '50%'
}
const submitAddChipsStyle = {
    position: 'absolute',
    width: '50%',
    height: '50%',
    left: '50%',
    top: '50%'
}
const cancelAddChipsStyle = {
    position: 'absolute',
    width: '50%',
    height: '50%',
    left: '0%',
    top: '50%'
}

class SitBar extends Component {
    
    state = {}

    componentDidMount() {
        this.setState({
            renderAddChipsForm: false
        });
    }

    sitIn = (makeSitAction, username) => {
        makeSitAction('sit_in', username);
    }
    
    sitOut = (makeSitAction, username) => {
        makeSitAction('sit_out', username);
    }
    
    standUp = (makeSitAction, username) => {
        makeSitAction('stand_up', username);
    }
    
    addChips = (addChips, username) => (event) => {
        event.preventDefault();
        let chips = event.target.chips.value;
        if (chips > 0 && parseFloat(chips) !== undefined) {
            addChips('add_chips', username, chips);
            this.setState({
                renderAddChipsForm: false
            })
        } else {
            alert('Invalid amount!');
        }
    }
    
    render() {
        if (this.props.gameState === undefined) { return null; }

        const sittingIn = () => {
            let myPlayer = this.props.gameState.players[this.props.username];
            if (myPlayer === undefined || myPlayer.reserved) { return null; }

            let sitInColor;
            let sitOutColor;
            let standUpColor;
            if (myPlayer.sit_in_after_hand) {
                sitInColor = 'darkgrey';
            } else { sitInColor = 'whiteSmoke'; }
            if (myPlayer.sit_out_after_hand) {
                sitOutColor = 'darkgrey';
            } else { sitOutColor = 'whiteSmoke'; }
            if (myPlayer.stand_up_after_hand) {
                standUpColor = 'darkgrey';
            } else { standUpColor = 'whiteSmoke'; }
            
            if (myPlayer.sitting_out) {
                return (
                    <div>
                        <button style={{ ...sitInStyle, backgroundColor: sitInColor }} onClick={() => this.sitIn(this.props.makeSitAction, this.props.username)}>Sit in</button>
                        <button style={{ ...standUpStyle, backgroundColor: standUpColor }} onClick={() => this.standUp(this.props.makeSitAction, this.props.username)}>Stand up</button>
                        <button style={{ ...addChipsStyle, backgroundColor: sitInColor}} onClick={() => this.setState({renderAddChipsForm: true})}>Add chips</button>
                        {addChipsForm()}
                    </div>
                )
            } else {
                return (
                    <div>
                        <button style={{ ...sitOutStyle, backgroundColor: sitOutColor }} onClick={() => this.sitOut(this.props.makeSitAction, this.props.username)}>Sit out</button>
                        <button style={{ ...standUpStyle, backgroundColor: standUpColor }} onClick={() => this.standUp(this.props.makeSitAction, this.props.username)}>Stand up</button>
                        <button style={{ ...addChipsStyle, backgroundColor: sitInColor }} onClick={() => this.setState({renderAddChipsForm: true})}>Add chips</button>
                        {addChipsForm()}
                    </div>
                );
            }
        }
    
        const addChipsForm = () => {
            if (this.state.renderAddChipsForm) {
                return (
                    <form style={addChipsFormContainer} onSubmit={this.addChips(this.props.addChips, this.props.username)}>
                        <input style={addChipsAmountStyle} type="text" name="chips" placeholder="Amount" />
                        <input style={submitAddChipsStyle} type="submit" value="Confirm" />
                        <input style={cancelAddChipsStyle} type="button" onClick={() => this.setState({renderAddChipsForm: false})} value="Cancel" />
                    </form>
                );
            } else {
                return null;
            }
        }

        return (
            <div style={sitBarContainerStyle}>
                {sittingIn()}
            </div>
        )
    }
}

export default SitBar;