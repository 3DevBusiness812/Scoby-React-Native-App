import React from 'react';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';
import {TERMS_TEXT_LINE2, TERMS_TEXT_LINE2_LINK, PRIVACY_URL} from 'src/constants/Texts';
import openLink from 'src/utils/hook/openLink';

const Wrapper = styled.View((props) => ({
  flexDirection: 'row',
  alignItems: 'center',
  width: props.fullWidth ? '100%' : '93%',
  minHeight: 60,
  paddingLeft: 7,
}));
const Text = styled.Text({
  ...fonts.avenir,
  fontSize: 12,
  lineHeight: '20px',
  color: colors.white,
});
const LinkText = styled.Text({
  ...fonts.avenirBold,
  lineHeight: '20px',
  color: colors.white,
  textDecorationLine: 'underline',
});

export default function TermsPolicy({fullWidth, style}) {
  return (
    <Wrapper fullWidth={fullWidth} style={style}>
      <Text>
        {TERMS_TEXT_LINE2}
        <LinkText
          onPress={() => {
            openLink(PRIVACY_URL);
          }}>
          {TERMS_TEXT_LINE2_LINK}
        </LinkText>
      </Text>
    </Wrapper>
  );
}
