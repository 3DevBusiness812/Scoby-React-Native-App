import * as stateActions from './stateActions';

export const notify = ({type = 'info', text, title, timeout}) => {
  if (!timeout) {
    switch (type) {
      case 'info':
        timeout = 3000;
        break;
      case 'error':
        timeout = 5000;
        break;
      default:
        timeout = 3000;
    }
  }

  const notification = {
    id: `Notification${Math.random()}`.toLowerCase(),
    type,
    title,
    text,
    timeout,
  };

  return (dispatch) => {
    dispatch(stateActions.addNotification(notification));

    setTimeout(() => {
      dispatch(stateActions.removeNotification(notification.id));
    }, timeout);
  };
};
