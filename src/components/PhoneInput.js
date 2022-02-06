import React from 'react';
import {StyleSheet, View} from 'react-native';
import styled from 'styled-components/native';
import CountryPicker, {getCallingCode} from 'react-native-country-picker-modal';
import triangle from 'assets/images/input/triangle.png';
import {CorrectMarked, IncorrectMark} from 'assets/svg';
import colors from 'src/constants/Colors';
import {phoneFormat, phoneGetCountryCode, phoneRemoveFormat} from 'src/utils/phone';
import {getDeviceCountry} from 'src/utils/device';
import Fonts from 'src/constants/Fonts';

const PhoneWrapper = styled.View({
  marginTop: 16,
});

const FlagWrapper = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 10,
});

const CountryCodeText = styled.Text({
  ...Fonts.avenirSemiBold,
  color: colors.white,
  fontSize: 16,
  marginRight: 4,
});

const Hint = styled.Text(({isError}) => ({
  ...Fonts.avenir,
  fontSize: 12,
  color: isError ? colors.errorHighlight : colors.white,
  paddingTop: 4,
  height: 32,
}));

const InputWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const StyledInput = styled.TextInput({
  ...Fonts.avenir,
  flex: 1,
  fontSize: 16,
  color: colors.white,
});

const Triangle = styled.Image({
  marginHorizontal: 4,
});

const PhoneInput = ({label, hint, isError, icon, onChangeText, onFocus, onBlur, ...props}) => {
  const [value, setValue] = React.useState(props.value || '');
  const [loading, setLoading] = React.useState(true);
  const [countryCode, setCountryCode] = React.useState('US');

  const onChangeCountry = React.useCallback(
    (country) => {
      setCountryCode(country.cca2);
      const phone = `+${country.callingCode[0] || ''}`;
      setValue(phone);
      if (onChangeText) {
        onChangeText(phone);
      }
    },
    [onChangeText],
  );

  const handleBlur = React.useCallback(
    (e) => {
      const phone = phoneFormat(value, countryCode);
      if (phone) {
        setValue(phone);
      }
      const updatedPhone = phoneRemoveFormat(value, countryCode);
      if (onChangeText) {
        onChangeText(updatedPhone);
      }
      if (onBlur) {
        onBlur(e);
      }
    },
    [countryCode, onBlur, onChangeText, value],
  );

  const handleFocus = React.useCallback(
    (e) => {
      const phone = phoneRemoveFormat(value, countryCode);
      if (phone) {
        setValue(phone);
      }
      if (onFocus) {
        onFocus(e);
      }
    },
    [countryCode, onFocus, value],
  );

  const handleChangeText = React.useCallback(
    (phone) => {
      setValue(phone);
      const code = phoneGetCountryCode(phone);
      if (code) {
        setCountryCode(code);
      }
      if (onChangeText) {
        onChangeText(phone);
      }
    },
    [onChangeText],
  );

  React.useEffect(() => {
    if (props.value) {
      const code = phoneGetCountryCode(props.value);
      if (code) {
        setCountryCode(code);
        const phone = phoneFormat(props.value, code);
        if (phone) {
          setValue(phone);
        }
      }
      setLoading(false);
    } else {
      const code = getDeviceCountry();
      setCountryCode(code);
      getCallingCode(code).then((phoneCode) => {
        const phone = `+${phoneCode}`;
        setValue(phone);
        setLoading(false);
      });
    }
  }, [countryCode, onChangeText, props, value]);

  return (
    <PhoneWrapper>
      <InputWrapper>
        {loading || (
          <CountryPicker
            withFlag
            withEmoji
            withAlphaFilter
            withCallingCode
            countryCode={countryCode}
            onSelect={onChangeCountry}
            renderFlagButton={(flagProps) => {
              if (loading) {
                return null;
              }
              return (
                <FlagWrapper activeOpacity={0.7} onPress={flagProps.onOpen}>
                  <CountryCodeText>{countryCode}</CountryCodeText>
                  <Triangle source={triangle} />
                </FlagWrapper>
              );
            }}
          />
        )}
        <StyledInput
          {...props}
          maxLength={16}
          keyboardType="number-pad"
          returnKeyType="done"
          value={value}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChangeText={handleChangeText}
          placeholderTextColor={colors.translucentBlack}
        />
        {!isError ? value.length > 9 && <CorrectMarked /> : <IncorrectMark />}
      </InputWrapper>
      <View
        style={{
          height: StyleSheet.hairlineWidth,
          backgroundColor: value.length > 9 && !isError ? `${colors.confirmationGreen}` : `${colors.white}`,
        }}
      />
      <Hint isError={isError}>{isError}</Hint>
    </PhoneWrapper>
  );
};

export default PhoneInput;
