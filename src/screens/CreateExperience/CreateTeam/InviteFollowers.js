/* eslint-disable no-use-before-define */
import {useMutation, useQuery} from '@apollo/client';
import React, {useContext, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View, Alert} from 'react-native';
import SearchInput from 'src/components/SearchInput';
import Colors from 'src/constants/Colors';
import {CheckIco} from 'assets/ico';
import Fonts from 'src/constants/Fonts';
import {
  NEW_SESSION_INVITE_FOLLOWERS_EMPTY,
  NEW_SESSION_INVITE_FOLLOWERS_SELECT,
  SUBTITLE_TEAM,
  TITLE_TEAM,
} from 'src/constants/Texts';
import {FollowersContext} from 'src/containers/followers';
import {GET_FOLLOWERS} from 'src/graphql/queries/followers';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {CREATE_TEAM, INVITE_TEAM_MEMBERS} from 'src/graphql/mutations/team';
import {useNavigation} from '@react-navigation/core';
import withSafeArea from 'src/components/withSafeArea';
import {ReactNativeFile} from 'apollo-upload-client';

const Wrapper = styled.View({paddingHorizontal: 24, paddingTop: 24, height: '100%'});

const Title = styled.Text({...Fonts.goudy, fontSize: 28, lineHeight: '32px', color: Colors.white});

const SubTitle = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  color: Colors.grey,
  paddingVertical: 26,
  paddingHorizontal: 4,
});

const CheckBox = styled.View({
  width: 20,
  height: 20,
  borderRadius: 50,
  borderWidth: 1,
  borderColor: Colors.white,
  backgroundColor: Colors.transparent,
});

const Name = styled.Text({...Fonts.avenir, fontSize: 16, color: Colors.grey});

const CustomText = styled.Text({...Fonts.avenir, fontSize: 16, color: Colors.grey, marginLeft: 12});

const InviteAll = styled.TouchableOpacity({
  paddingHorizontal: 22,
  paddingVertical: 12,
  marginTop: 18,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const InviteItem = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginVertical: 12,
  paddingHorizontal: 20,
});

const ItemAvatar = styled.Image({width: 45, height: 45, borderRadius: 50});

const ItemNameWrapper = styled.View({marginLeft: 12});

const Buttons = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 20,
  alignSelf: 'center',
  marginBottom: 20,
});

