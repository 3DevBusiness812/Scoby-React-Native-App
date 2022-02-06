import styled from 'styled-components';
import colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

export const Header = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: 48,
});

export const HeaderLeftButton = styled.TouchableOpacity({
  paddingLeft: 24,
  minWidth: 72,
  justifyContent: 'flex-start',
});

export const HeaderRightButton = styled.TouchableOpacity({
  minWidth: 72,
  justifyContent: 'flex-end',
  paddingRight: 24,
});

export const HeaderButtonText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  color: colors.white,
  paddingVertical: 24,
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
});

export const HeaderTitleText = styled.Text({
  ...Fonts.avenirBold,
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  paddingVertical: 24,
  fontSize: 16,
  color: colors.white,
});

export const HeaderButtonTextPrimary = styled.Text(({disabled}) => ({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  color: disabled ? colors.regularText : colors.newPink,
  paddingVertical: 24,
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'right',
}));
