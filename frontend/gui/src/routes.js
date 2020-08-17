import React from 'react';
import { Route } from 'react-router-dom';

import Login from './containers/Login';
import Signup from './containers/Signup';
import Home from './containers/Home';
import Room from './containers/Room';
import ChooseAvatar from './containers/ChooseAvatar';

const BaseRouter = (props) => (
    
    <div>
        <Route exact path='/' component={Home} />
        <Route exact path='/login/' component={Login} />
        <Route exact path='/signup/' component={Signup} />
        <Route exact path='/room/' render={(routeProps) => <Room {...props} {...routeProps} />} />
        <Route exact path='/choose-avatar/' render={(routeProps) => <ChooseAvatar {...props} {...routeProps} />} />
    </div>
);

export default BaseRouter;