import axios from 'axios';
import { refreshAccessToken } from './apiCalls';

export const baseUrl = 'http://localhost:8000/';

const axiosInstance = axios.create({
	baseURL: baseUrl,
	timeout: 5000,
	headers: {
		Authorization: localStorage.getItem('accessToken')
			? 'Bearer ' + localStorage.getItem('accessToken')
			: null,
		'Content-Type': 'application/json',
		accept: 'application/json',
	}, 
});

export default axiosInstance;

// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data
	console.log(response);
    return response;
}, function (error) {
	console.log(error);
	const originalRequest = error.config;
    // Any status codes that falls outside the range of 2xx cause this function to trigger
	// Do something with response error

	// if we already have a refresh token and our access token failed, try to refresh it
	const refreshToken = localStorage.getItem('refreshToken');
	// check if refresh token is expired
	if (refreshToken) {
		const jwtExpiration = JSON.parse(atob(refreshToken.split('.')[1])).exp;
		const now = Math.ceil(Date.now() / 1000);
		if (jwtExpiration < now) {
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('accessToken');
			return Promise.reject(error);
		}
	}
	if (error.response.status === 401 && refreshToken) {
		return refreshAccessToken(refreshToken)
			.then(response => {
				console.log(response);
				localStorage.setItem('accessToken', response.data.access);
				axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.data.access;
				originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
				return axiosInstance(originalRequest);
			})
			.catch(error => {
				console.log(error);
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				return Promise.reject(error);
			});
	}
	
	// if we don't have a refresh token and our access token failed, just return the error and we need to log the user out
	return Promise.reject(error);
});
