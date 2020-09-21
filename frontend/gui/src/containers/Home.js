import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {

    render() {
        return (
            <div style={{ position: 'absolute', width: '100%', height: '100%', left: '0', top: '60px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: '100%', height: '130%', left: '0', top: '60px', margin: '-160px 0 0 0', background: `url('https://sourceoneevents.com/wp-content/uploads/2018/07/las-vegas-wallpapers-high-definition-On-High-Resolution-Wallpaper.jpg') center center`, backgroundSize: 'auto 90%', backgroundRepeat: 'no-repeat' }}></div>
                <div style={{ position: 'relative', fontSize: '30px', width: '85%', height: '65%', left: '7.5%', top: '130px', backgroundColor: '#f2f2f2' }}>
                    {
                        this.props.isAuthenticated
                        ?
                        <div style={{ padding: '50px' }}>
                            Click on the room to the right to connect.
                        </div>
                        :
                        <div style={{ padding: '50px' }}>
                            Welcome to <span className="logo">Wegman's Cardroom</span>! <Link to="/signup/">Create an account</Link> to get started.
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Home;