import React from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

const Wrapper = styled.View({
  marginTop: 12,
  marginBottom: 14,
  borderRadius: 8,
  justifyContent: 'center',
  backgroundColor: Colors.white,
  zIndex: 100,
});

const Input = styled.TextInput({
  ...Fonts.avenir,
  height: 42,
  padding: 0,
  paddingLeft: 32,
  paddingRight: 16,
  color: Colors.chatInputText,
  backgroundColor: Colors.white,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
});

const LeftIcon = styled.View({
  position: 'absolute',
  left: 0,
  margin: 8,
  marginLeft: 12,
  zIndex: 10,
});

const RightIcon = styled.TouchableOpacity({
  position: 'absolute',
  right: 0,
  zIndex: 10,
  padding: 12,
});

export default function FilterInput({
  value,
  onChangeText,
  placeholderTextColor = Colors.backgroundSearchBar,
  ...props
}) {
  const clearInput = () => onChangeText('');
  return (
    <Wrapper>
      <LeftIcon pointerEvents="none">
        <Ionicons name="search" color={Colors.iconGrey} size={18} />
      </LeftIcon>
      <Input
        value={value}
        placeholder="Search"
        placeholderTextColor={placeholderTextColor}
        onChangeText={onChangeText}
        {...props}
      />
      <RightIcon onPress={clearInput}>
        {value.length > 0 && <Ionicons name="close-circle" color={Colors.iconGrey} size={16} />}
      </RightIcon>
    </Wrapper>
  );
}
