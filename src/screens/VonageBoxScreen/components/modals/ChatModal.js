import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, KeyboardAvoidingView, Keyboard, Animated, Platform} from 'react-native';
import {AutoScrollFlatList} from 'react-native-autoscroll-flatlist';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import fonts from 'src/constants/Fonts';
import BottomModal from 'src/components/BottomModal';
import {SendChatIcon} from 'assets/svg';
import {statusBarHeight} from 'src/components/withSafeArea';
import {topBarHeight} from '../TopBar';

const keyboardShowEventName = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const keyboardHideEventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
const animationDuration = Platform.OS === 'ios' ? 200 : 100;

const Wrapper = styled.View({
  width: '100%',
});

const Title = styled.Text({
  ...fonts.avenirBold,
  fontSize: 16,
  color: colors.white,
  paddingBottom: 16,
});

const InputWrapper = styled.View({
  flexDirection: 'row',
});

const Input = styled.TextInput({
  height: 40,
  paddingHorizontal: 8,
  flex: 1,
  borderRadius: 6,
  backgroundColor: colors.chatInputBackground,
  color: colors.chatInputText,
  marginRight: 16,
});

const SendButton = styled.TouchableOpacity({
  height: 44,
  alignItems: 'center',
  justifyContent: 'center',
});

const MessageRow = styled.View({
  alignSelf: 'flex-start',
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingBottom: 16,
});

const Author = styled.Text({
  ...fonts.avenir,
  fontSize: 14,
  color: colors.white,
});

const Message = styled.Text({
  ...fonts.avenirSemiBold,
  fontSize: 14,
  color: colors.white,
  paddingLeft: 8,
});

const DoneBar = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'flex-end',
  marginTop: 16,
  marginLeft: -24,
  marginRight: -24,
  height: 42,
  backgroundColor: colors.translucentGrey,
});

const DoneText = styled.Text({
  ...fonts.avenirSemiBold,
  fontSize: 14,
  paddingRight: 16,
  color: colors.white,
});

const styles = StyleSheet.create({
  messages: {
    alignItems: 'flex-start',
  },
});

function ChatItem({item}) {
  return (
    <MessageRow>
      <Author>{item.username}</Author>
      <Message>{item.text}</Message>
    </MessageRow>
  );
}

export default function ChatModal({visible, onRequestClose, messagesChat, sendMessage}) {
  const [text, setText] = useState('');
  const [height, setHeight] = useState(0);
  const translation = useRef(new Animated.Value(32)).current;

  const handleSend = useCallback(() => {
    if (text?.length > 0) {
      sendMessage(text);
      setText('');
    }
  }, [sendMessage, text]);

  const handleLayout = useCallback((e) => {
    setHeight(e.nativeEvent.layout.height);
  }, []);

  const handleDone = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const showDoneBar = useCallback(() => {
    Animated.timing(translation, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [translation]);

  const hideDoneBar = useCallback(() => {
    Animated.timing(translation, {
      toValue: 32,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [translation]);

  useEffect(() => {
    if (visible) {
      Keyboard.addListener(keyboardShowEventName, showDoneBar);
      Keyboard.addListener(keyboardHideEventName, hideDoneBar);
    }

    return () => {
      Keyboard.removeListener(keyboardShowEventName, showDoneBar);
      Keyboard.removeListener(keyboardHideEventName, hideDoneBar);
    };
  }, [hideDoneBar, showDoneBar, visible]);

  return (
    <BottomModal
      visible={visible}
      onRequestClose={onRequestClose}
      onLayout={handleLayout}
      title={<Title>Live chat</Title>}>
      <Wrapper height={height - topBarHeight - statusBarHeight - 64}>
        <AutoScrollFlatList
          threshold={20}
          data={messagesChat}
          renderItem={ChatItem}
          keyExtractor={(item) => item.username + item.text}
          contentContainerStyle={styles.messages}
        />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={topBarHeight + statusBarHeight + 64}>
          <Animated.View style={{transform: [{translateY: translation}]}}>
            <InputWrapper>
              <Input
                onChangeText={setText}
                value={text}
                placeholder="Say something..."
                placeholderTextColor="rgba(0, 0, 0, 0.6)"
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
              <SendButton onPress={handleSend}>
                <SendChatIcon />
              </SendButton>
            </InputWrapper>
          </Animated.View>
          <Animated.View
            style={{transform: [{translateY: translation.interpolate({inputRange: [0, 32], outputRange: [-6, 40]})}]}}>
            <DoneBar onPress={handleDone}>
              <DoneText>Done</DoneText>
            </DoneBar>
          </Animated.View>
        </KeyboardAvoidingView>
      </Wrapper>
    </BottomModal>
  );
}
