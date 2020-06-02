import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../store/actions/auth';

class Signup extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    handleSubmit(event) {
        const username = event.target.username.value;
        const email = event.target.email.value;
        const password1 = event.target.password1.value;
        const password2 = event.target.password2.value;
        this.props.onAuth(username, email, password1, password2);
        event.preventDefault();
    }

    render() {

        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }
        
        return (
            <div>

                {errorMessage}

                {
                    
                    this.props.loading ?

                    <div>LOADING</div>

                    :

                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name="username" placeholder="username" />
                        <input type="text" name="email" placeholder="email" />
                        <input type="password" name="password1" placeholder="password" />
                        <input type="password" name="password2" placeholder="confirm password" />
                        <input type="submit" value="Login" />
                    </form>
                    
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error,
        isAuthenticated: state.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);