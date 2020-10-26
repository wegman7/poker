import React, { Component } from 'react';
import axios from 'axios';
import { Menu } from 'antd';
import { withRouter } from 'react-router-dom';

// const { SubMenu } = Menu;

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

    rerouteToRoom = (room_name) => {
        this.props.initializeSocket(room_name);
        this.props.history.push('/room/');
    }

    render() {

        let listRooms = ' ';
        if (this.state.rooms !== undefined) {
            listRooms = this.state.rooms.map(room => 
                <Menu.Item key={room.id} onClick={() => this.rerouteToRoom(room.name)}>
                    {room.name}
                </Menu.Item>
            );
        }

        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                {/* <SubMenu key="1" title={<span>Rooms</span>}> */}
                    {listRooms}
                {/* </SubMenu> */}
            </Menu>
        )
    }
}

export default withRouter(SidePanel);