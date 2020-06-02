import React, { Component } from 'react';
import { Widget, addResponseMessage, addUserMessage, dropMessages } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

class Chat extends Component {

    state = {}

    componentDidMount() {
        this.props.socket.addCallbacks(this.renderMessages, this.addResponseMessageHandler);
    }

    componentDidUpdate() {
        this.props.socket.addCallbacks(this.renderMessages, this.addResponseMessageHandler);
        dropMessages();
    }

    renderMessages = (data) => {
        let messages = data.messages
        const currentUser = this.props.username;
        if (messages === undefined) { return; }
        for (let i = 0; i < messages.length; i++) {
            if (currentUser === messages[i]['author']) {
                addUserMessage(messages[i]['content']);
            } else {
                addResponseMessage(messages[i]['content']);
            }
        }
    }

    sendMessageHandler(message_text) {
        const author = this.props.username;
        const messageObject = {
            from: author,
            content: message_text
        }
        this.props.socket.newMessage(messageObject);
    }

    addResponseMessageHandler = (data) => {
        let message = JSON.parse(data.message)
        if (message.author !== this.props.username) {
            addResponseMessage(message.content);
        }
    }

    handleNewUserMessage = (newMessage) => {
        console.log(`New message incoming! ${newMessage}`);
        // Now send the message throught the backend API
        this.sendMessageHandler(newMessage);
    }
    
    render() {

        return (
            <div className="App">
                <Widget
                    handleNewUserMessage={this.handleNewUserMessage}
                />
            </div>
        );
    }
}

export default Chat;