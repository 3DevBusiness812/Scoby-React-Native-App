/* eslint-disable no-use-before-define */
import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useMemo, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import FilterInput from 'src/components/FilterInput';
import RegularButton from 'src/components/RegularButton';
import withSafeArea from 'src/components/withSafeArea';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {UNKNOWN_ERROR_TEXT} from 'src/constants/Texts';
import {FollowersContext} from 'src/containers/followers';
import {GET_FOLLOWINGS} from 'src/graphql/queries/followers';
import styled from 'styled-components';
import TeamMemberItem from './TeamMemberItem';

const Wrapper = styled.View({paddingTop: 40, paddingHorizontal: 32});

const Title = styled.Text({...Fonts.goudy, fontSize: 32, color: Colors.white, marginBottom: 40});

const MembersList = styled.FlatList({height: '70%'});

const TeamMembers = ({route}) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [followeredUsers, setFolloweredUsers] = useState([]);

  // const [isLoading, setLoading] = useState(false);

  const {currentUserProfile} = React.useContext(FollowersContext);
  const navigator = useNavigation();

  const {members} = route?.params;

  const {refetch, data: users} = useQuery(GET_FOLLOWINGS, {
    variables: {
      paging: {
        limit: 100,
        page: 1,
      },
      userId: currentUserProfile.id,
    },
    onCompleted: (myFollows) => {
      setFolloweredUsers(myFollows?.getFollowingUsers?.data);
    },
    onError(e) {
      Alert.alert(UNKNOWN_ERROR_TEXT, e.message);
    },
  });

  useEffect(() => {
    setFolloweredUsers(users?.getFollowingUsers?.data);
  }, [users]);

  useEffect(() => {
    if (Array.isArray(members)) setData(members);
  }, [members, refetch]);

  const refetchQuery = () => {
    refetch();
  };

  const membersForRender = useMemo(
    () =>
      data?.filter(
        ({user}) =>
          user?.id !== currentUserProfile?.id &&
          (user?.fullName?.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
            user?.username?.toLowerCase().indexOf(query.toLowerCase()) > -1),
      ),

    [currentUserProfile, data, query],
  );

  const renderItem = ({item}) => {
    const {user} = item;

    return <TeamMemberItem user={user} refetch={refetchQuery} followeredUsers={followeredUsers} />;
  };

  const goBack = () => navigator.goBack();

  return (
    <Wrapper>
      <Title>Team Members</Title>
      <FilterInput onChangeText={setQuery} value={query} style={styles.input} />
      <MembersList data={membersForRender} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
      <RegularButton title="Back" style={styles.btn} onPress={goBack} />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  input: {width: '100%', height: 45, paddingLeft: 38},
  btn: {width: 100, height: 42, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'},
});

export default withSafeArea(TeamMembers);
