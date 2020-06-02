import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from '../store/actions/auth';

class Login extends Component {
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
        const password = event.target.password.value;
        this.props.onAuth(username, password);
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

                    <div>

                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="username" placeholder="username" />
                            <input type="password" name="password" placeholder="password" />
                            <input type="submit" value="Login" />
                        </form>
                        <Link to='/signup/'>Signup</Link>
                    </div>

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
        onAuth: (username, password) => dispatch(actions.authLogin(username, password)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);