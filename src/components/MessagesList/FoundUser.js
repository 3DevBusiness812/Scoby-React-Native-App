import React from 'react';
import styled from 'styled-components/native';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {VerifiedIco} from 'assets/svg';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';
import {TouchableWithoutFeedback} from 'react-native';
import {ACTIVITY_KEYS} from 'src/screens/Activity/ActivityKeys';

const ListText = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: Colors.white,
});

const Avatar = styled.Image({
  width: 44,
  height: 44,
  borderRadius: 44,
});

const VerifiedContainer = styled.View({
  flex: 0,
  paddingHorizontal: 8,
});

const User = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 16,
});

const Username = styled.View({
  flex: 1,
  paddingLeft: 16,
  paddingRight: 32,
  flexDirection: 'row',
});

const FoundUser = ({item: {item}, navigation}) => {
  const {id, fullName, username, role, avatar} = item || {};

  const privateChatNavigationParams = {id, fullName, username, role, avatar};
  const goToPrivateChat = () => navigation.navigate(ACTIVITY_KEYS.PRIVATE_CHAT, privateChatNavigationParams);

  return (
    <TouchableWithoutFeedback onPress={goToPrivateChat} touchSoundDisabled>
      <User>
        <Avatar source={item.avatar ? {uri: item.avatar} : avatarSrc} />
        <Username>
          <ListText numberOfLines={1}>{item.fullName || item.username}</ListText>
          {item.role && item.role === 'creator' && (
            <VerifiedContainer>
              <VerifiedIco />
            </VerifiedContainer>
          )}
        </Username>
      </User>
    </TouchableWithoutFeedback>
  );
};

export default FoundUser;
