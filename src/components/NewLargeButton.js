import React from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';

function getBackgroundColor(props) {
  if (props.transparent) return colors.transparent;
  if (props.disabled) return colors.disabledPink;
  return colors.newPink;
}

const ButtonText = styled.Text((props) => ({
  fontFamily: props.light ? fonts.avenir.fontFamily : fonts.avenirSemiBold.fontFamily,
  fontWeight: props.light ? fonts.avenir.fontWeight : fonts.avenirSemiBold.fontWeight,
  color: props.disabled ? colors.regularText : colors.white,
  fontSize: 14,
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  alignSelf: 'center',
}));

const Button = styled.TouchableOpacity((props) => ({
  height: props.height || 52,
  width: props.flex ? null : props.width || '100%',
  flex: props.flex ? 1 : null,
  marginVertical: props.noPadding ? 0 : 24,
  backgroundColor: getBackgroundColor(props),
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  ...props.style,
}));

const NewLargeButton = ({title, onPress, disabled, light, noPadding, children, loading, ...props}) => (
  <Button {...props} onPress={onPress} disabled={disabled} noPadding={noPadding}>
    {loading ? (
      <ActivityIndicator size="small" color={colors.regularText} />
    ) : (
      children || (
        <ButtonText disabled={disabled} light={light}>
          {title}
        </ButtonText>
      )
    )}
  </Button>
);

export default NewLargeButton;
