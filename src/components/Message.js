import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {StyleSheet} from 'react-native';
import RegularButton from 'src/components/RegularButton';
import {ACTIVITY_KEYS} from 'src/screens/Activity/ActivityKeys';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Message = ({large, style, widthContainer, id, role, username, fullName}) => {
  const navigator = useNavigation();

  const goToPrivateChat = () => navigator.navigate(ACTIVITY_KEYS.PRIVATE_CHAT, {id, role, username, fullName});

  return (
    <RegularButton
      style={[styles.button, style]}
      large={large}
      title="Reply"
      active={false}
      numberOfLines={1}
      widthContainer={widthContainer}
      onPress={goToPrivateChat}
    />
  );
};

export default Message;
