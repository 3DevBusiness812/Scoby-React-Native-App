/* eslint-disable no-use-before-define */
import {useLazyQuery} from '@apollo/client';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import BackButton from 'src/components/BackButton';
import FilterInput from 'src/components/FilterInput';
import withSafeArea from 'src/components/withSafeArea';
import Colors from 'src/constants/Colors';
import {tabsHeight} from 'src/navigation/tabs';
import Fonts from 'src/constants/Fonts';
import {GET_USERS} from 'src/graphql/queries/profile';
import styled from 'styled-components/native';
import FoundUser from 'src/components/MessagesList/FoundUser';

const Header = styled.View({
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: 5,
  marginTop: 50,
});

function keyExtractor({id}) {
  return `user-row-${id}-${Math.random()}`;
}

const Wrapper = styled.View({flex: 1, paddingHorizontal: 27});

const TitleText = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 25,
  color: Colors.white,
  marginBottom: 20,
});

const ToText = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 14,
  color: Colors.white,
});

const limit = 20;

const NewMessage = ({navigation}) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const scrollView = useRef();

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

  return (
    <Wrapper>
      <BackButton navigation={navigation} style />
      <Header>
        <TitleText>New Message</TitleText>
        <ToText>To</ToText>
      </Header>
      <FilterInput placeholder="Search..." value={query} onChangeText={setQuery} style={styles.input} />
      <FlatList
        ref={scrollView}
        data={data.getUsers.data}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={styles.scroll}
        renderItem={(item) => <FoundUser item={item} navigation={navigation} />}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        refreshing={false}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        endReached
        ListFooterComponent={
          <ActivityIndicator
            size="large"
            color={Colors.white}
            animating={(loading || data.getUsers.data.length < total) && !error}
          />
        }
      />
      <KeyboardAvoidingView
        enabled={Platform.OS === 'android'}
        behavior="padding"
        keyboardVerticalOffset={tabsHeight}
      />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  input: {
    color: Colors.greySession,
    paddingLeft: 40,
    paddingRight: 40,
  },
  scroll: {
    paddingBottom: 24,
  },
});

export default withSafeArea(NewMessage);
