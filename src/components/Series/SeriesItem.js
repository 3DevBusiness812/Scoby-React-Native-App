/* eslint-disable no-use-before-define */
import React, {useContext, useCallback, useState} from 'react';
import {StyleSheet, View, Alert, FlatList} from 'react-native';
import Eye from 'assets/svg/eye.svg';
import ShareSvg from 'assets/svg/ShareCurrentColor.svg';
import Invite from 'assets/svg/InviteCurrentColor.svg';
import {Serie} from 'assets/svg/index';
import Crowd from 'assets/svg/crowd.svg';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {FollowersContext} from 'src/containers/followers';
import {SERIES_GO_LIVE, SERIES_JOIN, SERIES_JOIN_SESSION, UNKNOWN_ERROR_TEXT} from 'src/constants/Texts';
import {GET_SERIES_SESSION} from 'src/graphql/queries/session';
import {JOIN_SERIES, LEAVE_SERIES} from 'src/graphql/mutations/series';
import {useMutation} from '@apollo/client';
import {DYNAMIC_LINKS_DEFAULTS, DYNAMIC_LINKS_HEADERS, DYNAMIC_LINKS_SHORTENER_URL} from 'src/constants/Variables';
import firebase from '@react-native-firebase/app';
import Share from 'react-native-share';
import lodash from 'lodash';
import {GET_SERIE_BY_ID} from 'src/graphql/queries/series';
import moment from 'moment';
import RegularButton from '../RegularButton';
import {getCurrentWeekDay, getCurrentWeekNumber} from 'src/utils/series';

const Wrapper = styled.TouchableOpacity({
  width: '95%',
  height: 340,
  alignSelf: 'center',
  flexDirection: 'row',
  backgroundColor: Colors.white,
  borderRadius: 10,
  marginVertical: 10,
});

const LeftSide = styled.View({width: '50%'});

const RightSide = styled.View({
  width: '50%',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingVertical: 12,
  paddingHorizontal: 6,
});

const Schedule = styled.View({
  width: 178,
  maxHeight: 300,
  position: 'absolute',
  backgroundColor: Colors.white,
  zIndex: 2000,
  marginVertical: 20,
  marginHorizontal: 7,
  borderRadius: 6,
});

const LeftSideTop = styled.View({});

const Text = styled.Text({...Fonts.avenirSemiBold, color: Colors.white, fontSize: 12});

const ScheduleText = styled.Text({
  ...Fonts.avenir,
  color: Colors.purple,
  fontSize: 10,
});

const ScheduleWrraper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  marginVertical: 6,
});

const ScheduleTitle = styled.Text({
  ...Fonts.avenirBold,
  color: Colors.purple,
  fontSize: 13,
});

const ScheduleClose = styled.TouchableOpacity({
  width: '25%',
});

const ScheduleTitleWrraper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Arrow = styled.Text({...Fonts.avenirBold, color: Colors.white});

const TextBoldDark = styled.Text({...Fonts.avenirBold, color: Colors.titleText, fontSize: 12});

const TextDark = styled.Text({...Fonts.avenir, color: Colors.titleText, fontSize: 12});

const TextPurple = styled.Text({...Fonts.avenir, color: Colors.purpleBorder, fontSize: 12, marginHorizontal: 2});

const CenteredWrapper = styled.View({flexDirection: 'row', alignItems: 'center'});

const SpaceBetweenWrapper = styled.TouchableOpacity({flexDirection: 'row', justifyContent: 'space-between'});

const Avatar = styled.View({
  width: 85,
  height: 85,
  borderRadius: 50,
  padding: 2,
  overflow: 'hidden',
  flexDirection: 'row',
  alignSelf: 'center',
  marginTop: 15,
  borderColor: Colors.purpleBorder,
  borderWidth: 3,
});

const AvatarImage = styled.Image({
  width: '100%',
  height: '100%',
  opacity: 1,
  resizeMode: 'cover',
  borderRadius: 40,
});

