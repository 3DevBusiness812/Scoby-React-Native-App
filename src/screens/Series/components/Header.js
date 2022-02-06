import styled from 'styled-components';
import colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

export const Header = styled.View({
  justifyContent: 'space-between',
  flexDirection: 'row',
  marginTop: 0,
  marginHorizontal: 10,
});

export const TitleHeaderText = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  color: colors.white,
  paddingVertical: 32,
  paddingHorizontal: 16,
});
