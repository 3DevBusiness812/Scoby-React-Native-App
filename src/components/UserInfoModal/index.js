/* eslint-disable no-nested-ternary */
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {screenWidth} from 'src/utils/device';
import styled from 'styled-components/native';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {WebsiteIco, LocationIco, RemoveUserIco, BlockUserIco, CheckIco} from 'assets/ico';
import colors from 'src/constants/Colors';
import openLink from 'src/utils/hook/openLink';
import {coverIco} from 'assets/images/modal';
import {useQuery} from '@apollo/client';
import {GET_USER_PROFILE} from 'src/graphql/queries/profile';
import Fonts from 'src/constants/Fonts';

const Wrapper = styled.TouchableOpacity({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  paddingHorizontal: 16,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
});

const ContainerBig = styled.View({
  width: '100%',
  height: 325,
  backgroundColor: 'white',
  borderRadius: 15,
  marginBottom: 8,
  position: 'relative',
});

const ContainerSmall = styled.View({
  width: 250,
  height: 95,
  backgroundColor: 'rgba(245, 245, 245, 0.8)',
  borderRadius: 15,
  marginRight: screenWidth - 280,
});

const Image = styled.Image({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: 104,
  resizeMode: 'cover',
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
});

const WrapperAva = styled.View({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const ContentWrapper = styled.View({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
});

const Ava = styled.Image({
  width: 90,
  height: 90,
  resizeMode: 'cover',
  borderRadius: 200,
  marginTop: 60,
});

const NickName = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: '#1E1F20',
  marginLeft: 10,
  marginTop: 9,
});

const Description = styled.Text({
  ...Fonts.avenir,
  fontSize: 13,
  color: '#9094A2',
  width: 211,
  textAlign: 'center',
  lineHeight: '22px',
  marginTop: 9,
});

const BtnSeparator = styled.View({
  width: 250,
  height: 8,
  backgroundColor: 'rgba(17, 17, 17, 0.5)',
  opacity: 0.15,
});

const Btn = styled.TouchableOpacity({
  width: '100%',
  height: 44,
  backgroundColor: '#dfdfdf',
  display: 'flex',
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderColor: 'rgba(0, 0, 0, 1)',
});

const BtnBottom = styled.TouchableOpacity({
  width: '100%',
  height: 44,
  backgroundColor: '#dfdfdf',
  display: 'flex',
  flexDirection: 'row',
  borderBottomLeftRadius: 15,
  borderBottomRightRadius: 15,
});

const BtnName = styled.Text(({red}) => ({
  ...Fonts.avenir,
  fontSize: 18,
  color: red ? '#FF3B30' : 'rgba(0, 0, 0, 1)',
  paddingTop: 11,
  paddingLeft: 16,
  width: '85%',
}));

const Block = styled.View((props) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent:
    props.width === 0 || props.width === '100%' ? 'center' : props.leftPosition ? 'flex-end' : 'flex-start',
  width: props.width,
}));

const BlockSeparator = styled.View`
  align-items: center;
  justify-content: center;
  width: 10%;
`;
const SeparatorInfo = styled.View`
  width: 0.5px;
  height: 20px;
  background: #e5eaf2;
`;
const BlockContainer = styled.View`
  width: 100%;
  flex-direction: row;
`;
const LocationText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  lineHeight: '21px',
  letterSpacing: 0,
  textAlign: 'right',
  color: colors.primaryPurpleColor,
});

const WebsiteText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  lineHeight: '21px',
  letterSpacing: 0,
  textAlign: 'left',
  color: colors.primaryPurpleColor,
});

const OpenLinkBtn = styled.TouchableOpacity`
  flex-direction: row;
`;
const WebsiteIcoContainer = styled.View`
  padding: 4px;
`;

const BtnIcoContainer = styled.View({
  marginTop: 11,
});

export default function UserInfoModal({onPress, userId}) {
  const {data, loading, error} = useQuery(GET_USER_PROFILE, {
    variables: {
      id: userId,
    },
  });

  if (loading) {
    return <ActivityIndicator color={colors.white} size="large" />;
  }
  if (error) {
    return null;
  }

  const {avatar, backgroundImage, bio, fullName, username, location, website} = data.getUserProfile;

  const avatarUrl = avatar ? {uri: avatar} : avatarSrc;
  const backgroundImageUrl = backgroundImage ? {uri: backgroundImage} : coverIco;

  return (
    <Wrapper activeOpacity={1} onPress={onPress}>
      <ContainerBig>
        <Image source={backgroundImageUrl} />
        <WrapperAva>
          <Ava source={avatarUrl} />
        </WrapperAva>
        <ContentWrapper>
          <NickName>{fullName || `@${username}`}</NickName>
          <BtnIcoContainer>
            <CheckIco />
          </BtnIcoContainer>
        </ContentWrapper>
        <ContentWrapper>
          <Description>{bio || ''}</Description>
        </ContentWrapper>
        <BlockContainer>
          <Block leftPosition width={location ? (website ? '45%' : '100%') : 0}>
            {location && (
              <OpenLinkBtn>
                <WebsiteIcoContainer>
                  <LocationIco />
                </WebsiteIcoContainer>
                <LocationText>
                  {!location.length ? '' : location.length > 20 ? `${location.slice(0, 20)}...` : location}
                </LocationText>
              </OpenLinkBtn>
            )}
          </Block>
          {location && website && (
            <BlockSeparator>
              <SeparatorInfo />
            </BlockSeparator>
          )}
          <Block leftPosition={false} width={website ? (location ? '45%' : '100%') : 0}>
            {website && (
              <OpenLinkBtn onPress={() => openLink(website)}>
                <WebsiteIcoContainer>
                  <WebsiteIco />
                </WebsiteIcoContainer>
                <WebsiteText>{website}</WebsiteText>
              </OpenLinkBtn>
            )}
          </Block>
        </BlockContainer>
      </ContainerBig>
      <ContainerSmall>
        <Btn>
          <BtnName>Block User</BtnName>
          <BtnIcoContainer>
            <RemoveUserIco />
          </BtnIcoContainer>
        </Btn>
        <BtnSeparator />
        <BtnBottom>
          <BtnName red>Remove Guest</BtnName>
          <BtnIcoContainer>
            <BlockUserIco />
          </BtnIcoContainer>
        </BtnBottom>
      </ContainerSmall>
    </Wrapper>
  );
}
