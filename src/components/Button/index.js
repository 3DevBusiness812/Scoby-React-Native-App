import React from 'react';
import BlurBtn from './blur';
import BaseBtn from './base';

export default function Button(props) {
  const renderButton = () => {
    switch (props.type) {
      case 'blur':
        return <BlurBtn {...props} />;
      default:
        return <BaseBtn {...props} />;
    }
  };
  return renderButton();
}
