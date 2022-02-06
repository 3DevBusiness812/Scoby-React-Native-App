import React, {useMemo, useState} from 'react';
import {Dimensions, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {RESET_PASSWORD_TEXT, RESET_DESCRIPTION_TEXT, RESET_SEND_CODE_TEXT} from 'src/constants/Texts';
import PhoneInput from 'src/components/PhoneInput';
import {useMutation} from '@apollo/client';
import {RESET_PASSWORD} from 'src/graphql/mutations/auth';
import NewLargeButton from 'src/components/NewLargeButton';
import withSafeArea from 'src/components/withSafeArea';
import BackButton from 'src/components/BackButton';
import Fonts from 'src/constants/Fonts';
import logo from 'assets/images/logos/Scoby_Final_Logos/ScobyDude_preferred_logo/scoby_dude.png';
import {phoneRemoveFormat} from 'src/utils/phone';

const {height, width} = Dimensions.get('window');

const Wrapper = styled(KeyboardAwareScrollView)({
  backgroundColor: colors.blueBackgroundSession,
});

const LogoContainer = styled.View({
  alignItems: 'center',
});

const HeaderText = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  color: colors.white,
  lineHeight: '32px',
  marginTop: '30px',
});

const DescriptionText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: colors.white,
});

const SignInText = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 14,
  color: colors.white,
  paddingLeft: 4,
});

const RememberText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: 'white',
});

const RememberContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexDirection: 'row',
});

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

const ResetPassword = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [submit, {loading, error}] = useMutation(RESET_PASSWORD, {
    variables: {phone: phoneRemoveFormat(phone)},
    onCompleted({resetPassword}) {
      try {
        AsyncStorage.setItem(
          'phoneResetPassword',
          resetPassword.phone,
          navigation.navigate('VerifyPhone', {
            createNewPassword: true,
            phone: resetPassword.phone,
          }),
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
  });

  const isResetPasswordDisabled = useMemo(() => phone.length <= 9 || loading, [loading, phone.length]);

  return (
    <Wrapper keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <BackButton onPress={navigation.goBack} />
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={24}>
        <LogoContainer>
          <Image source={logo} style={styles.logo} />
        </LogoContainer>
        <HeaderText>{RESET_PASSWORD_TEXT}</HeaderText>
        <DescriptionText>{RESET_DESCRIPTION_TEXT}</DescriptionText>
        <PhoneInput value={phone} isError={error?.message} onChangeText={setPhone} />
        <RememberContainer>
          <RememberText>Remember Password?</RememberText>
          <TouchableOpacity onPress={navigation.goBack}>
            <SignInText>Sign in</SignInText>
          </TouchableOpacity>
        </RememberContainer>
        <NewLargeButton
          disabled={isResetPasswordDisabled}
          loading={loading}
          title={RESET_SEND_CODE_TEXT}
          onPress={submit}
        />
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default withSafeArea(ResetPassword);
