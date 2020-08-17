import axios from 'axios';
import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, username) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('avatar');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('/rest-auth/login/', {
            username: username,
            password: password
        })
        .then(response => {
            const token = response.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token, username));

            axios.get('api/contact/')
            .then(response => {
                const contact = response.data.filter(contacts => contacts.user.username === username)[0];
                let avatar = axios.defaults.baseURL + '/media/' + contact.avatar_url;
                localStorage.setItem('avatar', avatar);
            })
            .catch(error => {
                console.log(error);
            })
        })
        .catch(error => {
            dispatch(authFail(error))
        })
    }
}

export const authSignup = (username, email, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('/rest-auth/registration/', {
            username: username,
            email: email,
            password1: password1,
            password2: password2
        })
        .then(response => {
            const token = response.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token, username));

            axios.get('api/contact/')
            .then(response => {
                const contact = response.data.filter(contacts => contacts.user.username === username)[0];
                let avatar = axios.defaults.baseURL + '/media/' + contact.avatar_url;
                localStorage.setItem('avatar', avatar);
            })
            .catch(error => {
                console.log(error);
            })
        })
        .catch(error => {
            dispatch(authFail(error))
        })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date() ) {
                dispatch(logout());
            } else {
                const newExpirationDate = new Date(new Date().getTime() + 3600 * 1000)
                dispatch(authSuccess(token, username));
                localStorage.setItem('expirationDate', newExpirationDate);
            }
        }
    }
}