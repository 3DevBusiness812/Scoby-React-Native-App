import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {StyleSheet} from 'react-native';
import RegularButton from 'src/components/RegularButton';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Team = ({large, style, widthContainer, id}) => {
  const navigator = useNavigation();

  const goToPrivateChat = () => navigator.navigate('TeamScreen', {id});

  return (
    <RegularButton
      style={[styles.button, style]}
      large={large}
      title="View Team"
      active={false}
      numberOfLines={1}
      widthContainer={widthContainer}
      onPress={goToPrivateChat}
    />
  );
};

export default Team;
