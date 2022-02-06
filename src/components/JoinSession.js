import React, {useContext} from 'react';
import {StyleSheet, Alert} from 'react-native';
import RegularButton from 'src/components/RegularButton';
import {useLazyQuery} from '@apollo/client';
import {FollowersContext} from 'src/containers/followers';
import {GET_LIVE_SESSION} from 'src/graphql/queries/session';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const JoinSession = ({id, large, style, navigation, widthContainer, getFollowerUsers}) => {
  const {currentUserProfile} = useContext(FollowersContext);

  const handleJoinSession = (session) => {
    const useJoinSession = {
      hostName: session.ownerUser.username,
      sessionName: session.title,
      sessionDescription: session.description,
      id: session.id,
      vonageSessionId: session.vonageSessionToken,
      userId: currentUserProfile.id,
      followers: getFollowerUsers && getFollowerUsers.data,
    };
    navigation.navigate('JoinSession', {params: useJoinSession});
  };

  const [getLive, {loading}] = useLazyQuery(GET_LIVE_SESSION, {
    variables: {sessionId: id},
    onCompleted(data) {
      handleJoinSession(data?.getSession);
    },
    onError(e) {
      Alert.alert('Error', e.message);
    },
  });

  return (
    <RegularButton
      style={[styles.button, style]}
      large={large}
      title={`Let's go`}
      active={false}
      loading={loading}
      numberOfLines={1}
      widthContainer={widthContainer}
      onPress={async () => {
        getLive();
      }}
    />
  );
};

export default JoinSession;