const JoinedAvatar = styled.Image({width: 26, height: 26, opacity: 1, resizeMode: 'cover', borderRadius: 40});
const JoinedAvatar2 = styled.Image({
  width: 26,
  height: 26,
  opacity: 1,
  resizeMode: 'cover',
  borderRadius: 40,
});

const StatusTextWrapper = styled.View({
  alignSelf: 'center',
  marginTop: 4,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const JoinedWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 3,
});

const PurpleCircle = styled.View({
  width: 26,
  height: 26,
  borderRadius: 50,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.purpleBackgroundHalfOpacity,
});

const ThirdMemberAvatar = styled.View({
  width: 18,
  height: 18,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.pinkMagenta,
  borderRadius: 50,
});

const Btn = styled.TouchableOpacity({
  borderRadius: 8,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 10,
  paddingVertical: 6,
  backgroundColor: Colors.translucentWhite,
  marginHorizontal: 4,
});

const Topic = styled.View({
  paddingHorizontal: 10,
  paddingVertical: 4,
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  backgroundColor: Colors.transluentPurple,
  marginVertical: 2,
  borderRadius: 6,
});

const TitleWrapper = styled.View({});

const TopicWrapper = styled.View({});

const MoreMembersText = styled.Text({...Fonts.avenir, color: Colors.white, fontSize: 12});

const extractKey = (index) => `showSchedule-${Math.random() + index}`;

