import React, {useCallback, useEffect, useRef, useState, useContext} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {tabsHeight} from 'src/navigation/tabs';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {GET_ACTIVITY} from 'src/graphql/queries/profile';
import {useLazyQuery, useQuery} from '@apollo/client';
import Follow from 'src/components/Follow';
import JoinSession from 'src/components/JoinSession';
import moment from 'moment-timezone';
import Message from 'src/components/Message';
import Team from 'src/components/Team';
import JoinSerie from 'src/components/JoinSerie';
import {GET_FOLLOWERS} from 'src/graphql/queries/followers';
import {FollowersContext} from 'src/containers/followers';
import UserDetailInfoModal from '../UserDetailInfoModal';

const Wrapper = styled.View({
  width: '100%',
  height: '100%',
  backgroundColor: colors.blueBackgroundSession,
  overflow: 'hidden',
});

const Members = styled.FlatList({
  flex: 1,
  paddingTop: 10,
});

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  marginVertical: 8,
});

const ContainerTime = styled.View({
  height: 50,
  width: 35,
  justifyContent: 'flex-end',
  marginRight: 15,
});

const TextContainer = styled.View({
  flexDirection: 'column',
  width: '40%',
  marginHorizontal: 10,
});

const AvatarImage = styled.Image({
  width: 44,
  height: 44,
  borderRadius: 44,
});

const Text = styled.Text({
  ...Fonts.avenir,
  width: '100%',
  fontSize: 13,
  color: colors.white,
  lineHeight: '20px',
  fontWeight: '200',
});

const TextName = styled.Text(() => ({
  ...Fonts.avenirBold,
}));

const TextTime = styled.Text({
  ...Fonts.avenir,
  justifyContent: 'flex-end',
  fontSize: 12,
  color: colors.greySession,
});

const FollowButton = styled(Follow)({
  textAlign: 'center',
  fontSize: 14,
  ...Fonts.avenirSemiBold,
});

const JoinSessionButton = styled(JoinSession)({
  textAlign: 'center',
  fontSize: 14,
  ...Fonts.avenirSemiBold,
});

const MessageButton = styled(Message)({
  textAlign: 'center',
  fontSize: 14,
  ...Fonts.avenirSemiBold,
});

const TeamButton = styled(Team)({
  textAlign: 'center',
  fontSize: 14,
  ...Fonts.avenirSemiBold,
});

const EmptyComponent = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const EmptyActivity = styled.Text({
  ...Fonts.avenir,
  fontSize: 20,
  color: 'rgba(255,255,255,.5)',
});

const AvatarContainer = styled.TouchableOpacity({
  height: '100%',
});

function keyExtractor({id}) {
  return `notification-row-${id}-${Math.random()}`;
}

function getImgSource(avatar) {
  return avatar ? {uri: avatar} : avatarSrc;
}

const limit = 10;

