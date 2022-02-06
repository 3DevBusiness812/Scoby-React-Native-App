import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, View, Text, Dimensions, Image, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import NewLargeButton from 'src/components/NewLargeButton';
import Input from 'src/components/Input';
import {useMutation} from '@apollo/client';
import {CREATE_USER_PROFILE} from 'src/graphql/mutations/auth';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {requestDeviceId, requestUserPermission} from 'src/utils/permission/notifications';
import {SEND_FCM_TOKEN} from 'src/graphql/mutations/fcm';
import {HidedPassword, ShowPassword} from 'assets/svg';
import {
  SIGNUP_SETUP_PROFILE_HEADER,
  SIGNUP_SETUP_PROFILE_DESCRIPTION,
  SIGNUP_SETUP_PROFILE_NEXT_BUTTON,
  SIGNUP_SETUP_PROFILE_PLACEHOLDER_USERNAME,
  SIGNUP_SETUP_PROFILE_PLACEHOLDER_PASSWORD,
  ACCOUNT_CREATED,
} from 'src/constants/Texts';
import withSafeArea from 'src/components/withSafeArea';
import Fonts from 'src/constants/Fonts';
import logo from 'assets/images/logos/Scoby_Final_Logos/ScobyDude_preferred_logo/scoby_dude.png';
import TopicsScreen from './TopicsScreen';

const Container = styled.View({
  flex: 1,
  backgroundColor: colors.blueBackgroundSession,
});

const Wrapper = styled.ScrollView({
  flex: 1,
  backgroundColor: colors.blueBackgroundSession,
});

const HeaderContent = styled.View({});

const HeaderText = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  color: colors.white,
  lineHeight: '32px',
});

const DescriptionText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: colors.white,
  paddingVertical: 16,
});

const ShowPassBtnContainer = styled.View({
  height: 35,
  justifyContent: 'flex-end',
  flexDirection: 'row',
});

const ForgotBtn = styled.TouchableOpacity({});

const LogoContainer = styled.View({
  alignItems: 'center',
});

