import React, {useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {FollowersContext} from 'src/containers/followers';
import {useQuery, useMutation} from '@apollo/client';
import {GET_FOLLOWERS} from 'src/graphql/queries/followers';
import styled from 'styled-components/native';
import {TITLE_POPULATE_SESSION} from 'src/constants/Texts';
import InviteFollowers from 'src/components/InviteFollowers';
import NewLargeButton from 'src/components/NewLargeButton';
import withSafeArea from 'src/components/withSafeArea';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import LadingSerie from 'src/components/LoadingSerie';
import {CREATE_SERIE, INVITE_SERIE} from 'src/graphql/mutations/serie';
import {ReactNativeFile} from 'apollo-upload-client';
import {GET_USER_SERIES} from 'src/graphql/queries/profile';

const Wrapper = styled.View({
  flex: 1,
  flexDirection: 'column',
  backgroundColor: Colors.blueBackgroundSession,
  paddingHorizontal: 24,
  paddingTop: 24,
});

const TitleText = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  lineHeight: '32px',
  color: Colors.white,
  marginBottom: 4,
});

const InviteFollowersContainer = styled.View({
  flex: 1,
});

const Buttons = styled.View({
  flexDirection: 'row',
});

function buildFile(uri) {
  return new ReactNativeFile({
    uri,
    name: 'image.jpg',
    type: 'image/jpeg',
  });
}

const ShareSession = ({navigation, route}) => {
  const {currentUserProfile} = React.useContext(FollowersContext);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [query, setQuery] = useState('');
  const {params} = route;
  const {sessionParams} = params;
  const {experience} = sessionParams;

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

  const [createSerie, {loading}] = useMutation(CREATE_SERIE, {
    refetchQueries: [{query: GET_USER_SERIES}],
    onCompleted() {
      navigation.navigate('Profile');
    },
    onError(e) {
      Alert.alert('Error', e.message);
    },
  });

  const [inviteUser] = useMutation(INVITE_SERIE, {
    onCompleted() {
      navigation.navigate('Profile');
    },
    onError(e) {
      Alert.alert('Error', e.message);
    },
  });

  const handleSession = () => {
    params.sessionParams.followers = selectedFollowers;
    params.sessionParams.hostName = currentUserProfile.username;
    params.sessionParams.followersList = getFollowerUsers?.data;
    navigation.navigate('CreateSessionScreen', {sessionParams: params});
  };

  const handleSerie = async () => {
    await createSerie({
      variables: {
        serie: {
          calendarName: sessionParams.CalendarName,
          className: sessionParams.ClassName,
          description: sessionParams.Description,
          seriesName: sessionParams.Name,
          topics: sessionParams.topics,
          invitedUsers: selectedFollowers,
        },
        schedule: sessionParams.Schedule,
        avatar: buildFile(sessionParams.Avatar),
        backgroundImage: buildFile(sessionParams.Cover),
      },
    });
  };
  const handleInvite = async () => {
    await inviteUser({
      variables: {
        idSerie: sessionParams.series.id,
        invitedUsers: selectedFollowers,
      },
    });
  };

  const submit = () => {
    if (experience === 'session') {
      handleSession();
    }
    if (experience === 'serie') {
      handleSerie();
    }
    if (experience === 'seriesInvite') {
      handleInvite();
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const arrayImgAvatar = [];

  if (getFollowerUsers && getFollowerUsers.data && getFollowerUsers.data.length > 0) {
    getFollowerUsers.data.map((item) => arrayImgAvatar.push(item));
  }

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      flex: 1,
      marginTop: 24,
      marginBottom: 24,
    },
  });

  return (
    <Wrapper>
      <LadingSerie visible={loading} />
      <TitleText>{TITLE_POPULATE_SESSION}</TitleText>
      <InviteFollowersContainer>
        <InviteFollowers
          getFollowerUsers={getFollowerUsers}
          selectedFollowers={selectedFollowers}
          setSelectedFollowers={setSelectedFollowers}
          avatarBorderColor={Colors.blueBackgroundSession}
          query={query}
          setQuery={setQuery}
        />
      </InviteFollowersContainer>
      <Buttons>
        <NewLargeButton large transparent noPadding title="Back" onPress={goBack} style={styles.button} />
        <NewLargeButton large noPadding title="Next" onPress={submit} style={styles.button} />
      </Buttons>
    </Wrapper>
  );
};

export default withSafeArea(ShareSession);
