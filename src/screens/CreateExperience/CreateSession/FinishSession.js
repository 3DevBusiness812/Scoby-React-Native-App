import React from 'react';
import {StyleSheet, View, Dimensions, TouchableOpacity, FlatList, Alert} from 'react-native';
import Follow from 'src/components/Follow';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {TITLE_FINISH, TITLE_FINISH_2, UNKNOWN_ERROR_TEXT} from 'src/constants/Texts';
import {FollowersContext} from 'src/containers/followers';
import {useQuery} from '@apollo/client';
import {GET_FOLLOWINGS} from 'src/graphql/queries/followers';
import Fonts from 'src/constants/Fonts';
import withSafeArea from 'src/components/withSafeArea';

const Wrapper = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #09073a;
  padding-horizontal: 24px;
`;

const TitleText = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  color: colors.white,
  lineHeight: '32px',
  alignSelf: 'flex-start',
  marginBottom: 4,
});

const SubtitleText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  lineHeight: '20px',
  color: colors.white,
  marginBottom: 5,
});

const Avatar = styled.Image({
  width: 44,
  height: 44,
  borderRadius: 44,
  marginRight: 8,
});

const ButtonContainer = styled.View`
  flex-direction: row;
  margin-top: 5%;
  justify-content: center;
`;

const ListText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  textAlign: 'left',
  color: colors.white,
});

const ListSubText = styled.Text({
  ...Fonts.avenir,
  fontSize: 13,
  textAlign: 'left',
  color: colors.white,
  flex: 1,
  paddingHorizontal: 8,
});

const ExitButton = styled.TouchableOpacity({
  padding: 16,
});

const FollowButton = styled(Follow)({
  minWidth: 96,
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
});

const {width, height} = Dimensions.get('window');

const FinishSession = ({navigation, route}) => {
  const {params} = route.params;
  const {currentUserProfile} = React.useContext(FollowersContext);

  const {data: {getFollowingUsers} = {getFollowingUsers: {data: []}}} = useQuery(GET_FOLLOWINGS, {
    variables: {
      paging: {
        limit: 100,
        page: 1,
      },
      userId: currentUserProfile.id,
    },
    onError(e) {
      Alert.alert(UNKNOWN_ERROR_TEXT, e.message);
    },
  });

  const getImgSource = (avatar) => (avatar ? {uri: avatar} : avatarSrc);

  const usersFollowed = [];

  getFollowingUsers &&
    getFollowingUsers.data &&
    params.participants.forEach((item) => {
      if (currentUserProfile.id === item.id) {
        return;
      }
      if (getFollowingUsers.data.map((itemFollow) => itemFollow.id).includes(item.id)) {
        const newUser = {...item};
        newUser.followingYou = true;
        usersFollowed.push(newUser);
      } else {
        usersFollowed.push(item);
      }
    });

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      marginTop: width * 0.1,
    },
    textViewStyle: {
      height: height * 0.04,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: `${colors.white}`,
    },
    textStyle: {
      ...Fonts.avenirBold,
      textAlign: 'center',
      fontSize: 18,
      color: `${colors.white}`,
    },
    buttonStyle: {
      backgroundColor: colors.pink,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: height * 0.06,
      borderRadius: 10,
    },
    participant: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    user: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  const renderItem = (item) => {
    const itemCopy = item.item;
    return (
      <TouchableOpacity key={itemCopy.id} activeOpacity={1} style={styles.participant}>
        <View style={styles.user}>
          <Avatar source={getImgSource(itemCopy.avatar)} />
          <ListText>{itemCopy.fullName || `@${itemCopy.username}`}</ListText>
          <ListSubText numberOfLines={2}>
            {`@${itemCopy.username} ${itemCopy.location ? `\n${itemCopy.location}` : ''}`}
          </ListSubText>
        </View>
        <FollowButton user={itemCopy} navigation={navigation} followingYou={itemCopy.followingYou} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={{alignSelf: 'flex-end'}}>
        <ExitButton
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{name: 'MainTabs', screen: 'Home'}],
            })
          }>
          <SubtitleText>Exit</SubtitleText>
        </ExitButton>
      </View>
      <Wrapper>
        <View style={styles.container}>
          <TitleText>{TITLE_FINISH}</TitleText>
          <View style={{marginTop: '4%', flexDirection: 'column'}}>
            <SubtitleText>
              {params.sessionName} with {params.hostName}
            </SubtitleText>
          </View>

          <SubtitleText>{TITLE_FINISH_2}</SubtitleText>

          <ButtonContainer>
            <FlatList data={usersFollowed} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
          </ButtonContainer>
        </View>
      </Wrapper>
    </>
  );
};

export default withSafeArea(FinishSession);
