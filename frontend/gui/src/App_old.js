import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';

import BaseRouter from './routes';
import * as actions from './store/actions/auth';
import Chat from './containers/Chat';
import Navbar from './components/Navbar';
import SidePanel from './containers/SidePanel';
import WebSocketChat, { WebSocketPoker } from './websocket';

import 'antd/dist/antd.css';
import './App.css';

class App extends Component {

  state = {};

  componentDidMount() {
    console.log('inside componentDidMount (App.js)')
    this.props.authCheckState();
    this.setState({
      chatSocket: null,
      pokerSocket: null,
      renderChat: false
    })
  }

  componentDidUpdate() {
    this.props.authCheckState();
    console.log('inside componentDidUpdate (App.js)')
  }

  initializeSocket = (room_name) => {
    this.disconnectFromSocket();
    let chatSocket = new WebSocketChat(room_name);
    let pokerSocket = new WebSocketPoker(room_name)
    this.setState({
      chatSocket: chatSocket,
      pokerSocket: pokerSocket,
      renderChat: true
    });
  }

  disconnectFromSocket = () => {
    if (this.state.chatSocket !== null && this.state.pokerSocket) {
      this.state.chatSocket.disconnect();
      this.state.pokerSocket.disconnect();
    }
    this.setState({
      chatSocket: null,
      pokerSocket: null,
      renderChat: false
    });
  }

  render() {

    return (
        <Router>
          <Navbar {...this.props} initializeSocket={this.initializeSocket} disconnectFromSocket={this.disconnectFromSocket} />
            {
              this.props.isAuthenticated
              ?
              <div style={{ position: 'absolute', right: '0px', /* top: '10px', */ zIndex: '1' }} >
                  <SidePanel {...this.props} initializeSocket={this.initializeSocket} />
              </div>
              :
              <div></div>
            }
            <BaseRouter {...this.props} pokerSocket={this.state.pokerSocket} />
          {
            this.state.renderChat
            ?
            <Chat {...this.props} chatSocket={this.state.chatSocket} pokerSocket={this.state.pokerSocket} />
            :
            <div></div>
          }
        </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.token,
    isAuthenticated: state.token !== null,
    username: state.username
  }
}

const mapDispatchToProps = dispatch => {
  return {
    authCheckState: () => dispatch(actions.authCheckState()),
    logout: () => dispatch(actions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);