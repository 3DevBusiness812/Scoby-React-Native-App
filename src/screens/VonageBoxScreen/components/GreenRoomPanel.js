import React, {useMemo, useCallback} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Text} from 'react-native';
import {useMutation} from '@apollo/client';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import raisedHand from 'assets/images/raisedHandIcon.png';
import {LeaveIcon} from 'assets/svg';
import {GREEN_ROOM_USERS, NO_GREEN_ROOM_USERS} from 'src/constants/Texts';
import {JOIN_GREEN_ROOM_SESSION, JOIN_SESSION, VIEW_SESSION} from 'src/graphql/mutations/session';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

const Wrapper = styled.ScrollView({
  backgroundColor: colors.transparent,
});

const JoinText = styled.Text({
  ...Fonts.avenir,
  color: colors.greenRoomColorText,
  flex: 1,
  paddingHorizontal: 16,
});

const JoinTextLink = styled.Text({
  ...Fonts.avenirSemiBold,
  color: colors.greenRoomColorText,
  padding: 16,
  paddingRight: 4,
});

const TitleText = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 14,
  padding: 8,
  color: colors.greenRoomColorText,
});

const NoUserOnGreenRoomText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  textAlign: 'center',
  color: colors.greenRoomColorText,
  lineHeight: '24px',
});

const Border = styled.View({
  height: 1,
  marginBottom: 8,
  backgroundColor: colors.translucentWhite,
});

const Avatar = styled.Image({
  width: 45,
  height: 45,
  resizeMode: 'cover',
  borderRadius: 40,
});

const ListText = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: colors.greenRoomColorText,
  marginTop: 8,
  textAlign: 'center',
});

const ListTextColums = styled.Text({
  ...Fonts.avenir,
  fontSize: 14,
  color: colors.greenRoomColorText,
  marginTop: 8,
  textAlign: 'center',
  maxWidth: '25%',
});

const Speakers = styled.View({
  flexWrap: 'wrap',
  flexDirection: 'row',
});

const InviteUsers = styled.View({
  height: '100%',
  padding: 24,
  paddingTop: 0,
});

function renderItemSpeaker(user) {
  return (
    <View
      key={`${user.id}-speaker`}
      style={{
        width: '25%',
        alignItems: 'center',
        marginBottom: 16,
      }}>
      <Avatar source={user.avatar ? {uri: user.avatar} : avatarSrc} />
      <ListText>{user.fullName || user.username}</ListText>
    </View>
  );
}

