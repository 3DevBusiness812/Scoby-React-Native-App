/* eslint-disable no-use-before-define */
import {useMutation, useQuery} from '@apollo/client';
import React, {useContext, useEffect, useMemo, useState, useCallback} from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import {BackgroundImage} from 'react-native-elements/dist/config';
import Share from 'react-native-share';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import Invite from 'assets/svg/InviteCurrColor.svg';
import ShareIcon from 'assets/svg/ShareCurrColor.svg';
import CloseNormal from 'assets/svg/closeNormal.svg';
import LinearGradient from 'react-native-linear-gradient';
import withSafeArea from 'src/components/withSafeArea';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {GET_TEAM} from 'src/graphql/queries/team';
import styled from 'styled-components';
import {useNavigation} from '@react-navigation/core';
import {FollowersContext} from 'src/containers/followers';
import {TEAM_SHARE_TEXT, UNKNOWN_ERROR_TEXT} from 'src/constants/Texts';
import {buildLink, checkAvatar} from 'src/utils/helpers';
import {CogIcon} from 'assets/svg';
import {ACCEPT_INVITE, REQUEST_MEMBERSHIP} from 'src/graphql/mutations/team';
import {TEAM_TYPES} from 'src/constants/Variables';
import {BlurView} from '@react-native-community/blur';

const Wrapper = styled.View({flex: 1, zIndex: -3});
const Cover = styled.View({});
const TeamType = styled.Text({...Fonts.avenirBold, color: Colors.white, fontSize: 14, paddingLeft: 6});
const ShareButtonsWrapper = styled.View({
  flexDirection: 'row-reverse',
  alignItems: 'flex-end',
  alignSelf: 'flex-end',
  width: '20%',
});
const ShareButton = styled.TouchableOpacity({
  width: 70,
  paddingHorizontal: 2,
  height: 32,
  borderWidth: 1,
  borderColor: Colors.shareBtnBorder,
  marginLeft: 8,
  borderRadius: 8,
  backgroundColor: Colors.shareBtnBg,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const ShareText = styled.Text({...Fonts.avenir, color: Colors.shareBtnText, fontSize: 14});
const AvatarWrapper = styled.View({
  width: 100,
  height: 100,
  position: 'absolute',
  bottom: -50,
  left: 15,
  borderRadius: 50,
  borderWidth: 6,
  borderColor: Colors.blueBackgroundSession,
});
const AvatarImg = styled.Image({width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 50});

const Content = styled.View({padding: 12});

const ContentHeader = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
  minHeight: 56,
});

const MembersWrapper = styled.TouchableOpacity({
  alignItems: 'center',
  alignSelf: 'center',
  width: '40%',
});

const MembersAvatarWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',
  paddingHorizontal: 12,
});

const MembersText = styled.Text({color: Colors.grey, ...Fonts.avenir, marginBottom: 6});

const MemberItem = styled.Image({width: 30, height: 30, borderRadius: 50});

const MoreMembersText = styled.Text({...Fonts.avenir, color: Colors.white, fontSize: 13});

const ActionButton = styled.TouchableOpacity({
  width: '30%',
  height: 40,
  backgroundColor: Colors.newPink,
  alignSelf: 'flex-end',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  marginHorizontal: 6,
  borderRadius: 8,
  zIndex: 100,
});

const BluredActionButton = styled(ActionButton)({
  position: 'absolute',
  top: 250,
  right: 5,
});

const ActionButtonText = styled.Text({...Fonts.avenirSemiBold, color: Colors.white, fontSize: 14, textAlign: 'center'});

const TeamCardWrapper = styled.View({backgroundColor: Colors.white, borderRadius: 8, padding: 12, marginTop: 20});

const TeamName = styled.Text({
  ...Fonts.goudy,
  color: Colors.white,
  fontSize: 26,
  alignSelf: 'center',
  textAlign: 'center',
  paddingVertical: 12,
  width: '70%',
});

const TeamCardBodyWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: 22,
});

const TeamCardDesc = styled.Text({...Fonts.avenir, fontSize: 14, maxWidth: '50%', flexGrow: 1});

const TeamOwnerWrapper = styled.View({alignItems: 'center', marginLeft: 6});

