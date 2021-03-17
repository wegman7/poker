import { baseUrl } from './axios';

export class WebSocketChat {

    constructor(room_name) {
        this.room_name = room_name
        const path = 'ws://' + baseUrl.replace('http://', '') + 'ws/chat/' + this.room_name + '/';
        this.socket_ref = new WebSocket(path);

        this.socket_ref.onopen = this.onOpen.bind(this);
        this.socket_ref.onerror = this.onError.bind(this);
        this.socket_ref.onmessage = this.onMessage.bind(this);
        this.socket_ref.onclose = this.onClose.bind(this);
    }
    
    onOpen = (event) => {
        console.log('open', event);
    }
    onError = (error) => {
        console.log('error', error);
    }
    onMessage = (event) => {
        console.log('message', event);
        let data = JSON.parse(event.data);
        this.types[data.type](data);
    }
    onClose = (event) => {
        console.log('close', event);
    }
    returnReadyState = () => {
        return this.socket_ref.readyState;
    }

    addCallbacks = (renderMessages, addResponseMessageHandler) => {
        this.callbacks = {
            renderMessages: renderMessages,
            addResponseMessageHandler: addResponseMessageHandler
        }
        this.addTypes();
        this.fetchMessages();
    }

    addTypes = () => {
        this.types = {
            old_messages: this.callbacks.renderMessages,
            new_message: this.callbacks.addResponseMessageHandler
        }
    }

    newMessage = (newMessage) => {
        let message = {
            command: 'new_message',
            author: newMessage.from,
            content: newMessage.content
        }
        this.sendMessage(message);
    }

    fetchMessages = () => {
        let message = {
            command: 'fetch_messages',
            room_name: this.room_name
        }
        this.sendMessage(message);
    }

    sendMessage = (data) => {
        this.socket_ref.send(JSON.stringify(data));
    }

    disconnect = () => {
        let message = {
            command: 'disconnect'
        }
        this.sendMessage(message);
    }
}

export class WebSocketPoker {

    constructor(room_name) {
        this.room_name = room_name
        const path = 'ws://' + baseUrl.replace('http://', '') + 'ws/poker/' + this.room_name + '/';
        this.socket_ref = new WebSocket(path, ['access_token', localStorage.getItem('accessToken')]);

        this.socket_ref.onopen = this.onOpen.bind(this);
        this.socket_ref.onerror = this.onError.bind(this);
        this.socket_ref.onmessage = this.onMessage.bind(this);
        this.socket_ref.onclose = this.onClose.bind(this);
    }
    
    onOpen = (event) => {
        console.log('open', event);
        // this.fetchState();
    }
    onError = (error) => {
        console.log('error', error);
    }
    onMessage = (event) => {
        // console.log('message', event);
        let data = JSON.parse(event.data);
        this.updateState(data);
    }
    onClose = (event) => {
        console.log('close', event);
    }
    returnReadyState = () => {
        return this.socket_ref.readyState;
    }

    addCallbacks = (updateState) => {
        this.updateState = updateState;
    }

    fetchState = () => {
        console.log('fetch_state');
        let message = {
            command: 'fetch_state',
            room_name: this.room_name
        }
        this.sendMessage(message);
    }

    reserveSeat = (username, seatId) => {
        let message = {
            command: 'reserve',
            username: username,
            seatId: seatId
        }
        this.sendMessage(message);
    }

    sitPlayer = (username, seatId, chips, avatar) => {
        let message = {
            command: 'sit',
            username: username,
            seatId: seatId,
            chips: chips,
            avatar: avatar
        }
        this.sendMessage(message);
    }

    makeAction = (action, username, chips, chipsInPot) => {
        let message = {
            command: action,
            username: username,
            chips: chips,
            chipsInPot: chipsInPot
        }
        this.sendMessage(message);
    }

    addChips = (action, username, chips) => {
        let message = {
            command: action,
            username: username,
            chips: chips
        }
        this.sendMessage(message);
    }

    makeSitAction = (action, username) => {
        let message = {
            command: action,
            username: username
        }
        this.sendMessage(message);
    }

    sendMessage = (data) => {
        this.socket_ref.send(JSON.stringify(data));
    }

    disconnect = () => {
        let message = {
            command: 'disconnect'
        }
        this.sendMessage(message);
    }
}