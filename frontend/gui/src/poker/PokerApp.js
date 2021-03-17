import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

import NavbarPoker from './components/Navbar/index';
import Lobby from './components/Lobby/index';
import Room from './components/Room/index';
import Chat from './components/Chat/index';

const PokerRoutes = (props) => {
	const [gameStates, setGameStates] = useState({});

	return (
		<>
			<Route exact path='/'>
				<Redirect to='/lobby/' />
			</Route>
			<Route 
				path='/' 
				render={(routeProps) => 
				<NavbarPoker 
					{...routeProps} 
					gameStates={gameStates}
					setGameStates={setGameStates}
					user={props.user}
					setUser={props.setUser}
					pokerSockets={props.pokerSockets}
					setPokerSockets={props.setPokerSockets}
					setSelectedRoom={props.setSelectedRoom}
				/>} 
			/>
			<Route path='/lobby/' render={(routeProps) => 
				<Lobby 
					{...routeProps} 
					user={props.user} 
					chatSockets={props.chatSockets}
					setChatSockets={props.setChatSockets}
					pokerSockets={props.pokerSockets}
					setPokerSockets={props.setPokerSockets}
					setSelectedRoom={props.setSelectedRoom} 
				/>} 
			/>
			<Route 
				path='/room/' 
				render={(routeProps) => 
					<Room 
						{...routeProps} 
						roomName={props.selectedRoom} 
						gameStates={gameStates} 
						setGameStates={setGameStates} 
						pokerSockets={props.pokerSockets} 
						setPokerSockets={props.setPokerSockets} 
					/>} 
				/>
				{/* NEED TO CHANGE A LOT TO ROOM. I ONLY NEED TO PASS IN ONE GAMESTATE (GAMESTATES[PROPS.SELECTEDROOM], AND DON'T NEED POKER SOCKETS */}
		</>
	);
}

const PokerApp = (props) => {
	const [chatSockets, setChatSockets] = useState({});
	const [pokerSockets, setPokerSockets] = useState({});
	const [selectedRoom, setSelectedRoom] = useState('lobby');

	return (
		<>
			<PokerRoutes 
				user={props.user} 
				setUser={props.setUser}
				chatSockets={chatSockets}
				setChatSockets={setChatSockets}
				pokerSockets={pokerSockets}
				setPokerSockets={setPokerSockets}
				selectedRoom={selectedRoom}
				setSelectedRoom={setSelectedRoom}
			/>
			{selectedRoom === 'lobby'
			?
			null
			:
			<Chat 
				username={props.user.username}
				chatSockets={chatSockets}
				roomName={selectedRoom}
			/>}
		</>
	)
}

export default PokerApp;