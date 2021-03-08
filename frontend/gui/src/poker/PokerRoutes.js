import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

import NavbarPoker from './components/Navbar/index';
import Lobby from './components/Lobby/index';
import Room from './components/Room/index';

const PokerRoutes = (props) => {

  const [selectedRoom, setSelectedRoom] = useState(null);
	const [gameStates, setGameStates] = useState({});
	const [pokerSockets, setPokerSockets] = useState({});

	return (
		<>
			<Route exact path='/'>
				<Redirect to='/lobby/' />
			</Route>
			<Route 
				path='/' 
				render={(routeProps) => 
				<NavbarPoker 
					{...props} 
					{...routeProps} 
					gameStates={gameStates}
					setGameStates={setGameStates}
					pokerSockets={pokerSockets}
					setPokerSockets={setPokerSockets}
				/>} 
			/>
			<Route path='/lobby/' render={(routeProps) => <Lobby {...props} {...routeProps} setSelectedRoom={setSelectedRoom} />} />
			<Route 
				path='/room/' 
				render={(routeProps) => 
					<Room 
						{...props} 
						{...routeProps} 
						roomName={selectedRoom} 
						gameStates={gameStates} 
						setGameStates={setGameStates} 
						pokerSockets={pokerSockets} 
						setPokerSockets={setPokerSockets} 
					/>} 
				/>
		</>
	);
}

export default PokerRoutes;
