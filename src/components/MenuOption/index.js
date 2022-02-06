import React from 'react';
import {MenuOption} from 'react-native-popup-menu';
import styled from 'styled-components/native';
import Fonts from 'src/constants/Fonts';

const Text = styled.Text({
  ...Fonts.avenirSemiBold,
  color: '#4A2098',
  fontSize: 15,
});

export default function CustomMenuOption({value, label, onClick}) {
  return (
    <MenuOption value={value} onSelect={onClick} style={{paddingLeft: 10, paddingVertical: 8}}>
      <Text>{label}</Text>
    </MenuOption>
  );
}
