import React, {useState, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {isAndroid} from 'src/utils/device';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

const CODE_LENGTH = new Array(4).fill(0);

const Wrapper = styled.View``;

function getBorderColor(props) {
  if (props.error) {
    return colors.errorHighlight;
  }
  if (props.filled) {
    return colors.confirmationGreen;
  }
  return colors.white;
}

const TouchableWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled.TextInput({
  position: 'absolute',
  left: -8192,
});

const DisplayWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-color: ${(props) => getBorderColor(props)};
  border-bottom-width: 1px;
  padding-bottom: 12px;
  margin: 12px 4px;
`;

const Cursor = styled.View`
  border-color: ${colors.primaryPurpleColor};
  border-width: 1px;
  height: 24px;
  opacity: ${(props) => (props.selected ? 1 : 0)};
`;

const DisplayText = styled.Text({
  ...Fonts.avenir,
  color: colors.white,
  textAlign: 'center',
  fontSize: 16,
  lineHeight: '24px',
});

const BottomWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Hint = styled.Text(({error}) => ({
  ...Fonts.avenir,
  color: error ? colors.errorHighlight : colors.regularText,
  marginTop: 8,
  fontSize: 14,
  lineHeight: '19px',
}));

const ResendButton = styled.TouchableOpacity``;

const ResendButtonText = styled.Text((props) => ({
  ...Fonts.avenirSemiBold,
  color: props.disabled ? colors.regularText : colors.primaryPurpleColor,
  marginTop: 8,
  fontSize: 14,
  lineHeight: '19px',
}));

const VerifyInput = ({onChangeText, onPressResend, resendDisabled, hint, error}) => {
  const [value, setValue] = useState('');
  const [focused, setFocus] = useState(true);

  const input = React.useRef(null);

  const handlePress = useCallback(() => {
    if (focused) {
      input.current.blur();
      setFocus(false);
    } else {
      input.current.focus();
      setFocus(true);
    }
  }, [focused]);

  const handleFocus = useCallback(() => {
    input.current.focus();
    setFocus(true);
  }, []);

  const handleBlur = useCallback(() => {
    input.current.blur();
    setFocus(false);
  }, []);

  const handleKeyUp = useCallback(
    (e) => {
      if (e.nativeEvent.key === 'Backspace') {
        const newValue = value.slice(0, value.length - 1);
        setValue(newValue);
        onChangeText(newValue);
      }
    },
    [value, onChangeText],
  );

  const handleChange = useCallback(
    (v) => {
      if (value.length < CODE_LENGTH.length) {
        setValue(v);
        onChangeText(v);
      }
    },
    [value, onChangeText],
  );

  const selectedIndex = value.length < CODE_LENGTH.length ? value.length : CODE_LENGTH.length - 1;

  useEffect(() => {
    isAndroid() && input.current.focus();
  }, []);

  return (
    <Wrapper>
      <TouchableWrapper onPress={handlePress}>
        <StyledInput
          value={value}
          maxLength={4}
          ref={input}
          onChangeText={handleChange}
          onKeyPress={handleKeyUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectedIndex={selectedIndex}
          keyboardType="number-pad"
          returnKeyType="done"
          autoFocus
        />
        {CODE_LENGTH.map((v, index) => {
          const selected = value.length === index;
          const filled = value[index];

          return (
            <DisplayWrapper key={Math.random()} selected={selected && focused} error={error} filled={filled}>
              <DisplayText key={Math.random()} selected={(selected || filled) && focused}>
                {value[index]}
              </DisplayText>
              <Cursor selected={selected && focused} />
            </DisplayWrapper>
          );
        })}
      </TouchableWrapper>
      <BottomWrapper>
        <View>
          <Hint>{hint}</Hint>
          <Hint error={error}>{error}</Hint>
        </View>
        <ResendButton disabled={resendDisabled} onPress={onPressResend}>
          <ResendButtonText disabled={resendDisabled}>Resend Code</ResendButtonText>
        </ResendButton>
      </BottomWrapper>
    </Wrapper>
  );
};

export default VerifyInput;