const GreenRoomPanel = ({isUserOwner, userId, sessionId, getGreenRoomUsers, participantUsers, viewersList}) => {
  const [elevateAsSpeaker] = useMutation(JOIN_SESSION);
  const [leaveStage] = useMutation(VIEW_SESSION);
  const [joinGreenRoomSession] = useMutation(JOIN_GREEN_ROOM_SESSION);

  const isOnGreenRoom = useMemo(
    () => !isUserOwner && getGreenRoomUsers.map((item) => item.id).includes(userId),
    [getGreenRoomUsers, isUserOwner, userId],
  );

  const styles = StyleSheet.create({
    icon: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
    },
    leaveIcon: {
      marginLeft: 4,
      width: 16,
      height: 16,
    },
    header: {
      backgroundColor: colors.greeenYellow,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 16,
    },
    buttonJoin: {
      borderLeftWidth: 1,
      borderLeftColor: colors.borderGrey,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 0,
      paddingRight: 12,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    endTextStyle: {
      ...Fonts.avenirSemiBold,
      fontSize: 13,
      paddingBottom: 2,
      color: `${colors.black}`,
      textAlign: 'center',
    },
    actionsHostTextStyle: {
      ...Fonts.avenirBold,
      fontSize: 14,
      color: `${colors.white}`,
      textAlign: 'center',
    },
    elevateStyle: {
      backgroundColor: colors.pinkMagenta,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      maxHeight: 32,
    },
    removeStyle: {
      backgroundColor: 'rgba(52, 52, 52, 0.8)',
      padding: 8,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      maxHeight: 32,
    },
    leaveRoom: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.greeenYellow,
      alignSelf: 'flex-end',
      borderRadius: 8,
      padding: 8,
    },
    guestsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });

  const renderItemHostView = useCallback(
    (user) => (
      <View
        style={{
          flexDirection: 'row',
          maxHeight: 64,
          flexWrap: 'wrap',
          marginTop: 8,
          borderBottom: 16,
          justifyContent: 'space-between',
          marginHorizontal: 16,
        }}
        key={`${user.id}-host-view`}>
        <View
          style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: 0,
            flexDirection: 'row',
            width: '100%',
          }}>
          <Avatar source={user.avatar ? {uri: user.avatar} : avatarSrc} />
          <TouchableOpacity
            style={styles.removeStyle}
            onPress={() =>
              leaveStage({
                variables: {
                  id: sessionId,
                  currentUserId: user.id,
                  userId: user.id,
                },
              })
            }>
            <Text style={styles.actionsHostTextStyle}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.elevateStyle}
            onPress={() => {
              elevateAsSpeaker({
                variables: {
                  id: sessionId,
                  currentUserId: user.id,
                  userId: user.id,
                },
              });
            }}>
            <Text style={styles.actionsHostTextStyle}>Elevate as speaker</Text>
          </TouchableOpacity>
        </View>
        <ListTextColums numberOfLines={1}>{user.fullName || `${user.username}`} </ListTextColums>
      </View>
    ),
    [elevateAsSpeaker, leaveStage, sessionId, styles],
  );

  return (
    <Wrapper contentContainerStyle={{paddingBottom: 32}}>
      {viewersList && viewersList.map((item) => item.id).includes(userId) && participantUsers.length < 4 && (
        <View style={styles.header}>
          <JoinText>Join the Green Room and get your time on the air.</JoinText>
          <TouchableOpacity
            style={styles.buttonJoin}
            onPress={() =>
              joinGreenRoomSession({
                variables: {
                  id: sessionId,
                  currentUserId: userId,
                  userId,
                },
              })
            }>
            <JoinTextLink>Join Now</JoinTextLink>
            <Image source={raisedHand} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}
      <TitleText>Speakers</TitleText>
      <Speakers>{participantUsers.map(renderItemSpeaker)}</Speakers>
      {getGreenRoomUsers.length > 0 && (
        <>
          <Border />
          <Speakers>
            <View style={{flex: 1, minHeight: 200}}>
              <View style={styles.guestsHeader}>
                {isUserOwner ? (
                  <TitleText>{GREEN_ROOM_USERS}</TitleText>
                ) : (
                  <TitleText>
                    {getGreenRoomUsers.length} {getGreenRoomUsers.length === 1 ? 'guest' : 'guests'} on the Green Room
                  </TitleText>
                )}
                {isOnGreenRoom && (
                  <TouchableOpacity
                    style={styles.leaveRoom}
                    onPress={() =>
                      leaveStage({
                        variables: {
                          id: sessionId,
                          currentUserId: userId,
                          userId,
                        },
                      })
                    }>
                    <Text style={styles.endTextStyle}>Leave Room</Text>
                    <View style={styles.leaveIcon}>
                      <LeaveIcon width="100%" height="100%" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              {isUserOwner ? getGreenRoomUsers.map(renderItemHostView) : getGreenRoomUsers.map(renderItemSpeaker)}
            </View>
          </Speakers>
        </>
      )}
      {getGreenRoomUsers.length === 0 && isUserOwner && (
        <>
          <Border />
          <InviteUsers>
            <NoUserOnGreenRoomText>{NO_GREEN_ROOM_USERS}</NoUserOnGreenRoomText>
          </InviteUsers>
        </>
      )}
    </Wrapper>
  );
};

export default GreenRoomPanel;
