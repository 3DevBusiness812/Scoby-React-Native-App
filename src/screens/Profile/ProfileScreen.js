import React, {useCallback, useContext, useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet, Alert, FlatList} from 'react-native';
import Share from 'react-native-share';
import {useQuery} from '@apollo/client';
import HeaderWithImage from 'src/components/HeaderWithImage';
import {GET_USER_PROFILE, GET_USER_SERIES} from 'src/graphql/queries/profile';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import openLink from 'src/utils/hook/openLink';
import {
  PROFILE_HEADER,
  PROFILE_BUTTON_EDIT,
  PROFILE_SUBTITLE_TO_SHARE_1,
  PROFILE_SUBTITLE_TO_SHARE_2,
  PROFILE_TITLE_TO_SHARE,
  UNKNOWN_ERROR_TEXT,
  /* PROFILE_BUTTON_TEAM, */
  MY_SHARED_EXPERIENCES,
} from 'src/constants/Texts';
import {CogIcon} from 'assets/svg';
import Fonts from 'src/constants/Fonts';
import {VerifiedIco, ShareIco} from 'assets/ico';
import {FollowersContext} from 'src/containers/followers';
import NewLargeButton from 'src/components/NewLargeButton';
import {tabsHeight} from 'src/navigation/tabs';
import {statusBarHeight} from 'src/components/withSafeArea';
import {DYNAMIC_LINKS_SHORTENER_URL, DYNAMIC_LINKS_HEADERS, DYNAMIC_LINKS_DEFAULTS} from 'src/constants/Variables';
import firebase from '@react-native-firebase/app';
import lodash from 'lodash';
import {SeriesProfile} from 'src/components/Series';
import MyFollowersContent from './components/MyFollowersContent';
import {Header, HeaderLeftButton, HeaderRightButton, HeaderTitleText} from './components/Header';

const Container = styled.View({
  flex: 1,
  backgroundColor: colors.blueBackgroundSession,
});

const TitleText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  textAlign: 'center',
  color: colors.white,
  marginVertical: 16,
});

const ProfileLinkText = styled.Text({
  ...Fonts.avenir,
  fontSize: 17,
  textAlign: 'center',
  color: colors.white,
  marginVertical: 16,
});

const FullName = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 18,
  marginVertical: 16,
  lineHeight: '26px',
  color: colors.white,
});

const ContentText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 14,
  paddingBottom: 16,
  color: colors.white,
});

const DividerLine = styled.View`
  border-bottom-color: ${colors.regularText};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  align-self: stretch;
  margin-vertical: 24px;
  width: 100%;
`;

const WebsiteText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: '#ec008c',
});

const OpenLinkBtn = styled.TouchableOpacity`
  flex-direction: row;
  padding-bottom: 12px;
  margin-bottom: 6px;
`;

const SmallText = styled.Text({
  ...Fonts.avenir,
  textAlign: 'center',
  fontSize: 14,
  lineHeight: '20px',
  color: '#9094A2',
});

