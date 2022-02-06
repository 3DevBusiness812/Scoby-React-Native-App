import React, {useState, useEffect, useCallback} from 'react';
import {View, Image, StyleSheet, Dimensions, Platform, KeyboardAvoidingView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {
  RESET_NEW_PASS_TEXT,
  SET_NEW_PASS_TEXT,
  SET_NEW_PASS_DESCRIPTION_TEXT,
  LOGIN_INPUT_PASSWORD_PLACEHOLDER,
  SET_NEW_PASS_RULS_TEXT,
} from 'src/constants/Texts';
import {useMutation} from '@apollo/client';
import {UPDATE_PASSWORD} from 'src/graphql/mutations/auth';
import DefaultInput from 'src/components/Input';
import {EyeCrossedIco, EyeIco} from 'assets/svg';
import withSafeArea from 'src/components/withSafeArea';
import Fonts from 'src/constants/Fonts';
import NewLargeButton from 'src/components/NewLargeButton';
import logo from 'assets/images/logos/Scoby_Final_Logos/ScobyDude_preferred_logo/scoby_dude.png';

const {height, width} = Dimensions.get('window');

const Wrapper = styled(KeyboardAwareScrollView)({
  backgroundColor: colors.blueBackgroundSession,
  paddingHorizontal: 24,
});

const HeaderText = styled.Text({
  ...Fonts.goudy,
  marginTop: 30,
  fontSize: 28,
  color: colors.white,
  lineHeight: '32px',
});

const DescriptionText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: colors.white,
  marginVertical: 8,
});

const InputContainer = styled.View({
  justifyContent: 'center',
});

const Eye = styled.TouchableOpacity({
  position: 'absolute',
  right: 0,
});

const styles = StyleSheet.create({
  logo: {
    width: width * 0.2,
    height: height * 0.2,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

function validatePassword(password, confirmation) {
  const errors = [];

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase character');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase character');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain digits');
  }
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (password !== confirmation) {
    errors.push('Password and confirmation does not match');
  }

  return errors;
}

const NewPassword = ({navigation}) => {
  const [passwordResetToken, setPasswordResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [errorPassValidation, setErrorPassValidation] = useState(null);
  const [eyeOpen, setEyeOpen] = useState(true);
  const [eyeOpenRepeated, setEyeOpenRepeated] = useState(true);
  const [valid, setValid] = useState(false);

  const [updatePassword, {loading}] = useMutation(UPDATE_PASSWORD, {
    onCompleted() {
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth', screen: 'LoginWithPhone'}],
      });
    },
  });

  const handleValidate = useCallback(() => {
    const errors = validatePassword(password, repeatedPassword);
    if (errors.length > 0 && repeatedPassword.length > 0) {
      setErrorPassValidation(errors.pop());
    }
  }, [password, repeatedPassword]);

  const handleSubmit = useCallback(() => {
    const errors = validatePassword(password, repeatedPassword);

    if (errors.length > 0) {
      setErrorPassValidation(errors.pop());
    } else {
      updatePassword({variables: {password, passwordResetToken}});
    }
  }, [password, passwordResetToken, repeatedPassword, updatePassword]);

  const handleTogglePassword = useCallback(() => {
    setEyeOpen(!eyeOpen);
  }, [eyeOpen]);

  const handleTogglePasswordConfirmation = useCallback(() => {
    setEyeOpenRepeated(!eyeOpenRepeated);
  }, [eyeOpenRepeated]);

  const handleResetValidation = useCallback(() => setErrorPassValidation(null), []);

  useEffect(() => {
    async function setToken() {
      const resetToken = await AsyncStorage.getItem('registrationTokenResetPassword');
      setPasswordResetToken(resetToken);
    }
    setToken();
  }, [passwordResetToken]);

  useEffect(() => {
    setValid(validatePassword(password, repeatedPassword).length === 0);
  }, [password, repeatedPassword]);

  return (
    <Wrapper keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <KeyboardAvoidingView
        behavior="position"
        contentContainerStyle={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 48 : 0}>
        <Image source={logo} style={styles.logo} />
        <HeaderText>{SET_NEW_PASS_TEXT}</HeaderText>
        <DescriptionText>{SET_NEW_PASS_DESCRIPTION_TEXT}</DescriptionText>
        <InputContainer>
          <DefaultInput
            value={password}
            secureTextEntry={eyeOpen}
            maxLength={16}
            onChangeText={setPassword}
            placeholder={LOGIN_INPUT_PASSWORD_PLACEHOLDER}
            isError={errorPassValidation}
            onFocus={handleResetValidation}
            onBlur={handleValidate}
            keyboardType="ascii-capable"
          />
          <Eye onPress={handleTogglePassword}>{eyeOpen ? <EyeIco /> : <EyeCrossedIco />}</Eye>
        </InputContainer>
        <View>
          <DescriptionText>{SET_NEW_PASS_RULS_TEXT}</DescriptionText>
        </View>
        <InputContainer>
          <DefaultInput
            value={repeatedPassword}
            secureTextEntry={eyeOpenRepeated}
            maxLength={16}
            onChangeText={setRepeatedPassword}
            placeholder={LOGIN_INPUT_PASSWORD_PLACEHOLDER}
            isError={errorPassValidation}
            onFocus={handleResetValidation}
            onBlur={handleValidate}
            keyboardType="ascii-capable"
          />
          <Eye onPress={handleTogglePasswordConfirmation}>{eyeOpenRepeated ? <EyeIco /> : <EyeCrossedIco />}</Eye>
        </InputContainer>
        <NewLargeButton disabled={!valid} onPress={handleSubmit} loading={loading} title={RESET_NEW_PASS_TEXT} />
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default withSafeArea(NewPassword);