const SetUpProfileScreen = ({navigation}) => {
  const {height, width} = Dimensions.get('window');
  const [usernameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [dateValid, setDateValid] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [username, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [badEmail, setBadEmail] = useState(false);
  const [registrationToken, setRegistrationToken] = useState('');
  const [topics, setTopics] = useState(null);
  const [visible, setVisible] = useState(false);
  const [addPushToken] = useMutation(SEND_FCM_TOKEN);
  const [profile, setProfile] = useState({});

  const sendFcmToken = useCallback(async () => {
    const token = await requestUserPermission();
    const deviceId = await requestDeviceId();
    if (token) {
      await addPushToken({
        variables: {
          deviceId,
          token,
        },
      });
    }
  }, [addPushToken]);

  const [createUserProfile, {loading}] = useMutation(CREATE_USER_PROFILE, {
    onError(e) {
      setUserNameError(false);
      setPasswordError(false);

      if (e.networkError) {
        Alert.alert('Something went wrong. Please try again later', e.message);
      }
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        if (e.graphQLErrors[0].extensions && e.graphQLErrors[0].extensions.code === 'ERR_USERNAME_EXISTS') {
          setUserNameError(e.message);
        } else if (e.graphQLErrors[0].extensions && e.graphQLErrors[0].extensions.code === 'ERR_VALIDATION_FAILED') {
          if (e.graphQLErrors[0].extensions.details[0].path[0] === 'password') {
            setPasswordError(e.message);
          }
          if (e.graphQLErrors[0].extensions.details[0].path[0] === 'username') {
            setUserNameError(e.message);
          }
        } else {
          setPasswordError(e.message);
          setUserNameError(e.message);
        }
      }
    },
    onCompleted: async ({createUserProfile: userData}) => {
      Alert.alert(ACCOUNT_CREATED);
      await AsyncStorage.setItem('token', userData.auth.authorizationToken);
      sendFcmToken();
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth', screen: 'LoginWithPhone'}],
      });
    },
  });

  const validDate = useCallback((birthdayNew) => {
    setBirthday(birthdayNew);
    if (birthdayNew.length === 10) {
      const year = parseInt(birthdayNew.substr(birthdayNew.length - 4), 10);
      const actualDate = new Date().getFullYear();
      if (actualDate - year >= 13) {
        setDateValid(true);
      } else {
        setDateValid(false);
      }
    }
  }, []);

  const wellFormedName = useCallback((emailAddress) => {
    const reg = /.+@.+\.[A-Za-z]+$/;
    if (emailAddress && reg.test(emailAddress) === false) {
      setBadEmail(true);
    } else {
      setBadEmail(false);
    }
    setEmail(emailAddress);
  }, []);

  const handleSubmit = useCallback(async () => {
    await AsyncStorage.setItem(
      'userCreatInfo',
      JSON.stringify({
        username: username.slice(1, username.length),
        password,
        birthday: moment(birthday).toISOString(),
        registrationToken,
      }),
    );

    setProfile({
      username: username.slice(1, username.length),
      password,
      birthday: moment(birthday).toISOString(),
      registrationToken,
      topics,
      email,
      fullName,
    });

    setVisible(true);
  }, [birthday, email, fullName, password, registrationToken, topics, username]);

  const handleUsernameChange = useCallback((text) => {
    if (text.charAt(0) !== '@') {
      text = `@${text}`;
    }
    setName(text);
  }, []);

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

  const isDataValid = useMemo(
    () =>
      username &&
      username.length >= 2 &&
      password &&
      password.length >= 8 &&
      email &&
      email.length > 0 &&
      !badEmail &&
      birthday &&
      dateValid,
    [badEmail, birthday, dateValid, email, password, username],
  );

  useEffect(() => {
    async function updateToken() {
      setRegistrationToken(await AsyncStorage.getItem('registrationToken'));
    }

    updateToken();
  }, []);

  return (
    <Container>
      <TopicsScreen
        visible={visible}
        setVisible={setVisible}
        setTopics={setTopics}
        createUserProfile={createUserProfile}
        profile={profile}
        saving={loading}
      />
      <Wrapper keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <LogoContainer>
          <Image source={logo} style={styles.logo} />
        </LogoContainer>
        <HeaderContent>
          <HeaderText>{SIGNUP_SETUP_PROFILE_HEADER}</HeaderText>
          <DescriptionText>{SIGNUP_SETUP_PROFILE_DESCRIPTION}</DescriptionText>
        </HeaderContent>
        <Input
          placeholder="Full Name"
          maxLength={40}
          value={fullName}
          isError={false}
          onChangeText={(text) => {
            setFullName(text);
          }}
        />
        <Input
          placeholder="Email"
          value={email}
          maxLength={40}
          isError={false}
          autoCapitalize="none"
          onChangeText={wellFormedName}
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <Input
          placeholder={SIGNUP_SETUP_PROFILE_PLACEHOLDER_USERNAME}
          value={username}
          isError={usernameError}
          autoCapitalize="none"
          onChangeText={handleUsernameChange}
          marked={username.length >= 2 && !usernameError}
        />
        <Input
          placeholder={SIGNUP_SETUP_PROFILE_PLACEHOLDER_PASSWORD}
          maxLength={20}
          value={password}
          isError={passwordError}
          hint={
            'Password should contain at least 1 digit, 1 capital letter,' +
            ' 1 small letter and be more than 8 symbols length'
          }
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={hidePassword}
          marked={password.length >= 8 && !passwordError && !usernameError}
        />
        <ShowPassBtnContainer>
          <ForgotBtn onPress={() => setHidePassword(!hidePassword)}>
            {hidePassword ? <HidedPassword /> : <ShowPassword />}
          </ForgotBtn>
        </ShowPassBtnContainer>
        <View>
          <Text style={{color: 'white'}}>Birthday (MM/DD/YYYY)</Text>
          <TextInputMask
            customTextInput={Input}
            customTextInputProps={{ref: null}}
            type="datetime"
            options={{
              format: 'MM/DD/YYYY',
            }}
            value={birthday}
            onChangeText={(text) => validDate(text)}
            placeholderTextColor={colors.translucentBlack}
            returnKeyType="done"
          />
        </View>
        <NewLargeButton disabled={!isDataValid} onPress={handleSubmit} title={SIGNUP_SETUP_PROFILE_NEXT_BUTTON} />
      </Wrapper>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-64}>
        <View />
      </KeyboardAvoidingView>
    </Container>
  );
};

export default withSafeArea(SetUpProfileScreen);
