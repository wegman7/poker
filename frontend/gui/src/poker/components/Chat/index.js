import React, { useEffect, useCallback } from 'react';
import { Widget, addResponseMessage, addUserMessage, dropMessages } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

const Chat = (props) => {

	const { roomName, chatSockets, username } = props;

	const renderMessages = useCallback((data) => {
			console.log('inside renderMessages');
			let messages = data.messages;
			const currentUser = username;
			if (messages === undefined) { return; }
			for (let i = 0; i < messages.length; i++) {
					if (currentUser === messages[i]['author']) {
							addUserMessage(messages[i]['content']);
					} else {
							addResponseMessage(messages[i]['content']);
					}
			}
	}, [username]);

	const sendMessageHandler = (message_text) => {
			let author = props.username;
			const messageObject = {
					from: author,
					content: message_text
			}
			console.log(messageObject);
			props.chatSocket.newMessage(messageObject);
	}

	const addResponseMessageHandler = useCallback((data) => {
			let message = JSON.parse(data.message)
			console.log(message);
			if (message.author !== username) {
					addResponseMessage(message.author + ': ' + message.content);
			}
	}, [username]);

	const handleNewUserMessage = (newMessage) => {
			console.log(`New message incoming! ${newMessage}`);
			// Now send the message throught the backend API
			sendMessageHandler(newMessage);
	}
  
  useEffect(() => {
		dropMessages();
		setTimeout(() => { chatSockets[roomName].addCallbacks(renderMessages, addResponseMessageHandler) }, 100);
	}, [roomName, chatSockets, renderMessages, addResponseMessageHandler]);
	
  return (
    <div className="App">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
				// profileAvatar={localStorage.getItem('avatar')}
        titleAvatar={localStorage.getItem('avatar')}
        title={props.username}
        subtitle=""
      />
    </div>
  );
}

export default Chat;
