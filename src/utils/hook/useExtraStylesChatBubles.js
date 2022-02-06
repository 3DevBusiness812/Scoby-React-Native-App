/* eslint-disable no-underscore-dangle */
import moment from 'moment';

const useExtraStylesChatBubles = (currentMessage, previousMessage, nextMessage, id) => {
  let result = {};

  if (nextMessage?.user && nextMessage?.user._id === id) result = {...result};
  if (nextMessage?.user && nextMessage?.user._id !== id) result = {...result, marginBottom: 25};

  if (id === 2) {
    if (
      nextMessage?.user &&
      nextMessage?.user._id === id &&
      moment(currentMessage?.createdAt).dayOfYear() === moment(nextMessage?.createdAt).dayOfYear()
    )
      result = {...result, borderBottomLeftRadius: 0};
    if (
      previousMessage?.user &&
      previousMessage?.user._id === id &&
      moment(previousMessage?.createdAt).dayOfYear() === moment(currentMessage?.createdAt).dayOfYear()
    )
      result = {...result, borderTopLeftRadius: 0};
  }
  if (id === 1) {
    if (
      nextMessage?.user &&
      nextMessage?.user._id === id &&
      moment(currentMessage?.createdAt).dayOfYear() === moment(nextMessage?.createdAt).dayOfYear()
    )
      result = {...result, borderBottomRightRadius: 0};
    if (
      previousMessage?.user &&
      previousMessage?.user._id === id &&
      moment(previousMessage?.createdAt).dayOfYear() === moment(currentMessage?.createdAt).dayOfYear()
    )
      result = {...result, borderTopRightRadius: 0};
  }

  return {result};
};

export default useExtraStylesChatBubles;
