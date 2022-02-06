import React from 'react';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import coverImage from 'assets/images/profile/Cover.png';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';

const Wrapper = styled.View({});

const TopContent = styled.TouchableOpacity({
  width: '100%',
  height: 144,
});

const BgImage = styled.ImageBackground({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

const Avatar = styled.TouchableOpacity({
  width: 96,
  height: 96,
  marginTop: -48,
  marginLeft: 16,
  borderWidth: 4,
  borderRadius: 48,
  borderColor: colors.blueBackgroundSession,
  backgroundColor: colors.black,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

const AvatarImage = styled.Image({
  width: '100%',
  height: '100%',
  opacity: 1,
});

export default function HeaderWithImage({avatar, backgroundImage, nonBlink}) {
  return (
    <Wrapper>
      <TopContent activeOpacity={nonBlink ? 1 : 0.2}>
        <BgImage source={backgroundImage ? {uri: backgroundImage} : coverImage} resizeMode="cover" />
      </TopContent>
      <Avatar activeOpacity={nonBlink ? 1 : 0.2}>
        <AvatarImage source={avatar ? {uri: avatar} : avatarSrc} style={{resizeMode: 'cover'}} />
      </Avatar>
    </Wrapper>
  );
}