const SeriesItem = ({series, navigation, onJoinSession, openSerie}) => {
  const {currentUserProfile} = useContext(FollowersContext);
  const {
    ownerUser,
    coOwner,
    description,
    topics,
    session,
    suscribeUsers,
    viewers,
    subscribed,
    id,
    schedule = [],
    seriesName,
  } = series;
  const [showSchedule, setShowSchedule] = useState(false);

  const [joinSeries, {loading: JoinLoading}] = useMutation(JOIN_SERIES, {
    refetchQueries: [{query: GET_SERIES_SESSION}, {query: GET_SERIE_BY_ID, variables: {id}}],
  });

  const [leaveSeries, {loading: LeaveLoading}] = useMutation(LEAVE_SERIES, {
    refetchQueries: [{query: GET_SERIES_SESSION}, {query: GET_SERIE_BY_ID, variables: {id}}],
  });

  const handleSubscribeSerie = () => {
    if (!subscribed) {
      joinSeries({
        variables: {
          id,
        },
      });
    } else {
      leaveSeries({
        variables: {
          id,
        },
      });
    }
  };

  const handleJoinBottom = () => {
    if (session) {
      onJoinSession({...session, ownerUser});
    } else if (currentUserProfile.id === ownerUser.id) {
      navigation.reset({
        index: 0,
        routes: [{name: 'CreateSeriesSession', params: {sessionParams: {id}}}],
      });
      //navigation.navigate('CreateSeriesSession', {sessionParams: {id}});
    } else {
      handleSubscribeSerie();
    }
  };

  const buildSeriesLink = async () => {
    try {
      const body = JSON.stringify(
        lodash.merge(DYNAMIC_LINKS_DEFAULTS, {
          dynamicLinkInfo: {
            link: `${DYNAMIC_LINKS_DEFAULTS.dynamicLinkInfo.domainUriPrefix}/series/${id}`,
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
    } catch (e) {
      Alert.alert('Error', e.message);
      return null;
    }
  };

  const shareUrlProfile = useCallback(async () => {
    const url = await buildSeriesLink();
    if (url) {
      Share.open({
        message: `Join me on Scoby and let’s have a Meaningful Conversation!`,
        url,
      });
    } else {
      Alert.alert(UNKNOWN_ERROR_TEXT);
    }
  }, []);

  const handleInvite = () => {
    navigation.navigate('InviteUsers', {sessionParams: {experience: 'seriesInvite', series}});
  };

  const setJoinBottomText = useCallback(() => {
    if (currentUserProfile.id === ownerUser.id) {
      return SERIES_GO_LIVE;
    }
    if (session || subscribed) {
      return SERIES_JOIN_SESSION;
    }
    return SERIES_JOIN;
  }, [session, currentUserProfile]);

  const sortDates = useCallback(() => {
    const sortSchedule = schedule.slice().sort((a, b) => {
      const firts = getCurrentWeekNumber(a.day);
      const second = getCurrentWeekNumber(b.day);

      if (firts > second) {
        return 1;
      }
      if (firts < second) {
        return -1;
      }
      return 0;
    });
    return sortSchedule;
  }, [schedule]);

  const setDate = useCallback(() => {
    const Today = sortDates().filter((item) => getCurrentWeekDay(Date.now()) === item.day)[0];
    if (Today) {
      return `${Today.day} ${moment(Today.start, 'HH:mm:ss').format('hh:mm a')} & ${moment(
        Today.end,
        'HH:mm:ss',
      ).format('hh:mm a')}`;
    }
    return sortDates()[0]
      ? `${sortDates()[0].day} ${moment(sortDates()[0].start, 'HH:mm:ss').format('hh:mm a')} & ${moment(
          sortDates()[0].end,
          'HH:mm:ss',
        ).format('hh:mm a')}`
      : 'No dates';
  }, []);

  const RenderSchedule = useCallback(
    (item) => (
      <ScheduleWrraper>
        <ScheduleText>{`${item.item.day} ${moment(item.item.start, 'HH:mm:ss').format('hh:mm a')} & ${moment(
          item.item.end,
          'HH:mm:ss',
        ).format('hh:mm a')}`}</ScheduleText>
      </ScheduleWrraper>
    ),
    [schedule],
  );

  const RenderHeaderSchedule = useCallback(() => (
    <ScheduleTitleWrraper>
      <ScheduleClose onPress={() => setShowSchedule(false)}>
        <ScheduleTitle>{'<'}</ScheduleTitle>
      </ScheduleClose>
      <ScheduleTitle>Schedule</ScheduleTitle>
    </ScheduleTitleWrraper>
  ));

  return (
    <Wrapper
      onPress={() => {
        openSerie(series);
      }}
      disabled={showSchedule}>
      {showSchedule && (
        <Schedule>
          <FlatList
            ListHeaderComponent={RenderHeaderSchedule}
            data={sortDates()}
            renderItem={RenderSchedule}
            keyExtractor={extractKey}
            style={{paddingHorizontal: 10, paddingVertical: 20, height: '90%'}}
            ListFooterComponent={<ScheduleWrraper></ScheduleWrraper>}
          />
        </Schedule>
      )}
      <LeftSide>
        <LinearGradient colors={[Colors.confirmationGreen, Colors.gradientYellow]} style={styles.leftGradient}>
          <LeftSideTop>
            {session && (
              <CenteredWrapper>
                <LinearGradient
                  colors={[Colors.translucentGrey, Colors.translucentWhite]}
                  style={[styles.linearGradient, styles.live]}>
                  <Text>LIVE</Text>
                </LinearGradient>
                <LinearGradient
                  colors={[Colors.translucentWhite, Colors.translucentWhite]}
                  style={[styles.linearGradient, styles.viewers]}>
                  <CenteredWrapper>
                    <Eye style={styles.eye} />
                    <Text>{viewers}</Text>
                  </CenteredWrapper>
                </LinearGradient>
              </CenteredWrapper>
            )}
            <View style={styles.mt6}>
              <LinearGradient
                end={{x: 1, y: 1.0}}
                colors={[Colors.translucentGrey, Colors.translucentWhite]}
                style={styles.linearGradient}>
                <SpaceBetweenWrapper onPress={() => setShowSchedule(true)}>
                  <Text>{setDate()}</Text>
                  <Arrow>{`>`}</Arrow>
                </SpaceBetweenWrapper>
              </LinearGradient>
            </View>
          </LeftSideTop>
          <Avatar>
            <AvatarImage source={ownerUser.avatar ? {uri: ownerUser.avatar} : avatarSrc} />
          </Avatar>
          <StatusTextWrapper>
            <Text>{session ? 'Members joined' : 'Let`s fill the seats'}</Text>
            {!session && <Crowd style={styles.crowdIcon} />}
          </StatusTextWrapper>
          <JoinedWrapper style={{transform: [{translateX: suscribeUsers.length <= 3 ? suscribeUsers.length * 3 : 9}]}}>
            <>
              {suscribeUsers.length > 0 && (
                <JoinedAvatar source={suscribeUsers[0].avatar ? {uri: suscribeUsers[0].avatar} : avatarSrc} />
              )}
              {suscribeUsers.length > 1 && (
                <JoinedAvatar2
                  source={suscribeUsers[1].avatar ? {uri: suscribeUsers[1].avatar} : avatarSrc}
                  style={{transform: [{translateX: -9}]}}
                />
              )}
              {suscribeUsers.length > 2 && (
                <PurpleCircle style={{transform: [{translateX: -18}]}}>
                  <ThirdMemberAvatar>
                    <MoreMembersText>+{suscribeUsers.length - 2}</MoreMembersText>
                  </ThirdMemberAvatar>
                </PurpleCircle>
              )}
            </>
          </JoinedWrapper>
          <JoinedWrapper>
            <Btn onPress={handleInvite}>
              <Invite width={18} heigth={18} style={styles.btnIcon} />
              <Text style={styles.btnText}>Invite</Text>
            </Btn>
            <Btn onPress={shareUrlProfile}>
              <ShareSvg width={18} heigth={18} style={styles.btnIcon} />
              <Text style={styles.btnText}>Share</Text>
            </Btn>
          </JoinedWrapper>
          <RegularButton
            disabled={JoinLoading || LeaveLoading || session ? false : subscribed}
            onPress={handleJoinBottom}
            title={setJoinBottomText()}
            style={[styles.regularBtn, session ? {} : subscribed && styles.joinButton]}
            loading={LeaveLoading || JoinLoading}
          />
        </LinearGradient>
      </LeftSide>
      <RightSide>
        <TitleWrapper>
          <Serie style={styles.serieIcon} />
          <TextBoldDark>{seriesName}</TextBoldDark>
          <TextDark>with {ownerUser.fullName}</TextDark>
          {coOwner && <TextDark>{`with ${coOwner.fullName}`}</TextDark>}
          {ownerUser.username && <TextBoldDark>{`@${ownerUser.username}`}</TextBoldDark>}
        </TitleWrapper>
        <TextDark>{description}</TextDark>
        {topics && (
          <TopicWrapper>
            {topics.map((topic) => (
              <Topic key={topic.icon}>
                <TextPurple>{topic.icon}</TextPurple>
                <TextPurple>{topic.name}</TextPurple>
              </Topic>
            ))}
          </TopicWrapper>
        )}
      </RightSide>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  leftGradient: {
    height: '100%',
    paddingVertical: 25,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginLeft: -4,
  },
  mt6: {marginTop: 6},
  eye: {width: 18, height: 18, color: Colors.white},
  crowdIcon: {marginLeft: 4},
  live: {paddingHorizontal: 24, paddingVertical: 2},
  viewers: {paddingHorizontal: 2, paddingVertical: 2},
  linearGradient: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  btnText: {fontSize: 14},
  btnIcon: {color: Colors.white, width: 22, height: 22, marginRight: 6},
  regularBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    height: '12%',
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 12,
  },
  shadow: {
    borderColor: Colors.translucentGrey,
    borderWidth: 0.24,
    shadowColor: Colors.translucentGrey,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
  },
  joinButton: {
    backgroundColor: '#7A015450',
    borderColor: '#7A015450',
  },
  serieIcon: {height: 32, width: 32, alignSelf: 'flex-end'},
});

export default SeriesItem;
