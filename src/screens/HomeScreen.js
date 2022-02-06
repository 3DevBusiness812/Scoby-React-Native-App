import React, {useState, useCallback, useContext, useMemo, useEffect, useRef} from 'react';
import {useMutation, useLazyQuery, useQuery} from '@apollo/client';
import styled from 'styled-components/native';
import fonts from 'src/constants/Fonts';
import colors from 'src/constants/Colors';
import {HEADER_SESSIONS_TITLE} from 'src/constants/Texts';
import {GET_FOLLOWERS} from 'src/graphql/queries/followers';
import {GET_SERIES_SESSION} from 'src/graphql/queries/session';
import UserInfoModal from 'src/components/UserInfoModal';
import UserDetailInfoModal from 'src/screens/UserDetailInfoModal';
import {FollowersContext} from 'src/containers/followers';
import withSafeArea from 'src/components/withSafeArea';
import Sessions from 'src/components/Sessions';
import {END_SESSION} from 'src/graphql/mutations/session';
import {Alert} from 'react-native';

const Wrapper = styled.View({
  width: '100%',
  height: '100%',
  backgroundColor: colors.blueBackgroundSession,
});

const TitleHeaderText = styled.Text({
  ...fonts.goudy,
  fontSize: 28,
  color: colors.white,
  paddingVertical: 20,
  paddingHorizontal: 16,
});

const limit = 20;

const HomeScreen = ({navigation}) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalPage, setVisibleModalPage] = useState(null);
  const {currentUserProfile} = useContext(FollowersContext);
  const [endSession] = useMutation(END_SESSION);
  const [page, setPage] = useState(1);
  const scrollView = useRef();

  const [refetch, {data = {getSeriesAndSession: {session: [], seriesLive: [], series: []}}, fetchMore, loading}] =
    useLazyQuery(GET_SERIES_SESSION, {
      pollInterval: 5000,
      fetchPolicy: 'network-only',
      variables: {
        paging: {
          page: 1,
          limit,
        },
      },
      onError(error) {
        Alert.alert('Error', error.message);
      }
    });

  useEffect(() => {
    refetch({
      variables: {
        paging: {
          limit,
          page: 1,
        },
      },
    });
  }, [refetch]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch({
      variables: {
        paging: {
          limit,
          page: 1,
        },
      },
    });
    scrollView.current?.scrollToOffset({x: 0, y: 0, animated: true});
  }, [ refetch]);

  const handleEndReached = useCallback(() => {
    setPage(page + 1);
    fetchMore({
      variables: {
        paging: {
          limit,
          page: page + 1,
        },
      },
      onError(e) {
        Alert.alert('Error', e.message);
      },
    });
  }, [fetchMore, page]);

  const {data: {getFollowerUsers} = {getFollowerUsers: {data: []}}} = useQuery(GET_FOLLOWERS, {
    variables: {
      paging: {
        limit: 100,
        page: 1,
      },
      userId: currentUserProfile.id,
    },
  });

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

  const handleOpenSerie = (serie) => {
    navigation.navigate('SeriesLandingView', {id: serie.id});
  };

  const handleCloseModal = useCallback(() => {
    setVisibleModalPage(null);
  }, []);

  const userInfoEvent = useCallback(
    (e) => {
      if (currentUserProfile.id) {
        setVisibleModal(e);
      }
    },
    [currentUserProfile.id],
  );

  const sessions = useMemo(() => {
    let resultSession = data?.getSeriesAndSession?.session  || sessions || [];
    let resultSerie = data?.getSeriesAndSession?.seriesLive || [];

    resultSession = resultSession.filter((session) => {
      if (session.ownerUser.id === currentUserProfile.id) {
        endSession({
          variables: {
            sessionId: session.id,
            userId: currentUserProfile.id,
            currentUserId: currentUserProfile.id,
          },
        });
        return false;
      }
      return true;
    });
    resultSerie = resultSerie.filter((serie) => {
      if (serie.ownerUser.id === currentUserProfile.id) {
        endSession({
          variables: {
            sessionId: serie.session.id,
            userId: currentUserProfile.id,
            currentUserId: currentUserProfile.id,
          },
        });
        return false;
      }
      return true;
    });
    if (data.getSeriesAndSession) {
      const sortedItems = [...resultSession, ...resultSerie, ...data.getSeriesAndSession.series];
      return sortedItems;
    }
    return resultSession;
  }, [currentUserProfile.id, data, endSession]);

  return (
    <Wrapper>
      {visibleModal && <UserInfoModal data={visibleModal} event={userInfoEvent} />}
      <UserDetailInfoModal info={visibleModalPage && visibleModalPage.id} onClose={handleCloseModal} />
      {(sessions.length > 0 || loading) && <TitleHeaderText>{HEADER_SESSIONS_TITLE}</TitleHeaderText>}
      <Sessions
        sessions={sessions}
        loading={loading}
        onJoinSession={handleJoinSession}
        setVisibleModal={setVisibleModal}
        setVisibleModalPage={setVisibleModalPage}
        navigation={navigation}
        openSerie={handleOpenSerie}
        handleEndReached={handleEndReached}
        handleRefresh={handleRefresh}
        scrollView={scrollView}
      />
    </Wrapper>
  );
};

export default withSafeArea(HomeScreen);
