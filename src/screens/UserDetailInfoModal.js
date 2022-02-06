import React, {useCallback, useContext, useEffect} from 'react';
import {Linking, Modal, Platform, Alert, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useQuery} from '@apollo/client';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {CloseWhiteIco} from 'assets/svg';
import styled from 'styled-components/native';
import Colors from 'src/constants/Colors';
import openLink from 'src/utils/hook/openLink';
import RegularButton from 'src/components/RegularButton';
import {GET_USER_PROFILE, GET_USER_SERIES} from 'src/graphql/queries/profile';
import coverImage from 'assets/images/profile/Cover.png';
import Geocoder from 'react-native-geocoding';
import {WebsiteIco, LocationIco} from 'assets/ico';
import MyFollowersContent from 'src/screens/Profile/components/MyFollowersContent';
import Follow from 'src/components/Follow';
import {FollowersContext} from 'src/containers/followers';
import {statusBarHeight} from 'src/components/withSafeArea';
import Fonts from 'src/constants/Fonts';
import {GlobalContext} from 'src/containers/global';
import {SeriesProfile} from 'src/components/Series';
import {ACTIVITY_KEYS} from './Activity/ActivityKeys';

const Wrapper = styled.View({
  flex: 1,
  backgroundColor: Colors.blueBackgroundSession,
  paddingTop: statusBarHeight,
});

const MainContent = styled.View({
  marginHorizontal: 24,
});

const TitleText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  lineHeight: '21px',
  color: Colors.white,
  marginVertical: 8,
});

const ContentText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  lineHeight: '21px',
  color: Colors.regularText,
});

const Block = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

const BlockSeparator = styled.View({
  paddingHorizontal: 8,
});

const Separator = styled.View({
  width: 0.5,
  height: 20,
  backgroundColor: '#e5eaf2',
});

const BlockContainer = styled.View({
  flexDirection: 'row',
  marginTop: 16,
});

const LocationText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: Colors.lightPurple,
  flex: 1,
  paddingLeft: 8,
});

