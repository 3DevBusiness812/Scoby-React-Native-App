import React from 'react';
import styled from 'styled-components/native';
import {VerifiedIco} from 'assets/svg';
import Fonts from 'src/constants/Fonts';

const Container = styled.View({
  width: '100%',
  height: 603,
});
const Header = styled.View({
  width: '100%',
  height: 72,
  padding: 16,
  display: 'flex',
  flexDirection: 'row',
});
const AvatarContainer = styled.View({
  width: '15%',
});
const Avatar = styled.Image({
  width: 44,
  height: 44,
  borderRadius: 44,
});
const UserInfo = styled.View({
  width: '70%',
  height: '100%',
  paddingLeft: 7,
});
const UserName = styled.Text({
  ...Fonts.avenir,
  color: '#1E1F20',
  fontSize: 16,
  paddingRight: 5,
});
const UserAddress = styled.Text({
  ...Fonts.avenir,
  color: '#9094A2',
  fontSize: 13,
});
const UserFollowing = styled.View({
  width: '15%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});
const UserFollowingText = styled.Text({
  ...Fonts.avenir,
  fontSize: 13,
  color: '#9094A2',
});
const Border = styled.View({
  width: '100%',
  height: 0.5,
  backgroundColor: '#E5EAF2',
});
const Body = styled.View({
  width: '100%',
  height: 468,
  flexDirection: 'row',
  display: 'flex',
  flexWrap: 'wrap',
});
const ImageWrap = styled.View(() => ({
  width: '100%',
  height: '50%',
}));

const BackgroundImage = styled.Image(() => ({
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
}));
const Footer = styled.View({
  width: '100%',
  padding: 16,
});
const FooterText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: '#1E1F20',
  lineHeight: '20px',
});
const VerifiedUser = styled.View({
  display: 'flex',
  flexDirection: 'row',
  paddingBottom: 4,
});

export default function FeedItem(props) {
  const {verified, address, description, name, people, participantUsers, ownerUser} = props;

  const defaultAva = () => (
    <Avatar
      source={{
        uri: 'https://10fthoop.com/home/core_themes/item_1/noimage/noimage.png',
      }}
    />
  );

  return (
    <Container>
      <Header>
        <AvatarContainer>
          {/* eslint-disable-next-line no-nested-ternary */}
          {ownerUser ? ownerUser.avatar ? <Avatar source={{uri: ownerUser.avatar}} /> : defaultAva() : null}
        </AvatarContainer>
        <UserInfo>
          <VerifiedUser>
            {/* TODO: IF the user’s fullname is not specified
            THEN the user’s nickname should be displayed instead
            (including “@“at the beginning of the value) */}
            <UserName ellipsizeMode="tail" numberOfLines={1}>
              {name || ''}
            </UserName>
            {verified ? <VerifiedIco /> : null}
          </VerifiedUser>
          {/* TODO: “Location“ - for displaying the user’s
          // location in the following format:
          {<Users location city>, <User’s location alpha-2 country>} (left-aligned) */}
          {/* TODO:“Session duration“ - for displaying
          the session duration which should be calculated as
          (<current date&time> - <session start date&time>) with rounding to minutes; */}
          <UserAddress ellipsizeMode="tail" numberOfLines={1}>
            {address || ''}
          </UserAddress>
        </UserInfo>
        <UserFollowing>
          <UserFollowingText>{people || ''}</UserFollowingText>
        </UserFollowing>
      </Header>
      <Body>
        {/* eslint-disable-next-line no-nested-ternary */}
        {participantUsers ? (
          participantUsers.length === 0 ? (
            <ImageWrap style={{width: '100%', height: '100%'}}>
              <BackgroundImage source={{uri: ownerUser.backgroundImage}} />
            </ImageWrap>
          ) : null
        ) : (
          <ImageWrap style={{width: '100%', height: '100%'}}>
            <BackgroundImage source={{uri: ownerUser.backgroundImage}} />
          </ImageWrap>
        )}
        {/* eslint-disable-next-line no-nested-ternary */}
        {participantUsers ? (
          participantUsers.length === 1 ? (
            <>
              <ImageWrap style={{width: '100%', height: '50%'}}>
                <BackgroundImage source={{uri: ownerUser.backgroundImage}} />
              </ImageWrap>
              <ImageWrap style={{width: '100%', height: '50%'}}>
                <BackgroundImage source={{uri: participantUsers[0].avatar}} />
              </ImageWrap>
            </>
          ) : null
        ) : null}
        {/* eslint-disable-next-line no-nested-ternary */}
        {participantUsers ? (
          participantUsers.length === 2 ? (
            <>
              <ImageWrap style={{width: '100%', height: '50%'}}>
                <BackgroundImage source={{uri: ownerUser.backgroundImage}} />
              </ImageWrap>

              <ImageWrap style={{width: '50%', height: '50%'}}>
                <BackgroundImage source={{uri: participantUsers[0].avatar}} />
              </ImageWrap>
              <ImageWrap style={{width: '50%', height: '50%'}}>
                <BackgroundImage source={{uri: participantUsers[1].avatar}} />
              </ImageWrap>
            </>
          ) : null
        ) : null}
        {/* eslint-disable-next-line no-nested-ternary */}
        {participantUsers ? (
          participantUsers.length === 3 ? (
            <>
              <ImageWrap style={{width: '50%', height: '50%'}}>
                <BackgroundImage source={{uri: ownerUser.backgroundImage}} />
              </ImageWrap>
              <ImageWrap style={{width: '50%', height: '50%'}}>
                <BackgroundImage source={{uri: participantUsers[0].avatar}} />
              </ImageWrap>
              <ImageWrap style={{width: '50%', height: '50%'}}>
                <BackgroundImage source={{uri: participantUsers[1].avatar}} />
              </ImageWrap>
              <ImageWrap style={{width: '50%', height: '50%'}}>
                <BackgroundImage source={{uri: participantUsers[2].avatar}} />
              </ImageWrap>
            </>
          ) : null
        ) : null}
      </Body>
      <Footer>
        <FooterText ellipsizeMode="tail" numberOfLines={2}>
          {description || ''}
        </FooterText>
      </Footer>
      <Border />
    </Container>
  );
}
