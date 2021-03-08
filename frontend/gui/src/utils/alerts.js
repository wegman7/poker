import { NotificationManager } from 'react-notifications';

const createNotification = (type, message, duration=3000, title=null) => {
	switch (type) {
		case 'info':
			NotificationManager.info(message, title, duration);
			break;
		case 'success':
			NotificationManager.success(message, title, duration);
			break;
		case 'warning':
			NotificationManager.warning(message, title, duration);
			break;
		case 'error':
			NotificationManager.error(message, title, duration);
			break;
		default:
			console.log('error type must be info/success/warning/error');
	};
}

export default createNotification;
