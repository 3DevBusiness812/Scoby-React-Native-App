import React from 'react';
import {StyleSheet} from 'react-native';
import RegularButton from 'src/components/RegularButton';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const JoinSerie = ({large, style, widthContainer, navigation, id}) => {
  const openSerie = () => {
    navigation.navigate('SeriesLandingView', {id});
  };

  return (
    <RegularButton
      style={[styles.button, style]}
      large={large}
      title={`Let's go`}
      active={false}
      loading={false}
      numberOfLines={1}
      widthContainer={widthContainer}
      onPress={openSerie}
    />
  );
};

export default JoinSerie;
