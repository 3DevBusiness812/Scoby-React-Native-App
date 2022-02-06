import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import styled from 'styled-components';
import colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {IncorrectMark} from 'assets/svg';

const Wrapper = styled.TouchableOpacity(({noMargin}) => ({
  marginTop: noMargin ? 0 : 16,
}));

const InputWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Line = styled.View(({isError}) => ({
  height: StyleSheet.hairlineWidth,
  backgroundColor: isError ? colors.errorHighlight : colors.white,
  marginBottom: 4,
}));

const Hint = styled.Text(({isError}) => ({
  ...Fonts.avenir,
  color: isError ? colors.errorHighlight : colors.white,
  fontSize: 12,
}));

const styles = StyleSheet.create({
  input: {
    ...Fonts.avenir,
    flex: 1,
    fontSize: 16,
    color: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
});

const DefaultInput = ({value, onChangeText, label, hint, isError, marked, onChange, noMargin, style, ...props}) => {
  const inputRef = useRef();

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    inputRef.current?.setNativeProps({style: [styles.input, style]});
  }, [value, onChangeText, label, hint, isError, marked, onChange, noMargin, style, props]);

  return (
    <Wrapper onPress={focus} activeOpacity={1} noMargin={noMargin}>
      <InputWrapper>
        <TextInput
          {...props}
          maxLength={props.maxLength || 16}
          value={value}
          onChange={onChange}
          returnKeyType="done"
          onChangeText={onChangeText}
          placeholderTextColor={colors.regularText}
          style={[styles.input, style]}
          ref={inputRef}
        />
        {isError && <IncorrectMark />}
      </InputWrapper>
      <Line colorFail={isError} />
      <Hint isError={isError}>{isError || hint}</Hint>
    </Wrapper>
  );
};

export default DefaultInput;
