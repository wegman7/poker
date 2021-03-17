import React, { useState, useEffect } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import axiosInstance, { baseUrl } from './utils/axios';

import Login from './unauthenticated/components/auth/Login';
import Signup from './unauthenticated/components/auth/Signup';
import HomeContainerPublic from './unauthenticated/components/Home/index';
import HomeContainerPrivate from './authenticated/components/Home/index';
import ChooseAvatar from './authenticated/components/profile/ChooseAvatar';
import ForgotPassword from './unauthenticated/components/auth/ForgotPassword';
import ResetPassword from './unauthenticated/components/auth/ResetPassword';
import ChangePassword from './authenticated/components/auth/ChangePassword';
import { userDetails } from './utils/apiCalls';
import createNotification from './utils/alerts';
import NavbarPublic from './unauthenticated/components/Navbar';
import NavbarPrivate from './authenticated/components/Navbar';
import PokerApp from './poker/PokerApp';

import './App.css';
import 'react-notifications/lib/notifications.css';

const PublicRoutes = (props) => {
	return (
		<>
			<Route exact path='/'>
				<Redirect to='/home/' />
			</Route>
			<Route path='/' render={(routeProps) => <NavbarPublic {...props} {...routeProps} />} />
			<Route exact path='/home/' render={(routeProps) => <HomeContainerPublic {...props} {...routeProps} />} />
			<Route exact path='/login/' render={(routeProps) => <Login {...props} {...routeProps} />} />
			<Route exact path='/signup/' component={Signup} />
			<Route exact path='/forgot-password/' component={ForgotPassword} />
			<Route exact path='/reset-password/' component={ResetPassword} />
		</>
	);
}

const PrivateRoutes = (props) => {
	return (
		<>
			<Route exact path='/'>
				<Redirect to='/home/' />
			</Route>
			<Route path='/' render={(routeProps) => <NavbarPrivate {...props} {...routeProps} />} />
			<Route exact path='/home/' render={(routeProps) => <HomeContainerPrivate {...props} {...routeProps} />} />
			<Route exact path='/change-password/' component={ChangePassword} />
			<Route exact path='/choose-avatar/' render={(routeProps) => <ChooseAvatar {...props} {...routeProps} />} />
		</>
	);
}

const App = (props) => {
	
	const [user, setUser] = useState({ username: null, avatarUrl: null, isAuthenticated: false, checkAuthentication: true, play: false, loading: true });

	const loadUser = () => {
		if (localStorage.getItem('refreshToken')) {
			setUser({ ...user, checkAuthentication: false, loading: true });
			userDetails()
				.then(response => {
					console.log(response);
					setUser({ 
						username: response.data.username, 
						avatarUrl: baseUrl + 'media/' + response.data.avatar, 
						isAuthenticated: true, 
						loading: false 
					});
				})
				.catch(error => {
					console.log(error);
					setUser({ 
						username: null, 
						avatarUrl: null, 
						isAuthenticated: false, 
						loading: false 
					});
				});
		} else {
			setUser({ 
				...user, 
				checkAuthentication: false, 
				loading: false 
			});
		}
	}

	useEffect(() => {
		if (user.checkAuthentication) {
			loadUser();
		}
	});
	
	const handleLogin = () => {
		loadUser();
		props.history.push('/');
	}

	const handleLogout = () => {
		localStorage.clear();
		axiosInstance.defaults.headers['Authorization'] = null;
		setUser({ ...user, username: null, avatarUrl: null, isAuthenticated: false })
		createNotification('info', 'You have been logged out.');
		props.history.push('/');
	}

	if (user.loading) {
		return(
			<>
				<CircularProgress />
				<NotificationContainer />
			</>
		)
	} else if (!user.isAuthenticated) {
		return (
			<>
				<PublicRoutes 
					handleLogin={handleLogin}
				/>
				<NotificationContainer />
			</>
		);
	} else if (user.isAuthenticated && !user.play) {
		return (
			<>
				<PrivateRoutes 
					handleLogout={handleLogout}
					user={user}
					setUser={setUser}
				/>
				<NotificationContainer />
			</>
		);
	} else if (user.isAuthenticated && user.play) {
		return (
			<>
				<PokerApp user={user} setUser={setUser} />
				<NotificationContainer />
			</>
		);
	}
}

export default withRouter(App);
