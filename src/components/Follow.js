import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import RegularButton from 'src/components/RegularButton';
import {useMutation} from '@apollo/client';
import {FollowersContext} from 'src/containers/followers';
import {FOLLOW_USER, UNFOLLOW_USER} from 'src/graphql/mutations/followers';
import {GET_USER_PROFILE} from 'src/graphql/queries/profile';
import {GET_FOLLOWINGS, GET_FOLLOWERS} from 'src/graphql/queries/followers';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Follow = ({user, large, followingYou, style, onAction, widthContainer}) => {
  const userFollowings = user && user.followStats ? user.followStats.followedByCurrentUser : 0;
  const [following, setFollowing] = useState(followingYou || userFollowings);
  const {currentUserProfile} = useContext(FollowersContext);

  const [followUser, {loading: loadingFollow}] = useMutation(FOLLOW_USER, {
    variables: {userId: user.id},
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_USER_PROFILE,
        variables: {
          id: currentUserProfile.id,
        },
      },
      {
        query: GET_FOLLOWINGS,
        variables: {
          paging: {
            limit: 100,
            page: 1,
          },
          userId: currentUserProfile.id,
        },
      },
      {
        query: GET_FOLLOWERS,
        variables: {
          paging: {
            limit: 100,
            page: 1,
          },
          userId: currentUserProfile.id,
        },
      },
    ],
    onCompleted() {
      setFollowing(true);
      if (typeof onAction === 'function') {
        onAction();
      }
    },
  });

  const [unfollowUser, {loading: loadingUnfollow}] = useMutation(UNFOLLOW_USER, {
    variables: {userId: user.id},
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_USER_PROFILE,
        variables: {
          id: currentUserProfile.id,
        },
      },
      {
        query: GET_FOLLOWINGS,
        variables: {
          userId: currentUserProfile.id,
        },
      },
      {
        query: GET_FOLLOWERS,
        variables: {
          paging: {
            limit: 100,
            page: 1,
          },
          userId: currentUserProfile.id,
        },
      },
    ],
    onCompleted() {
      if (typeof onAction === 'function') {
        onAction();
      }
      setFollowing(false);
    },
  });

  if (currentUserProfile.id === user.id) {
    return null;
  }

  return (
    <RegularButton
      widthContainer={widthContainer}
      style={[styles.button, style]}
      large={large}
      title={following ? 'Following' : 'Follow'}
      active={following}
      loading={loadingFollow || loadingUnfollow}
      numberOfLines={1}
      onPress={async () => {
        if (following) {
          await unfollowUser();
        } else {
          await followUser();
        }
      }}
    />
  );
};

export default Follow;
