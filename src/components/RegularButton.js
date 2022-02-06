import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import styled from 'styled-components/native';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

function getBackgroundColor(props) {
  if (props.transparent) {
    return Colors.transparent;
  }
  if (props.active) {
    return Colors.blueBackgroundSession;
  }
  return Colors.pinkMagenta;
}

const ButtonText = styled.Text(({large}) => ({
  ...Fonts.avenirSemiBold,
  fontSize: large ? 16 : 14,
  paddingHorizontal: 6,
  color: Colors.white,
}));

const Button = styled.TouchableOpacity`
  height: ${(props) => (props.large ? '44px' : '32px')};
  background-color: ${(props) => getBackgroundColor(props)};
  border-radius: ${(props) => (props.large ? '8px' : '4px')};
  border-width: ${(props) => (props.active ? '1px' : '1px')};
  border-color: ${({active}) => (active ? Colors.white : Colors.pinkMagenta)};
  ${(props) => (props.widthContainer ? `width:${props.widthContainer}` : ``)}
`;

export default function RegularButton({
  ico,
  widthContainer,
  large,
  title,
  onPress,
  active,
  loading,
  textStyle,
  disabled,
  ...props
}) {
  return (
    <Button
      {...props}
      onPress={onPress}
      large={large}
      active={active}
      disabled={disabled}
      widthContainer={widthContainer}>
      {loading ? (
        <ActivityIndicator size="small" color={Colors.regularText} />
      ) : (
        <View style={{flexDirection: 'row'}}>
          {props.children}
          <ButtonText style={textStyle} large={large}>
            {title}
            {ico}
          </ButtonText>
        </View>
      )}
    </Button>
  );
}
