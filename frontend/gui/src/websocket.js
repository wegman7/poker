const url = '127.0.0.1:8000';

export default class WebSocketChat {

    constructor(room_id) {
        this.room_id = room_id
        const path = 'ws://' + url + '/ws/chat/' + this.room_id + '/';
        this.socket_ref = new WebSocket(path);

        this.socket_ref.onopen = this.onOpen.bind(this);
        this.socket_ref.onerror = this.onError.bind(this);
        this.socket_ref.onmessage = this.onMessage.bind(this);
        this.socket_ref.onclose = this.onClose.bind(this);
    }
    
    onOpen = (event) => {
        console.log('open', event);
        this.fetchMessages();
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
            room_id: this.room_id
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

    constructor(room_id) {
        this.room_id = room_id
        const path = 'ws://' + url + '/ws/poker/' + this.room_id + '/';
        this.socket_ref = new WebSocket(path);

        this.socket_ref.onopen = this.onOpen.bind(this);
        this.socket_ref.onerror = this.onError.bind(this);
        this.socket_ref.onmessage = this.onMessage.bind(this);
        this.socket_ref.onclose = this.onClose.bind(this);
    }
    
    onOpen = (event) => {
        console.log('open', event);
        this.fetchState();
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

    addCallbacks = (updateState, seatReserved) => {
        this.callbacks = {
            updateState: updateState,
            seatReserved: seatReserved
        }
        this.addTypes();
    }

    addTypes = () => {
        this.types = {
            state: this.callbacks.updateState,
            seatReserved: this.callbacks.seatReserved
        }
    }

    fetchState = () => {
        console.log('fetch_state');
        let message = {
            command: 'fetch_state',
            room_id: this.room_id
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