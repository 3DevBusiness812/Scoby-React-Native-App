import React, {useState, useCallback, useRef, useEffect} from 'react';
import {StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator} from 'react-native';
import {useLazyQuery} from '@apollo/client';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {GET_USERS} from 'src/graphql/queries/profile';
import {VerifiedIco} from 'assets/svg';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import withSafeArea from 'src/components/withSafeArea';
import Fonts from 'src/constants/Fonts';
import {tabsHeight} from 'src/navigation/tabs';
import SearchInput from 'src/components/SearchInput';
import Follow from 'src/components/Follow';
import UserDetailInfoModal from './UserDetailInfoModal';

const Wrapper = styled.View({
  width: '100%',
  height: '100%',
  backgroundColor: colors.blueBackgroundSession,
  overflow: 'hidden',
});

const Members = styled.FlatList({
  flex: 1,
  marginHorizontal: 24,
});

const ListText = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: colors.white,
});

const Avatar = styled.Image({
  width: 44,
  height: 44,
  borderRadius: 44,
});

const User = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 16,
});

const Username = styled.View({
  flex: 1,
  paddingLeft: 16,
  paddingRight: 32,
  flexDirection: 'row',
});

const FollowButton = styled(Follow)({
  width: 96,
  textAlign: 'center',
  fontSize: 14,
  ...Fonts.avenirSemiBold,
});

const VerifiedContainer = styled.View({
  flex: 0,
  paddingHorizontal: 8,
});

function getImgSource(avatar) {
  return avatar ? {uri: avatar} : avatarSrc;
}

function keyExtractor({id}) {
  return `user-row-${id}-${Math.random()}`;
}

const limit = 20;

function SearchScreen({navigation, route}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const scrollView = useRef();
  const [currentShowProfile, setCurrentShowProfile] = useState(null);

  const [refetch, {data = {getUsers: {data: []}}, fetchMore, loading, error}] = useLazyQuery(GET_USERS, {
    variables: {
      paging: {
        limit,
        page,
      },
      query,
    },
    onCompleted({getUsers}) {
      setTotal(getUsers.paging.total);
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
        query,
      },
    });
  }, [fetchMore, page, query]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch({
      fetchPolicy: 'no-cache',
      variables: {
        paging: {
          limit,
          page: 1,
        },
        query,
      },
    });
    scrollView.current?.scrollToOffset({x: 0, y: 0, animated: true});
  }, [query, refetch]);

  const styles = StyleSheet.create({
    scroll: {
      paddingBottom: tabsHeight + 24,
    },
  });

  const renderItem = useCallback(
    ({item}) => {
      const goToUserDetails = () => setCurrentShowProfile(item.id);

      return (
        <User onPress={goToUserDetails}>
          <Avatar source={getImgSource(item.avatar)} />
          <Username>
            <ListText numberOfLines={1}>{item.fullName || item.username}</ListText>
            {item.role && item.role === 'creator' && (
              <VerifiedContainer>
                <VerifiedIco />
              </VerifiedContainer>
            )}
          </Username>
          <FollowButton user={item} navigation={navigation} />
        </User>
      );
    },
    [navigation],
  );

  useEffect(() => {
    scrollView.current?.scrollToOffset({x: 0, y: 0, animated: true});
    const timeout = setTimeout(
      () => {
        setPage(1);
        refetch({
          variables: {
            paging: {
              limit,
              page: 1,
            },
            query,
          },
        });
      },
      query ? 400 : 0,
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [query, refetch]);

  const closeUserModal = () => {
    setCurrentShowProfile(null);
  };

  return (
    <Wrapper>
      <UserDetailInfoModal info={currentShowProfile} navigation={navigation} route={route} onClose={closeUserModal} />
      <SearchInput value={query} onChangeText={setQuery} autoCorrect={false} />
      <Members
        ref={scrollView}
        data={data.getUsers.data}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={styles.scroll}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        refreshing={false}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        endReached
        ListFooterComponent={
          <ActivityIndicator
            size="large"
            color={colors.white}
            animating={(loading || data.getUsers.data.length < total) && !error}
          />
        }
      />
      <KeyboardAvoidingView
        enabled={Platform.OS === 'android'}
        behavior="padding"
        keyboardVerticalOffset={-tabsHeight}
      />
    </Wrapper>
  );
}

export default withSafeArea(SearchScreen);
