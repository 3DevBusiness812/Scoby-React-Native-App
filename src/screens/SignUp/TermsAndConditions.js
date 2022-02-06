import React, {useState} from 'react';
import styled from 'styled-components';
import withSafeArea from 'src/components/withSafeArea';
import Fonts from 'src/constants/Fonts';
import colors from 'src/constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {SIGNUP_TERMS_AND_CONDITIONS, SIGNUP_TERMS_AND_CONDITIONS_CHECKBOX} from 'src/constants/Texts';
import {CheckBox} from 'react-native-elements';
import {CheckBoxIcon, UnCheckBoxIcon} from 'assets/svg';
import Button from 'src/components/NewLargeButton';
import TermsScrollView from './components/TermsScrollView';

const Title = styled.Text({
  ...Fonts.goudy,
  fontSize: 22,
  color: colors.white,
  lineHeight: '32px',
  marginBottom: 20,
});

const TermsContainer = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 20,
});

const TermsPolicyLabel = styled.View({
  flex: 1,
});

const TermsPolicy = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  lineHeight: '20px',
  color: colors.white,
});

const ButtonContainer = styled.View({
  flex: 0.2,
  flexDirection: 'row',
  paddingHorizontal: '7%',
});

const TermsAnsConditions = ({navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  return (
    <LinearGradient
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 0}}
      style={[{zIndex: -2000, flex: 1, alignItems: 'center', paddingTop: 30}]}
      colors={[`rgba(98, 52, 183, ${1})`, `rgba(9, 7, 58, ${1})`]}>
      <Title>{SIGNUP_TERMS_AND_CONDITIONS}</Title>
      <TermsScrollView />
      <TermsContainer onPress={() => setToggleCheckBox(!toggleCheckBox)}>
        <CheckBox
          checked={toggleCheckBox}
          onPress={() => setToggleCheckBox(!toggleCheckBox)}
          checkedIcon={<CheckBoxIcon />}
          uncheckedIcon={<UnCheckBoxIcon />}
        />
        <TermsPolicyLabel>
          <TermsPolicy>{SIGNUP_TERMS_AND_CONDITIONS_CHECKBOX}</TermsPolicy>
        </TermsPolicyLabel>
      </TermsContainer>
      <ButtonContainer>
        <Button
          title="Back"
          flex
          transparent
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button
          onPress={() => {
            navigation.replace('SignUpWithPhone');
          }}
          flex
          title="Next"
          disabled={!toggleCheckBox}
        />
      </ButtonContainer>
    </LinearGradient>
  );
};

export default withSafeArea(TermsAnsConditions);