const OpenLinkBtn = styled.TouchableOpacity({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const CloseButton = styled.TouchableOpacity({
  position: 'absolute',
  left: 0,
});

const HeaderText = styled.Text({
  ...Fonts.avenirBold,
  color: Colors.white,
  fontSize: 16,
  textAlign: 'center',
});

const TopRow = styled.View({
  flexDirection: 'row',
  height: 60,
  alignItems: 'center',
  justifyContent: 'center',
});

const TopContent = styled.View`
  flex-direction: column;
  height: 144px;
`;

const BgImage = styled.ImageBackground`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 144px;
`;

const Avatar = styled.TouchableOpacity({
  width: 96,
  height: 96,
  marginTop: -48,
  marginLeft: 16,
  borderWidth: 4,
  borderRadius: 48,
  borderColor: Colors.blueBackgroundSession,
  backgroundColor: Colors.black,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

const AvatarImage = styled.Image`
  height: 100%;
  width: 100%;
  border-radius: 48px;
`;

const Actions = styled.View({
  paddingTop: 20,
  flexDirection: 'row',
});

const ActivityIndicator = styled.ActivityIndicator({
  width: '100%',
  height: '100%',
});

const ButtonWrapper = styled.View({
  flex: 1,
});

const FollowButton = styled(Follow)({
  marginRight: 4,
  alignItems: 'center',
  justifyContent: 'center',
});

const MessageButton = styled(RegularButton)({
  marginLeft: 4,
  alignItems: 'center',
  justifyContent: 'center',
});

export default function UserDetailInfoModal({info, onClose, navigation, route, nonBlink}) {
  const externalProvidedUserID = route?.params?.id;
  const fade = route?.params?.fade;
  const id = externalProvidedUserID || info;
  const {currentUserProfile} = useContext(FollowersContext);
  const {loading, data, error} = useQuery(GET_USER_PROFILE, {variables: {id: parseFloat(id, 10)}});
  const profileOfUser = data?.getUserProfile;
  const {setInitialLink} = useContext(GlobalContext);
  const safeNavigation = useNavigation();

  const {data: {getUserSeries} = [], loading: isSeriesLoading} = useQuery(GET_USER_SERIES, {
    variables: {id: parseFloat(id, 10)},
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    setInitialLink(null);
    if (error) {
      Alert.alert(error.message);
      if (externalProvidedUserID) {
        navigation.navigate('MainTabs');
      }
    }
  }, [error, externalProvidedUserID, navigation, setInitialLink]);

  const navigateToChat = (profile) => {
    const {id: userid, fullName, role, username} = profile || {};
    if (profile) safeNavigation.replace(ACTIVITY_KEYS.PRIVATE_CHAT, {id: userid, fullName, role, username});
  };

  const handleClose = useCallback(() => {
    if (typeof onClose === 'function') {
      onClose();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (externalProvidedUserID) {
      navigation.reset({index: 0, routes: [{name: 'MainTabs', screen: 'Profile'}]});
    } else {
      navigation.reset({index: 0, routes: [{name: 'MainTabs', screen: 'Home'}]});
    }
  }, [externalProvidedUserID, navigation, onClose]);

  const openGps = useCallback(
    (lat, lng) => {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${lat},${lng}`;
      const label = profileOfUser ? `${profileOfUser.username}` : '';
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.openURL(url);
    },
    [profileOfUser],
  );

  const geocode = useCallback(
    (address) => {
      Geocoder.from(address)
        .then((json) => {
          const {location} = json.results[0].geometry;
          openGps(location.lat, location.lng);
        })
        .catch(() => {});
    },
    [openGps],
  );

  const getHeader = () => (
    <>
      <TopRow>
        <CloseButton onPress={handleClose}>
          <CloseWhiteIco />
        </CloseButton>
        <HeaderText>{profileOfUser.fullName || profileOfUser.username}</HeaderText>
      </TopRow>
      <TopContent>
        <BgImage
          source={profileOfUser.backgroundImage ? {uri: profileOfUser.backgroundImage} : coverImage}
          style={{resizeMode: 'stretch'}}
        />
      </TopContent>
      <Avatar activeOpacity={nonBlink ? 1 : 0.2}>
        <AvatarImage source={profileOfUser.avatar ? {uri: profileOfUser.avatar} : avatarSrc} resizeMode="cover" />
      </Avatar>
      <MyFollowersContent navigation={safeNavigation} userId={profileOfUser.id} />
      <MainContent>
        <TitleText>{profileOfUser ? `@${profileOfUser.username}` : ''}</TitleText>
        {profileOfUser?.bio ? <ContentText>{profileOfUser ? profileOfUser.bio : ''}</ContentText> : null}
        {(profileOfUser.location || profileOfUser.website) && (
          <BlockContainer>
            {profileOfUser.location ? (
              <Block>
                {/* TODO: need add action for opening location on map */}
                <OpenLinkBtn onPress={() => geocode(profileOfUser.location)}>
                  <LocationIco />
                  <LocationText numberOfLines={1}>{profileOfUser.location}</LocationText>
                </OpenLinkBtn>
              </Block>
            ) : null}
            {profileOfUser.location && profileOfUser.website ? (
              <BlockSeparator>
                <Separator />
              </BlockSeparator>
            ) : null}
            {profileOfUser.website ? (
              <Block>
                <OpenLinkBtn onPress={() => openLink(profileOfUser.website.toLowerCase())}>
                  <WebsiteIco />
                  <LocationText numberOfLines={1}>{profileOfUser.website.toLowerCase()}</LocationText>
                </OpenLinkBtn>
              </Block>
            ) : null}
          </BlockContainer>
        )}
        {profileOfUser.id !== currentUserProfile.id && (
          <Actions>
            <ButtonWrapper>
              <FollowButton user={profileOfUser} navigation={safeNavigation} />
            </ButtonWrapper>
            <ButtonWrapper>
              <MessageButton onPress={() => navigateToChat(profileOfUser)} active title="Message" />
            </ButtonWrapper>
          </Actions>
        )}
      </MainContent>
    </>
  );

  const openSeries = (series) => {
    handleClose();
    navigation.navigate('SeriesLandingView', {id: series.id});
  };

  const handleInvite = (seriesObj) => {
    handleClose();
    navigation.navigate('InviteUsers', {sessionParams: {experience: 'seriesInvite', series: seriesObj}});
  };

  const handleWatchMembers = (subscribedUsers) => {
    handleClose();
    navigation.navigate('SeriesMembersJoined', {subscribedUsers});
  };

  const renderItem = ({item}) => (
    <SeriesProfile
      series={item}
      handleOpen={openSeries}
      handleInvite={handleInvite}
      navigation={navigation}
      handleWatchMembers={handleWatchMembers}
    />
  );

  return (
    <>
      <Modal
        visible={id != null && !error}
        transparent
        statusBarTranslucent
        animationType={fade ? 'fade' : 'slide'}
        onRequestClose={handleClose}>
        <Wrapper>
          {loading || error || !profileOfUser || isSeriesLoading ? (
            <ActivityIndicator color={Colors.white} size="large" />
          ) : (
            <>
              <FlatList
                data={getUserSeries}
                renderItem={renderItem}
                ListHeaderComponent={getHeader()}
                keyExtractor={(item) => `${item.id}`}
              />
            </>
          )}
        </Wrapper>
      </Modal>
    </>
  );
}
