import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

function Navbar(props) {

    const buttonClicked = () => {
        props.logout();
        props.disconnectFromSocket();
    }

    return (
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
            {
                props.isAuthenticated
                ?
                <Menu.Item key="2"><Link to="/choose-avatar/">Change avatar</Link></Menu.Item>
                :
                null
            }
            {
                props.isAuthenticated
                ?
                <Menu.Item key="3" onClick={buttonClicked}>Logout</Menu.Item>
                :
                <Menu.Item key="3"><Link to="/login/">Login</Link></Menu.Item>
            }
        </Menu>
    )
}

export default Navbar;