const ShareProfileButton = styled.TouchableOpacity`
  padding: 8px;
  color: ${colors.white};
  background-color: #621661;
  border-radius: 64px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ShareProfileButtonText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 14,
  textAlign: 'center',
  marginRight: 16,
  color: colors.white,
});

const SettingsButton = styled.TouchableOpacity({
  position: 'absolute',
  right: 0,
  top: 0,
  padding: 16,
});

const DetailsContainer = styled.View({
  paddingHorizontal: 24,
});

const LoadingContainer = styled.View({
  flex: 1,
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.blueBackgroundSession,
});

const SeriesContainer = styled.View({
  width: '100%',
  alignSelf: 'center',
});

const SeriesText = styled.Text({
  ...Fonts.avenir,
  fontSize: 18,
  color: colors.white,
  fontWeight: 'bold',
  marginLeft: 15,
});

const HorizontalBottons = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

async function buildProfileLink(id) {
  try {
    const body = JSON.stringify(
      lodash.merge(DYNAMIC_LINKS_DEFAULTS, {
        dynamicLinkInfo: {
          link: `${DYNAMIC_LINKS_DEFAULTS.dynamicLinkInfo.domainUriPrefix}/user/${id}`,
        },
      }),
    );
    const response = await fetch(`${DYNAMIC_LINKS_SHORTENER_URL}?key=${firebase.app().options.apiKey}`, {
      method: 'POST',
      headers: DYNAMIC_LINKS_HEADERS,
      body,
    });
    const json = await response.json();
    return json.shortLink;
  } catch (error) {
    return null;
  }
}

export default function ProfileScreen({navigation, route}) {
  const {currentUserProfile, setCurrentUserProfile} = useContext(FollowersContext);
  const {id, username, fullName, avatar, website, bio, backgroundImage} = currentUserProfile;

  const {data} = useQuery(GET_USER_PROFILE, {
    pollInterval: 2000,
    variables: {
      id,
    },
  });

  const {data: {getUserSeries} = [], loading} = useQuery(GET_USER_SERIES);

  const shareButtonText = `scoby://profile/${username}`;

  const shareUrlProfile = useCallback(async () => {
    const url = await buildProfileLink(id);
    if (url) {
      Share.open({
        message: `Join me on Scoby and let’s have a Meaningful Conversation!`,
        url,
      });
    } else {
      Alert.alert(UNKNOWN_ERROR_TEXT);
    }
  }, [id]);

  const handleSettingsOpen = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  const styles = StyleSheet.create({
    scroll: {
      paddingBottom: tabsHeight + statusBarHeight,
      justifyContent: 'center',
      minHeight: '80%',
    },
    button: {
      height: 32,
      width: '50%',
      marginBottom: 0,
      marginTop: 0,
      paddingTop: 0,
    },
    buttonPurple: {
      height: 32,
      width: '45%',
      marginBottom: 0,
      marginTop: 0,
      paddingTop: 0,
      backgroundColor: colors.purple,
    },
  });

  useEffect(() => {
    if (data) {
      setCurrentUserProfile(data.getUserProfile);
    }
  }, [data, setCurrentUserProfile]);

  const openSeries = (series) => {
    const temp = {...series, landingView: true};
    navigation.navigate('SeriesLandingPage', {series: temp});
  };

  const handleInvite = (seriesObj) => {
    navigation.navigate('InviteUsers', {sessionParams: {experience: 'seriesInvite', series: seriesObj}});
  };

  const handleWatchMembers = (subscribedUsers) => {
    navigation.navigate('SeriesMembersJoined', {subscribedUsers});
  };

  const renderItem = ({item}) => (
    <SeriesProfile
      series={item}
      handleOpen={openSeries}
      handleInvite={handleInvite}
      handleWatchMembers={handleWatchMembers}
      navigation={navigation}
      route={route}
    />
  );

  const setKey = (item) => `serieCard-${item.id}-${Math.random()}`;

  const header = () => (
    <View>
      <HeaderWithImage avatar={avatar} backgroundImage={backgroundImage} nonBlink />
      <SettingsButton onPress={handleSettingsOpen}>
        <CogIcon />
      </SettingsButton>
      <MyFollowersContent navigation={navigation} />
      <DetailsContainer>
        <FullName>
          {fullName ? `${fullName}` : `@${username}`} <VerifiedIco />
        </FullName>
        {bio && bio.length > 0 ? <ContentText>{bio || ''}</ContentText> : null}
        {website && website.length ? (
          <OpenLinkBtn onPress={() => openLink(website)}>
            <WebsiteText>{website.toLowerCase()}</WebsiteText>
          </OpenLinkBtn>
        ) : null}
        <HorizontalBottons>
          <NewLargeButton
            style={styles.button}
            onPress={() => navigation.navigate('EditProfile')}
            title={PROFILE_BUTTON_EDIT}
          />
          {/* <NewLargeButton
            style={styles.buttonPurple}
            onPress={() => navigation.navigate('NameTeam')}
            title={PROFILE_BUTTON_TEAM}
          /> */}
        </HorizontalBottons>
      </DetailsContainer>
      <DividerLine />
      {getUserSeries && getUserSeries.length > 0 && <SeriesText>{MY_SHARED_EXPERIENCES}</SeriesText>}
    </View>
  );

  const footer = () => (
    <DetailsContainer>
      <TitleText>{PROFILE_TITLE_TO_SHARE}</TitleText>
      <SmallText>{PROFILE_SUBTITLE_TO_SHARE_1}</SmallText>
      <SmallText>{PROFILE_SUBTITLE_TO_SHARE_2}</SmallText>
      <View>
        <ProfileLinkText>Profile Link</ProfileLinkText>
        <ShareProfileButton large active onPress={() => shareUrlProfile()}>
          <ShareProfileButtonText>{shareButtonText}</ShareProfileButtonText>
          <ShareIco />
        </ShareProfileButton>
      </View>
    </DetailsContainer>
  );

  return (
    <Container>
      <Header>
        <HeaderLeftButton />
        <HeaderTitleText>{PROFILE_HEADER}</HeaderTitleText>
        <HeaderRightButton />
      </Header>
      {loading ? (
        <LoadingContainer>
          <ActivityIndicator color={colors.white} size="large" />
        </LoadingContainer>
      ) : (
        <SeriesContainer>
          <FlatList
            ListHeaderComponent={header()}
            ListFooterComponent={footer()}
            ListFooterComponentStyle={{marginBottom: 200}}
            renderItem={renderItem}
            data={getUserSeries}
            keyExtractor={setKey}
          />
        </SeriesContainer>
      )}
    </Container>
  );
}
