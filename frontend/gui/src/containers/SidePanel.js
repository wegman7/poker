import React, { Component } from 'react';
import axios from 'axios';
import { Menu } from 'antd';
import { withRouter } from 'react-router-dom';

class SidePanel extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.grabFromAPI = this.grabFromAPI.bind(this);
    }

    componentDidMount() {
        this.grabFromAPI();
    }

    grabFromAPI() {
        if (this.props.token) {
            axios.get('/api/room/', {
                headers: {
                    Authorization: `Token ${this.props.token}`
                }
            })
                .then(response => {
                    this.setState({
                        'rooms': response.data
                    });
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    rerouteToRoom = (room_id) => {
        this.props.initializeSocket(room_id);
        this.props.history.push('/room/');
    }

    render() {

        let listRooms = ' ';
        if (this.state.rooms !== undefined) {
            listRooms = this.state.rooms.map(room => 
                <Menu.Item key={room.id} onClick={() => this.rerouteToRoom(room.id)}>
                    {room.name}
                </Menu.Item>
            );
        }

        return (
            <div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    {listRooms}
                </Menu>
            </div>
        )
    }
}

export default withRouter(SidePanel);