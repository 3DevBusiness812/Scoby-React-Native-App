/* eslint-disable no-use-before-define */
import React, {useCallback, useContext, useMemo, useState} from 'react';
import {StyleSheet, Image, Dimensions, TouchableOpacity, KeyboardAvoidingView, Text, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';
import {HidedPassword, ShowPassword} from 'assets/svg';
import {
  LOGIN_WITH_PHONE_HEADER,
  LOGIN_WITH_PHONE_DESCRIPTION,
  LOGIN_BUTTON_SEND,
  LOGIN_INPUT_PASSWORD_PLACEHOLDER,
  FORGOT_PASSWORD_TEXT,
} from 'src/constants/Texts';
import NewLargeButton from 'src/components/NewLargeButton';
import PhoneInput from 'src/components/PhoneInput';
import {useLazyQuery, useMutation} from '@apollo/client';
import {LOGIN_USER} from 'src/graphql/mutations/auth';
import {SEND_FCM_TOKEN} from 'src/graphql/mutations/fcm';
import DefaultInput from 'src/components/Input';
import {requestDeviceId, requestUserPermission} from 'src/utils/permission/notifications';
import withSafeArea from 'src/components/withSafeArea';
import logo from 'assets/images/logos/Scoby_Final_Logos/ScobyDude_preferred_logo/scoby_dude.png';
import {GET_USER_PROFILE} from 'src/graphql/queries/profile';
import {GlobalContext} from 'src/containers/global';
import {phoneRemoveFormat} from 'src/utils/phone';

const Wrapper = styled(KeyboardAwareScrollView)({
  backgroundColor: colors.blueBackgroundSession,
});

const LogoContainer = styled.View({
  alignItems: 'center',
});

const HeaderText = styled.Text({
  ...fonts.goudy,
  paddingTop: 30,
  paddingBottom: 8,
  color: colors.white,
  fontSize: 28,
  lineHeight: '32px',
});

const SubtitleText = styled.Text({
  ...fonts.avenir,
  fontSize: 14,
  color: colors.white,
});

const ForgotPasswordContainer = styled.View({
  justifyContent: 'space-between',
  flexDirection: 'row',
  paddingTop: 8,
});

const ForgotPasswordText = styled.Text({
  ...fonts.avenirBold,
  fontSize: 14,
  color: 'white',
});

const SignUpContainer = styled.TouchableOpacity({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const SignUpQuestion = styled.Text({
  ...fonts.avenir,
  fontSize: 14,
  color: colors.white,
});

const SignUpLink = styled.Text({
  ...fonts.avenirBold,
  fontSize: 14,
  color: colors.white,
  paddingLeft: 4,
});

const LoginWithPhoneScreen = ({navigation}) => {
  const {height, width} = Dimensions.get('window');
  const {setIsLogged} = useContext(GlobalContext);
  const [hidePassword, setHidePassword] = useState(true);
  const [working, setWorking] = useState(false);
  const [displayError, setDisplayError] = useState('');
  const [phone, setPhone] = useState(process.env.NODE_ENV === 'development' ? '+5488888881' : '');
  const [password, setPassword] = useState(process.env.NODE_ENV === 'development' ? 'Password1' : '');

  const styles = StyleSheet.create({
    logo: {
      width: width * 0.2,
      height: height * 0.2,
      resizeMode: 'contain',
    },
    content: {
      padding: 24,
    },
  });

  const manageError = (msg) => {
    setWorking(false);
    setIsLogged(false);
    setDisplayError(msg);
  };

  const [addPushToken] = useMutation(SEND_FCM_TOKEN, {
    onError: () =>
      Alert.alert(
        'Permissions for notification has been denied',
        'If you want to receive notification you should access the permissions manually in phone settings',
      ),
  });

  const [loadProfile] = useLazyQuery(
    GET_USER_PROFILE,
    {fetchPolicy: 'cache-and-network'},
    {
      onError: () => manageError('Cannot load profile'),
    },
  );

  const [loginUser, {error: loginError}] = useMutation(LOGIN_USER, {
    async onCompleted(response) {
      try {
        if (response.expiredToken) {
          await AsyncStorage.removeItem('token');
          manageError('Notification error: expired token');
        } else {
          await AsyncStorage.setItem('token', response.loginUser?.authorizationToken);
          loadProfile();
          const token = await requestUserPermission();
          const deviceId = await requestDeviceId();
          await addPushToken({variables: {deviceId, token}});
          setIsLogged(true);
          navigation.replace('MainTabs', {screen: 'Profile'});
        }
      } catch {
        manageError('We have an issue identifying your device');
      }
    },
    async onError() {
      await AsyncStorage.removeItem('token');
      setIsLogged(false);
      setWorking(false);
    },
  });

  const handleLogin = useCallback(async () => {
    setWorking(true);
    setDisplayError('');
    await AsyncStorage.removeItem('token');
    loginUser({variables: {phone: phoneRemoveFormat(phone), password}});
  }, [loginUser, password, phone]);

  const handlePasswordVisibilityToggle = useCallback(() => {
    setHidePassword(!hidePassword);
  }, [hidePassword]);

  const handlePasswordReset = useCallback(() => {
    navigation.navigate('ResetPassword');
  }, [navigation]);

  const handleSignUp = useCallback(() => {
    navigation.navigate('Auth', {screen: 'TermsAndConditions'});
  }, [navigation]);

  const isLoginDisabled = useMemo(() => working, [working]);

  return (
    <Wrapper keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={24}>
        <LogoContainer>
          <Image source={logo} style={styles.logo} />
        </LogoContainer>
        <HeaderText>{LOGIN_WITH_PHONE_HEADER}</HeaderText>
        <SubtitleText>{LOGIN_WITH_PHONE_DESCRIPTION}</SubtitleText>
        <PhoneInput
          value={phone}
          isError={loginError?.message || <Text>{displayError}</Text>}
          onChangeText={setPhone}
        />
        <DefaultInput
          value={password}
          secureTextEntry={hidePassword}
          onChangeText={setPassword}
          placeholder={LOGIN_INPUT_PASSWORD_PLACEHOLDER}
          isError={loginError?.message || <Text>{displayError}</Text>}
        />
        <ForgotPasswordContainer>
          <TouchableOpacity onPress={handlePasswordVisibilityToggle}>
            {hidePassword ? <HidedPassword /> : <ShowPassword />}
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePasswordReset}>
            <ForgotPasswordText>{FORGOT_PASSWORD_TEXT}</ForgotPasswordText>
          </TouchableOpacity>
        </ForgotPasswordContainer>
        <NewLargeButton disabled={isLoginDisabled} loading={working} title={LOGIN_BUTTON_SEND} onPress={handleLogin} />
      </KeyboardAvoidingView>
      <SignUpContainer onPress={handleSignUp}>
        <SignUpQuestion>Don’t have an account?</SignUpQuestion>
        <SignUpLink>Sign Up</SignUpLink>
      </SignUpContainer>
    </Wrapper>
  );
};

export default withSafeArea(LoginWithPhoneScreen);