const Activities = ({navigation, route}) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const scrollView = useRef();
  const {currentUserProfile} = useContext(FollowersContext);
  const [currentShowProfile, setCurrentShowProfile] = useState(null);

  const setTime = useCallback((time) => {
    const now = moment(new Date(Date.now()));
    const last = moment(time);
    if (now.diff(last, 's') > 0 && now.diff(last, 'm') < 1) {
      return `${now.diff(last, 's')} s`;
    }

    if (now.diff(last, 'm') > 0 && now.diff(last, 'h') < 1) {
      return `${now.diff(last, 'm')} m`;
    }

    if (now.diff(last, 'h') > 0 && now.diff(last, 'd') < 1) {
      return `${now.diff(last, 'h')} h`;
    }

    if (now.diff(last, 'd') > 0 && now.diff(last, 'M') < 1) {
      return `${now.diff(last, 'd')} d`;
    }

    if (now.diff(last, 'M') > 0 && now.diff(last, 'y') < 1) {
      return `${now.diff(last, 'M')} M`;
    }
    if (now.diff(last, 'y') > 0) {
      return `${now.diff(last, 'y')} y`;
    }
  }, []);

  const setBodyText = useCallback((item, additionalPayload) => {
    if (item === 'follow') {
      return 'has started following you!';
    }

    if (item === 'message') {
      return 'has sent you a message';
    }

    if (item === 'session') {
      return 'has invited you to a live Session!';
    }

    if (item === 'serie') {
      return 'has invited you to a Series!';
    }

    if (item === 'teamUpdate') {
      return `has changed Team type ${additionalPayload}`;
    }

    return 'none';
  }, []);

  const {data: {getFollowerUsers} = {getFollowerUsers: {data: []}}} = useQuery(GET_FOLLOWERS, {
    variables: {
      paging: {
        limit: 100,
        page: 1,
      },
      userId: currentUserProfile.id,
    },
  });

  const [refetch, {data = {getActivity: {data: []}}, fetchMore, loading, error}] = useLazyQuery(GET_ACTIVITY, {
    pollInterval: 10000,
    fetchPolicy: 'network-only',
    variables: {
      paging: {
        page,
        limit,
      },
    },
    onCompleted({getActivity}) {
      setTotal(getActivity.paging.total);
    },
  });

  const handleEndReached = useCallback(() => {
    setPage(page + 1);
    fetchMore({
      variables: {
        paging: {
          limit,
          page: page + 1,
        },
      },
    });
  }, [fetchMore, page]);

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
  }, [refetch]);

  const styles = StyleSheet.create({
    scroll: {
      paddingBottom: tabsHeight,
      minHeight: '100%',
    },
  });

  const setBottom = useCallback(
    (item) => {
      if (item.type_action === 'follow') {
        return <FollowButton user={item.sourceUser} widthContainer="25%" />;
      }
      if (item.type_action === 'message') {
        return (
          <MessageButton
            id={item.sourceUser.id}
            role={item.sourceUser.role}
            username={item.sourceUser.username}
            fullName={item.sourceUser.fullName}
            widthContainer="25%"
          />
        );
      }

      if (item.type_action === 'session') {
        return (
          <JoinSessionButton
            getFollowerUsers={getFollowerUsers}
            id={item.procedure_action}
            navigation={navigation}
            widthContainer="25%"
          />
        );
      }

      if (item.type_action === 'teamUpdate') {
        return <TeamButton id={item.procedure_action} widthContainer="25%" />;
      }

      if (item.type_action === 'serie') {
        return <JoinSerie id={item.procedure_action} widthContainer="25%" navigation={navigation} />;
      }

      return 'none';
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item}) => (
      <Container>
        <AvatarContainer
          onPress={() => {
            setCurrentShowProfile(item.sourceUser.id);
          }}>
          <AvatarImage source={getImgSource(item.sourceUser.avatar)} style={{resizeMode: 'cover'}} />
        </AvatarContainer>
        <TextContainer>
          <Text>
            <TextName>{item.sourceUser.fullName}</TextName> {setBodyText(item.type_action, item.additionalPayload)}
          </Text>
        </TextContainer>
        <ContainerTime>
          <TextTime>{setTime(item.createdAt)}</TextTime>
        </ContainerTime>
        {setBottom(item)}
      </Container>
    ),
    [setTime, setBodyText, setBottom],
  );

  useEffect(() => {
    scrollView.current?.scrollToOffset({x: 0, y: 0, animated: true});
    const timeout = setTimeout(() => {
      setPage(1);
      refetch({
        variables: {
          paging: {
            limit,
            page: 1,
          },
        },
      });
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [refetch]);

  const closeUserModal = () => {
    setCurrentShowProfile(null);
  };

  return (
    <Wrapper>
      <UserDetailInfoModal info={currentShowProfile} navigation={navigation} route={route} onClose={closeUserModal} />
      <Members
        ref={scrollView}
        data={data.getActivity.data}
        contentContainerStyle={styles.scroll}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
        refreshing={false}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        endReached
        ListFooterComponent={
          <ActivityIndicator
            style={{marginTop: 30}}
            size="large"
            color={colors.white}
            animating={(loading || data.getActivity.data.length < total) && !error}
          />
        }
        ListEmptyComponent={
          !loading && (
            <EmptyComponent>
              <EmptyActivity>No Activity Yet</EmptyActivity>
            </EmptyComponent>
          )
        }
      />
    </Wrapper>
  );
};

export default Activities;