const Button = styled.TouchableOpacity({
  width: '40%',
  height: 55,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const InviteAllLeftSide = styled.View({flexDirection: 'row', alignItems: 'center'});

const InviteAllFirstImage = styled.Image({width: 35, height: 35, borderRadius: 50});
const InviteAllSecondImage = styled.Image({
  width: 35,
  height: 35,
  borderRadius: 50,
  position: 'absolute',
  top: -8,
  left: -8,
});

function buildFile(uri) {
  return new ReactNativeFile({
    uri,
    name: 'image.jpg',
    type: 'image/jpeg',
  });
}

const InviteFollowers = ({route}) => {
  const {
    Avatar,
    Cover,
    Description: teamDesc,
    Name: teamName,
    topics: teamTopics,
    isAllowToInvite,
    isAllowToHost,
    type: teamType,
    // team,
  } = route?.params?.sessionParams || {};

  const {members = [], teamId = null} = route?.params;

  const [query, setQuery] = useState('');
  const [checkedFollowers, setCheckedFollowers] = useState([]);

  const isAnyFollowersChecked = checkedFollowers?.length !== 0;

  const navigator = useNavigation();
  const {currentUserProfile} = useContext(FollowersContext);

  const goTeamScreen = (id) => navigator.replace('TeamScreen', {id});

  const goNext = ({createTeam: {id}}) => {
    goTeamScreen(id);
  };
  const goBackTeam = async ({inviteMembers: {id}}) => {
    goTeamScreen(id);
  };
  const goBack = () => navigator.goBack();

  const {data: {getFollowerUsers} = {getFollowerUsers: {data: []}}} = useQuery(GET_FOLLOWERS, {
    variables: {
      paging: {
        limit: 100,
        page: 1,
      },
      userId: currentUserProfile.id,
    },
    onError() {},
  });

  const [createTeam, {loading: isTeamLoading}] = useMutation(CREATE_TEAM, {
    onCompleted: goNext,
    onError: (e) => {
      Alert.alert('Error', e.message);
    },
  });

  const [inviteMembers, {loading: isInvitingInProcess}] = useMutation(INVITE_TEAM_MEMBERS, {
    onCompleted: goBackTeam,
    onError: (e) => {
      Alert.alert('Error', e.message);
    },
  });

  const handleNext = () => {
    const invitedUsers = checkedFollowers?.map(({id}) => id);

    if (teamId) return inviteMembers({variables: {teamId: Number(teamId), usersIds: invitedUsers}});

    const teamObj = {
      description: teamDesc,
      invitedUsers,
      membersAllowedToInvite: isAllowToInvite,
      membersAllowedToHost: isAllowToHost,
      name: teamName,
      teamType,
      topics: teamTopics,
    };
    createTeam({
      variables: {
        backgroundImage: buildFile(Cover),
        avatar: buildFile(Avatar),
        team: teamObj,
      },
    });
  };

  const handleSearch = (text) => {
    setQuery(text);
  };

  const {data} = getFollowerUsers;

  const isLoading = isTeamLoading || isInvitingInProcess;

  const interimData = useMemo(() => {
    const membersIds = members?.map(({user}) => user?.id);
    return data?.filter((user) => !membersIds.includes(user.id));
  }, [data, members]);

  const filteredData = useMemo(
    () =>
      interimData?.filter(
        (user) =>
          user?.fullName?.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
          user?.username?.toLowerCase().indexOf(query.toLowerCase()) > -1,
      ),
    [interimData, query],
  );

  const isInterimDataExists = interimData?.length > 0;
  const isSecondMemberExists = interimData?.length > 1;
  const isAllFollowersChecked = checkedFollowers?.length === interimData?.length;

  const handleInviteAll = () => {
    if (interimData?.length === checkedFollowers?.length) return setCheckedFollowers([]);
    setCheckedFollowers(interimData);
  };

  const handleInviteOne = (isChecked, item) => {
    const {id} = item;

    if (!isChecked) return setCheckedFollowers((prev) => [...prev, item]);
    setCheckedFollowers((prev) => prev.filter((follower) => follower.id !== id));
  };

  const renderItem = ({item}) => {
    const {fullName, username, avatar, id} = item;

    const isChecked = checkedFollowers?.find((follower) => follower.id === id);

    return (
      <InviteItem onPress={() => handleInviteOne(isChecked, item)}>
        <View style={styles.flex}>
          <ItemAvatar source={avatar ? {uri: avatar} : avatarSrc} />
          <ItemNameWrapper>
            <Name>{fullName}</Name>
            <Name>{`@${username}`}</Name>
          </ItemNameWrapper>
        </View>
        {isChecked ? <CheckIco width="20" height="20" fill={Colors.pink} stroke={Colors.white} /> : <CheckBox />}
      </InviteItem>
    );
  };

  return (
    <Wrapper>
      <Title>{TITLE_TEAM}</Title>
      <SubTitle>{SUBTITLE_TEAM}</SubTitle>
      <SearchInput value={query} autoCorrect={false} onChangeText={handleSearch} style={styles.input} />
      {isInterimDataExists && (
        <InviteAll onPress={handleInviteAll}>
          <InviteAllLeftSide>
            <View>
              {isSecondMemberExists && (
                <InviteAllSecondImage source={interimData[1].avatar ? {uri: interimData[1].avatar} : avatarSrc} />
              )}
              {isInterimDataExists && (
                <InviteAllFirstImage source={interimData[0].avatar ? {uri: interimData[0].avatar} : avatarSrc} />
              )}
            </View>
            <CustomText>Invite all my followers</CustomText>
          </InviteAllLeftSide>
          {isAllFollowersChecked ? (
            <CheckIco width="20" height="20" fill={Colors.pink} stroke={Colors.white} />
          ) : (
            <CheckBox />
          )}
        </InviteAll>
      )}
      <SubTitle>
        {isInterimDataExists ? NEW_SESSION_INVITE_FOLLOWERS_SELECT : NEW_SESSION_INVITE_FOLLOWERS_EMPTY}
      </SubTitle>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Buttons>
        <Button onPress={goBack}>
          <Name>Back</Name>
        </Button>
        <Button
          onPress={handleNext}
          style={[styles.pinkBtn, !isAnyFollowersChecked && styles.disabledBtn]}
          disabled={!isAnyFollowersChecked}>
          {isLoading ? <ActivityIndicator color={Colors.white} size="small" /> : <Name>Next</Name>}
        </Button>
      </Buttons>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  input: {width: '100%', alignSelf: 'center', height: 45},
  flex: {flexDirection: 'row', alignItems: 'center'},
  pinkBtn: {backgroundColor: Colors.pink, borderRadius: 12},
  disabledBtn: {opacity: 0.4},
});

export default withSafeArea(InviteFollowers);
