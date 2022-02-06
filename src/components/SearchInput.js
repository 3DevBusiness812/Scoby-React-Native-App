import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

const paddingVertical = 16;
const height = 36;

export const searchHeight = paddingVertical + height;

const Wrapper = styled.View({
  paddingVertical,
  marginHorizontal: 24,
  justifyContent: 'center',
  backgroundColor: Colors.blueBackgroundSession,
  zIndex: 100,
});

const Input = styled.TextInput({
  ...Fonts.avenir,
  height,
  borderRadius: 8,
  padding: 0,
  paddingLeft: 32,
  paddingRight: 16,
  color: Colors.chatInputText,
  backgroundColor: Colors.chatInputBackground,
  alignItems: 'center',
  justifyContent: 'center',
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

export default function SearchInput({onChangeText, ...props}) {
  const handleClearText = useCallback(() => {
    onChangeText('');
  }, [onChangeText]);

  return (
    <Wrapper style={props.style}>
      <LeftIcon pointerEvents="none">
        <Ionicons name="search" color="rgba(0, 0, 0, 0.6)" size={16} />
      </LeftIcon>
      <Input
        returnKeyType="done"
        placeholder="Search"
        placeholderTextColor={Colors.translucentBlack}
        onChangeText={onChangeText}
        {...props}
      />
      <RightIcon onPress={handleClearText}>
        {props.value.length > 0 && <Ionicons name="close-circle" color="rgba(0, 0, 0, 0.6)" size={16} />}
      </RightIcon>
    </Wrapper>
  );
}
