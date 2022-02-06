import React, {useState} from 'react';
import {KeyboardAvoidingView, StyleSheet, Image, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';
import {SIGNUP_WITH_PHONE_HEADER, SIGNUP_WITH_PHONE_DESCRIPTION, SIGNUP_BUTTON_SEND} from 'src/constants/Texts';
import PhoneInput from 'src/components/PhoneInput';
import {useMutation} from '@apollo/client';
import {CREATE_USER} from 'src/graphql/mutations/auth';
import NewLargeButton from 'src/components/NewLargeButton';
import withSafeArea from 'src/components/withSafeArea';
import BackButton from 'src/components/BackButton';
import logo from 'assets/images/logos/Scoby_Final_Logos/ScobyDude_preferred_logo/scoby_dude.png';
import {phoneRemoveFormat} from 'src/utils/phone';
import TermsPolicy from 'src/components/TermsPolicy';

const {height, width} = Dimensions.get('window');

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

const DescriptionText = styled.Text({
  ...fonts.avenir,
  fontSize: 14,
  color: colors.white,
});

const TermsPolicyLabel = styled.View({
  flex: 1,
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
  checkbox: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    flex: 0,
  },
  policyText: {
    minHeight: 0,
    marginTop: -2,
  },
});

const SignUpWithPhoneScreen = ({navigation}) => {
  const [phone, setPhone] = useState(process.env.NODE_ENV === 'development' ? '+543584204539' : '');

  const [createUser, {loading, error}] = useMutation(CREATE_USER, {
    variables: {phone: phoneRemoveFormat(phone)},
    onCompleted(response) {
      try {
        AsyncStorage.setItem('phone', response.createUser.phone, navigation.navigate('VerifyPhone'));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
  });

  return (
    <Wrapper keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <BackButton onPress={navigation.goBack} />
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={24}>
        <LogoContainer>
          <Image source={logo} style={styles.logo} />
        </LogoContainer>
        <HeaderText>{SIGNUP_WITH_PHONE_HEADER}</HeaderText>
        <DescriptionText>{SIGNUP_WITH_PHONE_DESCRIPTION}</DescriptionText>
        <PhoneInput value={phone} isError={error?.message} onChangeText={setPhone} />
        <TermsPolicyLabel>
          <TermsPolicy style={styles.policyText} />
        </TermsPolicyLabel>
        <NewLargeButton
          medium
          large
          disabled={phone.length <= 9 || loading}
          active={false}
          onPress={createUser}
          title={SIGNUP_BUTTON_SEND}
        />
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default withSafeArea(SignUpWithPhoneScreen);