const TeamAvatarOwnerWrapper = styled.View({
  borderRadius: 50,
  borderWidth: 3,
  borderColor: Colors.newPink,
});

const BottomWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const TeamOwnerName = styled.Text({...Fonts.avenirSemiBold, fontSize: 14, color: Colors.violetColor, marginTop: 6});

const TeamOwnerFullName = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 17,
  fontWeight: 'bold',
  color: Colors.violetColor,
  marginTop: 6,
});

const SettingsButton = styled.TouchableOpacity({
  position: 'absolute',
  right: 0,
  top: 0,
  padding: 16,
  zIndex: 100000,
});

const TeamAvatarOwner = styled.Image({width: 80, height: 80, borderRadius: 50, resizeMode: 'cover'});

const TopicsWrapper = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  maxWidth: '50%',
});

const Topic = styled.View({
  flexDirection: 'row',
  backgroundColor: Colors.violetColorSelfOpacity,
  borderRadius: 5,
  marginHorizontal: 4,
  marginVertical: 2,
  paddingHorizontal: 6,
  paddingVertical: 6,
  minWidth: 62,
});

const TopicText = styled.Text({marginLeft: 2});

const TeamScreen = ({route}) => {
  const {id: teamId} = route?.params;

  const [team, setTeam] = useState(null);

  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isBlur, setIsBlur] = useState(false);

  const {
    teamType,
    members,
    backgroundImage,
    avatar,
    ownerUser,
    name,
    description,
    topics,
    membersAllowedToHost,
    pendingUsers = [],
    membersAllowedToInvite,
  } = team || {};

  const navigator = useNavigation();
  const {currentUserProfile} = useContext(FollowersContext);

  const memberAvatarWrapperStyles = {transform: [{translateX: members?.length > 4 ? 16 : members?.length * 2}]};

  const invitedUsers = useMemo(() => members?.map(({user}) => user?.id), [members]);

  const isOwner = currentUserProfile?.id === ownerUser?.id;

  const isMemberAccepted = useMemo(
    () => members?.find(({user}) => user.id === currentUserProfile?.id)?.isAccepted,
    [currentUserProfile, members],
  );

  const isMemberInvitedToTeam = useMemo(
    () => !!members?.find(({user}) => user.id === currentUserProfile?.id),
    [currentUserProfile, members],
  );

  const isMemberInPendingList = useMemo(
    () => !!pendingUsers?.find(({id}) => id === currentUserProfile?.id),
    [currentUserProfile.id, pendingUsers],
  );

  const isMemberAllowToInvite = isOwner || (membersAllowedToInvite && isMemberAccepted);

  const actionBtnTextMap = {
    owner: 'Host a session',
    newbie: 'Accept',
    pending: 'Pending for review',
    stranger: teamType === TEAM_TYPES.PUBLIC ? 'Join' : 'Apply',
    existed: 'Host a session',
    existedAndCanHost: 'Host a session',
  };

  const joinTeam = () => accept({variables: {teamId}});

  const requestToJoin = () => request({variables: {teamId}});

  const actionBtnActionMap = {
    owner: () => goToSessionCreation(),
    newbie: () => joinTeam(),
    existed: () => null,
    pending: () => null,
    stranger: () => requestToJoin(),
    existedAndCanHost: () => goToSessionCreation(),
  };

  const disabledBtnStateMap = {
    owner: false,
    newbie: false,
    existed: true,
    pending: true,
    stranger: false,
    existedAndCanHost: false,
  };

  const userStatus = useMemo(() => {
    if (isOwner) return 'owner';
    if (isMemberInPendingList) return 'pending';
    if (!isMemberAccepted && isMemberInvitedToTeam) return 'newbie';
    if (isMemberAccepted && membersAllowedToHost) return 'existedAndCanHost';
    if (isMemberAccepted && !membersAllowedToHost) return 'existed';

    return 'stranger';
  }, [isMemberAccepted, isMemberInPendingList, isMemberInvitedToTeam, isOwner, membersAllowedToHost]);

  const isMemberWithoutAccess = ['stranger', 'pending'].includes(userStatus);

  const {
    loading,
    refetch,
    data: teamData,
  } = useQuery(GET_TEAM, {
    variables: {teamId: Number(teamId)},
    fetchPolicy: 'network-only',
    onCompleted: ({getTeam}) => setTeam(getTeam),
    onError: () => Alert.alert(UNKNOWN_ERROR_TEXT),
  });

  const [accept, {loading: isAcceptInProcess}] = useMutation(ACCEPT_INVITE, {
    onCompleted: () => refetch(),
    onError: () => Alert.alert(UNKNOWN_ERROR_TEXT),
  });

  const [request, {loading: isMembershipRequesting}] = useMutation(REQUEST_MEMBERSHIP, {
    onCompleted: () => refetch(),
    onError: () => {
      Alert.alert(UNKNOWN_ERROR_TEXT);
    },
  });

  useEffect(() => {
    setIsBlur(teamType === TEAM_TYPES.SECRET && isMemberWithoutAccess);
  }, [teamType, isOwner]);

  useEffect(() => {
    if (team) {
      setIsActionLoading(false);
      setTeam(teamData?.getTeam);
    }
  }, [teamData]);

  const isLoading = isMembershipRequesting || isAcceptInProcess || loading || isActionLoading;

  const goToTeamMembers = () => navigator.navigate('TeamMembers', {members});
  const goToInvite = () => navigator.navigate('InviteFollowers', {members, teamId});
  const goToTeamSettings = () => navigator.navigate('TeamSettings', {team});
  const goBack = () => navigator.reset({index: 0, routes: [{name: 'MainTabs', screen: 'Home'}]});

  const shareUrlTeam = useCallback(async () => {
    const url = await buildLink(teamId, 'team');

    if (!url) return Alert.alert(UNKNOWN_ERROR_TEXT);

    await Share.open({
      message: TEAM_SHARE_TEXT,
      url,
    });
  }, [teamId]);

  const goToSessionCreation = () =>
    navigator.navigate('MainTabs', {
      screen: 'CreateSession',
      params: {
        screen: 'SessionName',
        params: {
          experience: 'SessionName',
          invitedUsers,
          followers: invitedUsers,
          followersList: members?.map(({user}) => user),
          isPrivate: true,
        },
      },
    });

  const onActionButtonPress = () => {
    setIsActionLoading(true);
    actionBtnActionMap[userStatus]();
  };

  if (loading || !team) return <ActivityIndicator size="large" style={styles.activityIndicator} />;

  return (
    <>
      <Wrapper>
        <Cover>
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
              <CloseNormal width={56} height={56} style={styles.closeIcon} />
            </TouchableOpacity>
            <TeamName>{name}</TeamName>
          </View>
          <BackgroundImage source={{uri: backgroundImage}} resizeMode="cover" style={styles.bgImage}>
            {isOwner && (
              <SettingsButton onPress={goToTeamSettings}>
                <CogIcon />
              </SettingsButton>
            )}
            <LinearGradient
              colors={[Colors.chatGradientStart, Colors.transparent]}
              start={{x: 0, y: 0.75}}
              end={{x: 1, y: 0.25}}
              style={styles.teamTypeGradient}>
              <TeamType>{teamType}</TeamType>
            </LinearGradient>
            <AvatarWrapper>
              <AvatarImg source={{uri: avatar}} />
            </AvatarWrapper>
          </BackgroundImage>
        </Cover>
        <Content>
          <ContentHeader>
            <>
              {members?.length ? (
                <MembersWrapper onPress={goToTeamMembers}>
                  <MembersText>Members</MembersText>
                  <MembersAvatarWrapper style={memberAvatarWrapperStyles}>
                    <MemberItem source={checkAvatar(members[0].user)} />
                    {members.length > 1 && (
                      <MemberItem style={styles.secondMemberItem} source={checkAvatar(members[1].user)} />
                    )}
                    {members.length > 2 && (
                      <MemberItem style={styles.thirdMemberItem} source={checkAvatar(members[2].user)} />
                    )}
                    {members.length > 3 && (
                      <MemberItem style={styles.fourthMemberItem} source={checkAvatar(members[3].user)} />
                    )}
                    {members.length > 4 && (
                      <View style={styles.moreMembersOuter}>
                        <View style={styles.moreMembersInner}>
                          <MoreMembersText>+{members.length - 4}</MoreMembersText>
                        </View>
                      </View>
                    )}
                  </MembersAvatarWrapper>
                </MembersWrapper>
              ) : null}
              <ActionButton
                onPress={onActionButtonPress}
                disabled={disabledBtnStateMap[userStatus]}
                style={disabledBtnStateMap[userStatus] && styles.disabledBtn}>
                {isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <ActionButtonText>{actionBtnTextMap[userStatus]}</ActionButtonText>
                )}
              </ActionButton>
            </>
          </ContentHeader>
          <TeamCardWrapper>
            <TeamCardBodyWrapper>
              <TeamOwnerWrapper>
                <TeamAvatarOwnerWrapper>
                  <TeamAvatarOwner source={ownerUser?.avatar ? {uri: ownerUser?.avatar} : avatarSrc} />
                </TeamAvatarOwnerWrapper>
                <TeamOwnerFullName>{ownerUser?.fullName}</TeamOwnerFullName>
                <TeamOwnerName>@{ownerUser?.username}</TeamOwnerName>
              </TeamOwnerWrapper>
              <TeamCardDesc>{description}</TeamCardDesc>
            </TeamCardBodyWrapper>
            <BottomWrapper>
              <TopicsWrapper>
                {topics?.map(({icon, name: topicName}) => (
                  <Topic key={icon}>
                    <Text>{icon}</Text>
                    <TopicText>{topicName}</TopicText>
                  </Topic>
                ))}
              </TopicsWrapper>
              <ShareButtonsWrapper>
                <ShareButton onPress={shareUrlTeam}>
                  <ShareIcon width={25} height={25} style={styles.iconShare} />
                  <ShareText>Share</ShareText>
                </ShareButton>
                {isMemberAllowToInvite && (
                  <ShareButton onPress={goToInvite}>
                    <Invite width={25} height={25} style={styles.iconShare} />
                    <ShareText>Invite</ShareText>
                  </ShareButton>
                )}
              </ShareButtonsWrapper>
            </BottomWrapper>
          </TeamCardWrapper>
        </Content>
        {isBlur && (
          <>
            <BlurView
              style={styles.blurStyles}
              reducedTransparencyFallbackColor="gray"
              blurType="light"
              blurAmount={15}
            />
            <LinearGradient
              colors={[Colors.chatGradientStart, Colors.transparent]}
              start={{x: 0, y: 0.75}}
              end={{x: 1, y: 0.25}}
              style={styles.bluredTeamTypeGradient}>
              <TeamType>{teamType}</TeamType>
            </LinearGradient>
            <TouchableOpacity onPress={goBack} style={styles.closeIconBlured}>
              <CloseNormal width={56} height={56} style={styles.closeIcon} />
            </TouchableOpacity>
            <BluredActionButton
              onPress={onActionButtonPress}
              disabled={disabledBtnStateMap[userStatus]}
              style={disabledBtnStateMap[userStatus] && styles.disabledBtn}>
              {isLoading ? <ActivityIndicator /> : <ActionButtonText>{actionBtnTextMap[userStatus]}</ActionButtonText>}
            </BluredActionButton>
          </>
        )}
      </Wrapper>
    </>
  );
};

const styles = StyleSheet.create({
  bgImage: {width: '100%', height: 170, justifyContent: 'space-between'},
  teamTypeGradient: {width: '25%', height: '12%', flexDirection: 'row', alignItems: 'center'},
  bluredTeamTypeGradient: {
    width: 80,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    left: 0,
  },
  secondMemberItem: {transform: [{translateX: -8}]},
  thirdMemberItem: {transform: [{translateX: -16}]},
  fourthMemberItem: {transform: [{translateX: -24}]},
  iconShare: {color: Colors.shareBtnText},
  moreMembersOuter: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: Colors.pinkMagentaTranslucent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{translateX: -32}],
  },
  header: {flexDirection: 'row', alignItems: 'center'},
  closeIcon: {color: Colors.white, alignSelf: 'flex-start'},
  closeIconBlured: {color: Colors.white, position: 'absolute', top: 0, left: 0},
  moreMembersInner: {
    width: 24,
    height: 24,
    borderRadius: 50,
    backgroundColor: Colors.newPink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {backgroundColor: Colors.disabledButton},
  activityIndicator: {alignSelf: 'center'},
  blurStyles: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
});

export default withSafeArea(TeamScreen);
