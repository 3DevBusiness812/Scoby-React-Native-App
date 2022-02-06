import React, {useState, useEffect, useCallback} from 'react';
import {Alert, StyleSheet, Image, Platform, KeyboardAvoidingView, Dimensions} from 'react-native';
import {useMutation} from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from 'src/constants/Colors';
import {SIGNUP_VERIFY_PHONE_HEADER, SIGNUP_VERIFY_PHONE_DESCRIPTION} from 'src/constants/Texts';
import {DELAY_BEFORE_RESEND} from 'src/constants/Variables';
import {CREATE_USER, VERIFY_USER_PHONE, RESET_PASSWORD_CONFIRM, RESET_PASSWORD} from 'src/graphql/mutations/auth';
import VerifyInput from 'src/screens/SignUp/components/VerifyInput';
import styled from 'styled-components/native';
import withSafeArea from 'src/components/withSafeArea';
import Fonts from 'src/constants/Fonts';
import BackButton from 'src/components/BackButton';
import logo from 'assets/images/logos/Scoby_Final_Logos/ScobyDude_preferred_logo/scoby_dude.png';

const {height, width} = Dimensions.get('window');

const Wrapper = styled(KeyboardAwareScrollView)({
  backgroundColor: colors.blueBackgroundSession,
});

const MainContent = styled.View`
  margin: 0px 16px;
  flex-direction: column;
`;

const TopContent = styled.View`
  margin: 0px 16px;
`;

const HeaderContent = styled.View``;

const HeaderText = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  lineHeight: '32px',
  color: colors.white,
  marginTop: 30,
});

const DescriptionText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: colors.white,
  marginVertical: 8,
});

const styles = StyleSheet.create({
  logo: {
    width: width * 0.2,
    height: height * 0.2,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

const VerifyCodeScreen = ({navigation, route}) => {
  const [error, setError] = useState(false);
  const [code, setCode] = useState([]);
  const [phone, setPhone] = useState('');
  const [phoneRestore, setPhoneRestore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(DELAY_BEFORE_RESEND);

  useEffect(() => {
    const timer = setTimeout(() => {
      timeLeft > 0 && setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (route) {
      const routParams = route.params;
      if (routParams) {
        // eslint-disable-next-line no-prototype-builtins
        if (routParams.hasOwnProperty('createNewPassword')) {
          setPhoneRestore(routParams.phone);
        }
      }
    }
  }, [route]);

  useEffect(() => {
    const getPhone = async (name = 'phone') =>
      // eslint-disable-next-line no-return-await
      await AsyncStorage.getItem(name);
    getPhone().then((v) => {
      if (v) {
        setPhone(v);
      }
    });
  }, [phone]);

  const [createUser, {loading}] = useMutation(CREATE_USER, {
    variables: {phone},
    onCompleted() {
      setTimeLeft(DELAY_BEFORE_RESEND);
    },
    onError(e) {
      Alert.alert('Error occured', e.message);
    },
  });

  const [resetPassword] = useMutation(RESET_PASSWORD, {
    variables: {phone: phoneRestore},
    onCompleted() {
      setTimeLeft(DELAY_BEFORE_RESEND);
    },
  });

  const [verifyUserPhone] = useMutation(VERIFY_USER_PHONE, {
    variables: {code, phone},
    onError(e) {
      e && setError(e.message);
    },
    // eslint-disable-next-line no-shadow
    onCompleted({verifyUserPhone}) {
      AsyncStorage.setItem('registrationToken', verifyUserPhone.registrationToken).then(() => {
        navigation.replace('SetUpProfile');
      });
    },
  });

  const [confirmResetPassword] = useMutation(RESET_PASSWORD_CONFIRM, {
    variables: {code, phone: phoneRestore},
    onError(e) {
      e && setError(e.message);
    },
    // eslint-disable-next-line no-shadow
    onCompleted({confirmResetPassword}) {
      AsyncStorage.setItem('registrationTokenResetPassword', confirmResetPassword.passwordResetToken).then(() =>
        navigation.navigate('NewPassword'),
      );
    },
  });

  const onPressVerify = async () => {
    if (phoneRestore) {
      await confirmResetPassword();
    } else {
      await verifyUserPhone();
    }
  };

  const handleTextChange = useCallback((value) => {
    setError(false);
    setCode(value);
  }, []);

  useEffect(
    () => {
      code.length === 4 && onPressVerify();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [code],
  );

  return (
    <Wrapper keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <KeyboardAvoidingView
        behavior="position"
        contentContainerStyle={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}>
        <Image source={logo} style={styles.logo} />
        <TopContent>
          <HeaderContent>
            <HeaderText>{SIGNUP_VERIFY_PHONE_HEADER}</HeaderText>
            <DescriptionText>{`${SIGNUP_VERIFY_PHONE_DESCRIPTION} ${phoneRestore || phone}`}</DescriptionText>
          </HeaderContent>
        </TopContent>
        <MainContent>
          <VerifyInput
            onChangeText={handleTextChange}
            onPressResend={async () => {
              phoneRestore ? await resetPassword() : await createUser();
            }}
            resendDisabled={timeLeft > 0 || loading}
            hint={`You can resend code in ${timeLeft}s`}
            error={error}
          />
        </MainContent>
      </KeyboardAvoidingView>
      <BackButton navigation={navigation} />
    </Wrapper>
  );
};

export default withSafeArea(VerifyCodeScreen);
