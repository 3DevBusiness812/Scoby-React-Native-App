/* eslint-disable no-use-before-define */
import moment from 'moment';
import React from 'react';
import DateItem from './DateItem';

export const displayingMessageDataCheck = (date) => {
  if (moment(date).dayOfYear() === moment(new Date()).dayOfYear()) {
    return <DateItem extra="today" text="Today" />;
  }
  return <DateItem text={moment(date).format('DD MMM YYYY')} />;
};

const RenderDay = ({currentMessage, previousMessage}) => {
  if (!Object.prototype.hasOwnProperty.call(previousMessage, '_id')) {
    return displayingMessageDataCheck(currentMessage.createdAt);
  }

  if (moment(currentMessage.createdAt).dayOfYear() === moment(previousMessage.createdAt).dayOfYear()) return;
  return displayingMessageDataCheck(currentMessage.createdAt);
};

export default RenderDay;
