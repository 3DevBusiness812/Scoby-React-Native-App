/* eslint-disable no-use-before-define */
import React from 'react';
import styled from 'styled-components/native';
import {Image, StyleSheet} from 'react-native';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {ACTIVITY_KEYS} from 'src/screens/Activity/ActivityKeys';
import {useLastMessage} from 'src/utils/hook/useLastMessage';

const Wrapper = styled.TouchableOpacity({
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginTop: 25,
  width: 380,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
});

const Img = styled.View({
  borderRadius: 50,
  width: 50,
  height: 50,
});

const Content = styled.View({
  marginLeft: 16,
});

const Sender = styled.Text({
  ...Fonts.avenirSemiBold,
  color: Colors.white,
  marginBottom: 6,
});

const UnreadSender = styled.Text({
  ...Fonts.avenirBold,
  color: Colors.white,
  marginBottom: 6,
});

const Text = styled.Text({
  ...Fonts.avenir,
  color: Colors.greySession,
  marginRight: 8,
});

const MessageContent = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

function Message({item, navigation, currUser}) {
  const {ago, message, fullName, image, id, isAnyUnread, username} = useLastMessage(item, currUser);
  const goToPrivateChat = () => navigation.navigate(ACTIVITY_KEYS.PRIVATE_CHAT, {id});

  return (
    <Wrapper onPress={goToPrivateChat}>
      <Img>
        <Image resizeMode="cover" source={image ? {uri: image} : avatarSrc} style={styles.image} />
      </Img>
      <Content>
        {isAnyUnread ? (
          <UnreadSender>{fullName ? fullName?.trim() : username?.trim()}</UnreadSender>
        ) : (
          <Sender>{fullName ? fullName?.trim() : username?.trim()}</Sender>
        )}
        <MessageContent>
          <Text>{message}</Text>
          <Text>{ago}</Text>
        </MessageContent>
      </Content>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  image: {width: 50, height: 50, borderRadius: 50},
});

export default Message;
