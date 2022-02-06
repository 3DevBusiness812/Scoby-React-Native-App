/* eslint-disable no-use-before-define */
import React, {useEffect, useState} from 'react';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import Fonts from 'src/constants/Fonts';
import styled from 'styled-components';
import Colors from 'src/constants/Colors';
import RegularButton from 'src/components/RegularButton';
import {StyleSheet} from 'react-native';
import {useMutation} from '@apollo/client';
import {FOLLOW_USER, UNFOLLOW_USER} from 'src/graphql/mutations/followers';

const UserCard = styled.View({
  flexDirection: 'row',
  marginBottom: 12,
  alignItems: 'center',
  justifyContent: 'space-between',
});

const UserAvatar = styled.Image({width: 60, height: 60, borderRadius: 50});

const UserLeftSide = styled.View({flexDirection: 'row', alignItems: 'center'});

const UserNameWrapper = styled.View({marginLeft: 6});

const UserName = styled.Text({color: Colors.white, ...Fonts.avenirSemiBold, marginBottom: 2});

const TeamMemberItem = ({user, refetch, followeredUsers}) => {
  const {id} = user;

  const [itemLoading, setItemLoading] = useState(false);

  const variables = {userId: id};

  const refetchFn = () => {
    refetch();
  };

  const [followUser, {loading: isFollowingInProcess}] = useMutation(FOLLOW_USER, {
    onCompleted: refetchFn,
    onError: () => setItemLoading(false),
  });

  const [unFollowUser, {loading: isUnFollowingInProcess}] = useMutation(UNFOLLOW_USER, {
    onCompleted: refetchFn,
    onError: () => setItemLoading(false),
  });

  useEffect(() => {
    setItemLoading(false);
  }, [followeredUsers]);

  const isLoading = isUnFollowingInProcess || isFollowingInProcess || itemLoading;

  const isFollowing = !!followeredUsers?.find((follower) => follower.id === id);

  const handlePress = () => {
    setItemLoading(true);
    return isFollowing ? unFollowUser({variables}) : followUser({variables});
  };

  return (
    <UserCard>
      <UserLeftSide>
        <UserAvatar source={user.avatar ? {uri: user.avatar} : avatarSrc} resizeMode="cover" />
        <UserNameWrapper>
          <UserName>{user.fullName}</UserName>
          <UserName>@{user.username}</UserName>
        </UserNameWrapper>
      </UserLeftSide>
      <RegularButton
        title={isFollowing ? 'Following' : 'Follow'}
        active={isFollowing}
        style={styles.btn}
        loading={isLoading}
        numberOfLines={1}
        onPress={handlePress}
      />
    </UserCard>
  );
};

const styles = StyleSheet.create({
  btn: {flexDirection: 'row', alignItems: 'center', width: '25%', justifyContent: 'center'},
});

export default TeamMemberItem;
