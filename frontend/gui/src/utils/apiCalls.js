import axiosInstance from './axios';

export const login = (email, password) => {
    return axiosInstance.post('auth/login/', {
        email: email,
        password: password
    });
}

export const signup = (email, username, password) => {
    return axiosInstance.post('auth/register/', {
        email: email,
        username: username,
        password: password
    });
}

export const userDetails = () => {
    return axiosInstance.get('poker/contact-details/');
}

export const refreshAccessToken = (refreshToken) => {
    return axiosInstance.post('auth/token/refresh/', {
        refresh: refreshToken
    });
}

export const sendEmailRecoveryLink = (email) => {
    return axiosInstance.post('auth/reset-password/', {
        email: email
    });
}

export const resetPassword = (password, token, uidb64) => {
    return axiosInstance.patch('auth/set-password/', {
        password: password,
        token: token,
        uidb64: uidb64
    });
}

export const changePassword = (oldPassword, newPassword) => {
    return axiosInstance.patch('auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
    });
}

export const getAvatars = () => {
    return axiosInstance.get('poker/avatar/');
}

export const changeAvatar = (id, url) => {
    return axiosInstance.patch('poker/change-avatar/', {
        id: id
    });
}

export const getRooms = () => {
    return axiosInstance.get('poker/room/');
}
