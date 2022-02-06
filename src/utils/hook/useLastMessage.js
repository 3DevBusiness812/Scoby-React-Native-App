import moment from 'moment';
import {timeStampLastMessage} from '../helpers';

export const useLastMessage = (item, currUser) => {
  const {id: currUserId} = currUser;

  const lastItemIdx = item.item.messages.length - 1;
  const lastItem = item.item.messages[lastItemIdx];
  const {text} = lastItem;

  const created = timeStampLastMessage(lastItem);

  const momentFrom = moment(created);
  const momentTo = moment(Date.now());
  const ago = momentFrom.from(momentTo);

  const {
    fullName,
    avatar: image,
    id,
  } = item.item.participantUsers.find(({id: foundUserId}) => foundUserId !== currUserId);

  const incomeMessages = item.item.messages.filter(({sender}) => sender.id === id);
  const isAnyUnread = incomeMessages.some((msg) => !msg.isRead);

  const message = text.length > 20 ? `${text.slice(0, 20)}...`.trim() : text.trim();

  return {ago, message, fullName, image, id, isAnyUnread};
};
