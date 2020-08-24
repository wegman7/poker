import React, { Component } from 'react';
import { Widget, addResponseMessage, addUserMessage, dropMessages } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

class Chat extends Component {

    state = {}

    componentDidMount() {
        this.props.chatSocket.addCallbacks(this.renderMessages, this.addResponseMessageHandler);
    }

    componentDidUpdate() {
        this.props.chatSocket.addCallbacks(this.renderMessages, this.addResponseMessageHandler);
        dropMessages();
    }

    renderMessages = (data) => {
        console.log('inside renderMessages');
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

    sendMessageHandler = (message_text) => {
        console.log(localStorage.getItem('avatar'));
        let author = this.props.username;
        const messageObject = {
            from: author,
            content: message_text
        }
        console.log(messageObject);
        this.props.chatSocket.newMessage(messageObject);
    }

    addResponseMessageHandler = (data) => {
        let message = JSON.parse(data.message)
        console.log(message);
        if (message.author !== this.props.username) {
            addResponseMessage(message.author + ': ' + message.content);
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
                    // profileAvatar={localStorage.getItem('avatar')}
                    titleAvatar={localStorage.getItem('avatar')}
                    title={this.props.username}
                    subtitle=""
                />
            </div>
        );
    }
}

export default Chat;