import React, {useCallback} from 'react';
import {Linking, Alert} from 'react-native';
import styled from 'styled-components';
import * as Terms from 'src/constants/TermsAndConditionsText';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';
import LinearGradient from 'react-native-linear-gradient';

const TermsContainer = styled.ScrollView({
  flex: 1,
  width: '90%',
});

const Container = styled.View({
  flex: 1,
  marginBottom: 20,
});

const TermsDate = styled.Text({
  ...Fonts.avenir,
  fontSize: 13,
  marginBottom: 15,
  color: Colors.white,
});

const TermsTitle = styled.Text({
  ...Fonts.goudy,
  fontSize: 15,
  color: Colors.white,
});

const Title = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 12,
  marginTop: 15,
  color: Colors.white,
});

const TermsText = styled.Text({
  ...Fonts.avenir,
  fontSize: 12,
  color: Colors.white,
});

const TermsLink = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 13,
  color: Colors.white,
  textDecorationLine: 'underline',
});

const TermsList = styled.Text({
  ...Fonts.avenir,
  fontSize: 13,
  color: Colors.white,
  marginLeft: 20,
});

const TermsScrollView = () => {
  const OpenURL = ({url, email}) => {
    const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return <TermsLink onPress={handlePress}>{email || url}</TermsLink>;
  };

  return (
    <Container>
      <TermsContainer>
        <TermsDate>{Terms.TERMS_DATE}</TermsDate>
        <TermsTitle>{Terms.TERMS_TITLE}</TermsTitle>
        <Title>{Terms.TERMS_AGREEMENT_TITLE}</Title>
        <TermsText>
          {Terms.TERMS_AGREEMENT_TEXT_START} {<OpenURL url={Terms.TERMS_AGREEMENT_LINK} />}{' '}
          {Terms.TERMS_AGREEMENT_TEXT_END}
        </TermsText>
        <Title>{Terms.TERMS_INTELLECTUAL_PROPERTY_TITLE}</Title>
        <TermsText>{Terms.TERMS_INTELLECTUAL_PROPERTY_TEXT}</TermsText>
        <Title>{Terms.TERMS_USER_REPRESENTATIONS_TITLE}</Title>
        <TermsText>{Terms.TERMS_USER_REPRESENTATIONS_TEXT}</TermsText>
        <Title>{Terms.TERMS_USER_REGISTRATION_TITLE}</Title>
        <TermsText>{Terms.TERMS_USER_REGISTRATION_TEXT}</TermsText>
        <Title>{Terms.TERMS_PROHIBITED_ACTIVITIES_TITLE}</Title>
        <TermsText>{Terms.TERMS_PROHIBITED_ACTIVITIES_TEXT}</TermsText>
        <TermsList>{Terms.TERMS_PROHIBITED_ACTIVITIES_LIST}</TermsList>
        <Title>{Terms.TERMS_CONDUCT_ON_SCOBY_SOCIAL_TITLE}</Title>
        <TermsText>{Terms.TERMS_CONDUCT_ON_SCOBY_SOCIAL_TEXT}</TermsText>
        <Title>{Terms.TERMS_USER_GENERATED_CONTRIBUTIONS_TITLE}</Title>
        <TermsText>{Terms.TERMS_USER_GENERATED_CONTRIBUTIONS_TEXT}</TermsText>
        <TermsList>{Terms.TERMS_USER_GENERATED_CONTRIBUTIONS_LIST}</TermsList>
        <Title>{Terms.TERMS_CONTRIBUTION_LICENSE_TITLE}</Title>
        <TermsText>{Terms.TERMS_CONTRIBUTION_LICENSE_TEXT}</TermsText>
        <Title>{Terms.TERMS_GUIDELINES_FOR_REVIEWS_TITLE}</Title>
        <TermsText>{Terms.TERMS_GUIDELINES_FOR_REVIEWS_TEXT}</TermsText>
        <Title>{Terms.TERMS_MOBILE_APPLICATION_LICENSE_TITLE}</Title>
        <Title>{Terms.TERMS_MOBILE_APPLICATION_LICENSE_SUBTITLE_1_TITLE}</Title>
        <TermsText>{Terms.TERMS_MOBILE_APPLICATION_LICENSE_SUBTITLE_1_TEXT}</TermsText>
        <Title>{Terms.TERMS_MOBILE_APPLICATION_LICENSE_SUBTITLE_2_TITLE}</Title>
        <TermsText>{Terms.TERMS_MOBILE_APPLICATION_LICENSE_SUBTITLE_2_TEXT}</TermsText>
        <Title>{Terms.TERMS_MOBILE_APPLICATION_LICENSE_SUBTITLE_3_TITLE}</Title>
        <TermsText>{Terms.TERMS_MOBILE_APPLICATION_LICENSE_SUBTITLE_3_TEXT}</TermsText>
        <Title>{Terms.TERMS_MOBILE_APPLICATION_LICENSE_SUBTITLE_4_TITLE}</Title>
        <TermsText>{Terms.TERMS_MOBILE_APPLICATION_LICENSE_SUBTITLE_4_TEXT}</TermsText>
        <Title>{Terms.TERMS_THIRD_PART_WEBSITES_AND_CONTENT_TITLE}</Title>
        <TermsText>{Terms.TERMS_THIRD_PARTY_WEBSITES_AND_CONTENT_TEXT}</TermsText>
        <Title>{Terms.TERMS_SPONSORS_TITLE}</Title>
        <TermsText>{Terms.TERMS_SPONSORS_TEXT}</TermsText>
        <Title>{Terms.TERMS_SITE_MANAGEMENT_TITLE}</Title>
        <TermsText>{Terms.TERMS_SITE_MANAGEMENT_TEXT}</TermsText>
        <Title>{Terms.TERMS_PRIVACY_POLICY_TITLE}</Title>
        <TermsText>
          {Terms.TERMS_PRIVACY_POLICY_TEXT_START} {<OpenURL url={Terms.TERMS_PRIVACY_POLICY_TEXT_LINK} />}
          {Terms.TERMS_PRIVACY_POLICY_TEXT_END}
        </TermsText>
        <Title>{Terms.TERMS_DIGITAL_MILLENNIUM_COPYRIGHT_TITLE}</Title>
        <Title>{Terms.TERMS_DIGITAL_MILLENNIUM_COPYRIGHT_1_TITLE}</Title>
        <TermsText>{Terms.TERMS_DIGITAL_MILLENNIUM_COPYRIGHT_1_TEXT}</TermsText>
        <Title>{Terms.TERMS_DIGITAL_MILLENNIUM_COPYRIGHT_2_TITLE}</Title>
        <TermsText>
          {Terms.TERMS_DIGITAL_MILLENNIUM_COPYRIGHT_2_TEXT}{' '}
          {
            <OpenURL
              url={`mailto:${Terms.TERMS_DIGITAL_MILLENNIUM_COPYRIGHT_EMAIL}`}
              email={Terms.TERMS_DIGITAL_MILLENNIUM_COPYRIGHT_EMAIL}
            />
          }
        </TermsText>
        <Title>{Terms.TERMS_COPYRIGHT_INFRINGEMENTS_TITLE}</Title>
        <TermsText>{Terms.TERMS_COPYRIGHT_INFRINGEMENTS_TEXT}</TermsText>
        <Title>{Terms.TERMS_TERM_AND_TERMINATION_TITLE}</Title>
        <TermsText>{Terms.TERMS_TERM_AND_TERMINATION_TEXT}</TermsText>
        <Title>{Terms.TERMS_MODIFICATIONS_AND_INTERRUPTIONS_TITLE}</Title>
        <TermsText>{Terms.TERMS_MODIFICATIONS_AND_INTERRUPTIONS_TEXT}</TermsText>
        <Title>{Terms.TERMS_GOVERNING_LAW_TITLE}</Title>
        <TermsText>{Terms.TERMS_GOVERNING_LAW_TEXT}</TermsText>
        <Title>{Terms.TERMS_DISPUTE_RESOLUTION_TITLE}</Title>
        <Title>{Terms.TERMS_DISPUTE_RESOLUTION_1_TITLE}</Title>
        <TermsText>{Terms.TERMS_DISPUTE_RESOLUTION_1_TEXT}</TermsText>
        <Title>{Terms.TERMS_DISPUTE_RESOLUTION_2_TITLE}</Title>
        <TermsText>{Terms.TERMS_DISPUTE_RESOLUTION_2_TEXT}</TermsText>
        <Title>{Terms.TERMS_DISPUTE_RESOLUTION_3_TITLE}</Title>
        <TermsText>{Terms.TERMS_DISPUTE_RESOLUTION_3_TEXT}</TermsText>
        <Title>{Terms.TERMS_DISPUTE_RESOLUTION_4_TITLE}</Title>
        <TermsText>{Terms.TERMS_DISPUTE_RESOLUTION_4_TEXT}</TermsText>
        <Title>{Terms.TERMS_CORRECTIONS_TITLE}</Title>
        <TermsText>{Terms.TERMS_CORRECTIONS_TEXT}</TermsText>
        <Title>{Terms.TERMS_DISCLAIMER_TITLE}</Title>
        <TermsText>{Terms.TERMS_DISCLAIMER_TEXT}</TermsText>
        <Title>{Terms.TERMS_LIMITATIONS_OF_LIABILITY_TITLE}</Title>
        <TermsText>{Terms.TERMS_LIMITATIONS_OF_LIABILITY_TEXT}</TermsText>
        <Title>{Terms.TERMS_INDEMNIFICATION_TITLE}</Title>
        <TermsText>{Terms.TERMS_INDEMNIFICATION_TEXT}</TermsText>
        <Title>{Terms.TERMS_USER_DATA_TITLE}</Title>
        <TermsText>{Terms.TERMS_USER_DATA_TEXT}</TermsText>
        <Title>{Terms.TERMS_ELECTRONIC_COMMUNICATIONS_TITLE}</Title>
        <TermsText>{Terms.TERMS_ELECTRONIC_COMMUNICATIONS_TEXT}</TermsText>
        <Title>{Terms.TERMS_CALIFORNIA_USERS_TITLE}</Title>
        <TermsText>{Terms.TERMS_CALIFORNIA_USERS_TEXT}</TermsText>
        <Title>{Terms.TERMS_MISCELLANEOUS_TITLE}</Title>
        <TermsText>{Terms.TERMS_MISCELLANEOUS_TEXT}</TermsText>
        <Title>{Terms.TERMS_CONTACT_US_TITLE}</Title>
        <TermsText style={{marginBottom: 120}}>{Terms.TERMS_CONTACT_US_TEXT}</TermsText>
      </TermsContainer>
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0}}
        style={[{position: 'absolute', zIndex: 2000, bottom: 0, width: '100%', height: 100}]}
        colors={[`rgba(98, 52, 183, ${1})`, `rgba(98, 52, 183, ${0})`]}
        pointerEvents="none"
      />
    </Container>
  );
};

export default TermsScrollView;
