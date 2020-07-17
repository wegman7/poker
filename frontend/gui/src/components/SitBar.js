import React, { Component } from 'react';

class SitBar extends Component {
    
    state = {}

    componentDidMount() {
        this.setState({
            renderAddChipsForm: false
        });
    }

    sitIn = (makeSitAction, username) => {
        console.log('sit_in');
        makeSitAction('sit_in', username);
    }
    
    sitOut = (makeSitAction, username) => {
        console.log('sit_out');
        makeSitAction('sit_out', username);
    }
    
    standUp = (makeSitAction, username) => {
        console.log('stand_up');
        makeSitAction('stand_up', username);
    }
    
    addChips = (addChips, username) => (event) => {
        event.preventDefault();
        console.log('add_chips', event.target.chips.value);
        let chips = event.target.chips.value;
        addChips('add_chips', username, chips);
        this.setState({
            renderAddChipsForm: false
        })
    }
    
    render() {
        if (this.props.gameState === undefined) { return null; }
        console.log(this.props.gameState);

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
                        <button style={{backgroundColor: sitInColor}} onClick={() => this.sitIn(this.props.makeSitAction, this.props.username)}>Sit in</button>
                        <button style={{backgroundColor: standUpColor}} onClick={() => this.standUp(this.props.makeSitAction, this.props.username)}>Stand up</button>
                        <button style={{backgroundColor: sitInColor}} onClick={() => this.setState({renderAddChipsForm: true})}>Add chips</button>
                        {addChipsForm()}
                    </div>
                )
            } else {
                return (
                    <div>
                        <button style={{backgroundColor: sitOutColor}} onClick={() => this.sitOut(this.props.makeSitAction, this.props.username)}>Sit out</button>
                        <button style={{backgroundColor: standUpColor}} onClick={() => this.standUp(this.props.makeSitAction, this.props.username)}>Stand up</button>
                        <button style={{backgroundColor: sitInColor}} onClick={() => this.setState({renderAddChipsForm: true})}>Add chips</button>
                        {addChipsForm()}
                    </div>
                );
            }
        }
    
        const addChipsForm = () => {
            if (this.state.renderAddChipsForm) {
                return (
                    <div>
                        <form onSubmit={this.addChips(this.props.addChips, this.props.username)}>
                            <input type="text" name="chips" placeholder="Amount" />
                            <input type="submit" value="Confirm" />
                        </form>
                        <button 
                            onClick={() => this.setState({renderAddChipsForm: false})}>Cancel
                        </button>
                    </div>
                );
            } else {
                return null;
            }
        }

        return (
            <div>
                {sittingIn()}
            </div>
        )
    }
}

export default SitBar;