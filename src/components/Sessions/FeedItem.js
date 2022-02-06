import React, {useRef, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text, Platform, Animated, Easing} from 'react-native';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import LinearGradient from 'react-native-linear-gradient';

const Container = styled.View({
  width: '100%',
  backgroundColor: `${colors.blueBackgroundSession}`,
  marginVertical:10
});

const Header = styled.View({
  width: '100%',
  padding: 16,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const AvatarContainer = styled.TouchableOpacity({
  alignSelf: 'center',
  paddingRight: 8,
});

const Avatar = styled.Image({
  width: 44,
  height: 44,
  borderRadius: 44,
});

const UserInfo = styled.View({
  flex: 1,
  paddingLeft: 7,
});

const UserName = styled.Text({
  ...Fonts.avenirSemiBold,
  color: 'white',
  fontSize: 16,
  paddingRight: 5,
});

const UserAddress = styled.Text({
  ...Fonts.avenir,
  color: '#9094A2',
  fontSize: 13,
  lineHeight: '16px',
});

const Body = styled.TouchableOpacity({
  width: '100%',
  backgroundColor: 'white',
  paddingBottom: 16,
});

const VerifiedUser = styled.View({
  display: 'flex',
  flexDirection: 'row',
  paddingBottom: 4,
});

const Footer = styled.View({
  width: '100%',
  padding: 8,
  paddingLeft: 16,
});

const Topics = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const FeedItem = ({session, onJoinSession, setVisibleModalPage}) => {
  const {title, description, ownerUser, topics, viewers, createdAt} = session;
  const liveAnimated = useRef(new Animated.Value(1)).current;

  const ownerUserAvatarUrl = ownerUser && ownerUser.avatar ? {uri: ownerUser.avatar} : avatarSrc;

  const name = ownerUser.fullName ? ownerUser.fullName : ownerUser.username;

  const handleJoin = useCallback(() => {
    onJoinSession(session);
  }, [onJoinSession, session]);

  const handleAvatarPress = useCallback(() => {
    setVisibleModalPage(ownerUser);
  }, [ownerUser, setVisibleModalPage]);

  const renderItem = useCallback(
    (topic) => (
      <View
        key={topic.name}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 16,
          marginLeft: 16,
          paddingVertical: 6,
          paddingHorizontal: 8,
          borderRadius: 6,
          backgroundColor: 'rgba(101, 54, 187, 0.5)',
        }}>
        <Text>{topic.icon ? topic.icon : ''}</Text>
        <Text
          style={{
            ...Fonts.avenirBold,
            fontSize: 14,
            color: colors.primaryPurpleColor,
            paddingLeft: 2,
          }}>
          {topic.name}
        </Text>
      </View>
    ),
    [],
  );

  const styles = StyleSheet.create({
    joinText: {
      ...Fonts.avenirBold,
      color: 'white',
      fontSize: 16,
      padding: 4,
      paddingLeft: 16,
      paddingRight: 8,
    },
    descText: {
      ...Fonts.avenir,
      fontSize: 14,
      color: '#484848',
    },
    titleSessionText: {
      ...Fonts.avenirBold,
      fontSize: 14,
      color: '#484848',
    },
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(liveAnimated, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.linear),
        }),
        Animated.timing(liveAnimated, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.linear),
        }),
      ]),
    ).start();
  }, [liveAnimated]);

  return (
    <Container>
      <Header>
        <AvatarContainer onPress={handleAvatarPress}>
          <Avatar source={ownerUserAvatarUrl} />
        </AvatarContainer>
        <UserInfo>
          <VerifiedUser>
            <UserName ellipsizeMode="tail" numberOfLines={1}>
              {name}
            </UserName>
          </VerifiedUser>
          {/* TODO: “Location“ - for displaying the user’s location in the following format: \{<Users location
           city>, <User’s location alpha-2 country>} (left-aligned) */}
          {/* TODO:“Session duration“ - for displaying the session duration which should be calculated as
           (<current date&time> - <session start date&time>) with rounding to minutes; */}
          <UserAddress ellipsizeMode="tail">
            {`${ownerUser.location ? ownerUser.location : ''}${
              ownerUser.location && createdAt ? '\n' : ''
            }${viewers} viewers`}
          </UserAddress>
        </UserInfo>
      </Header>
      <Body onPress={handleJoin}>
        <LinearGradient
          start={{x: 0, y: 0.3}}
          end={{x: 1, y: 0}}
          colors={['#cd068e', '#9e0f92', '#7a1794', '#5f1c96', '#501f98', '#4a2098']}
          style={{
            width: Platform.OS === 'ios' ? 130 : 140,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomRightRadius: 6,
          }}>
          <Text style={styles.joinText}>LIVE NOW</Text>
          <Animated.View
            style={{
              height: 16,
              width: 16,
              backgroundColor: 'red',
              borderRadius: 8,
              transform: [{scale: liveAnimated}],
              opacity: liveAnimated,
            }}
          />
        </LinearGradient>
        <Footer>
          <Text style={styles.titleSessionText}>{title}</Text>
        </Footer>
        <Footer>
          <Text style={styles.descText}>{description}</Text>
        </Footer>
        <Topics>{topics.map((topic) => renderItem(topic))}</Topics>
      </Body>
    </Container>
  );
};

export default FeedItem;
