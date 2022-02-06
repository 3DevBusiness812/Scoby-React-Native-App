/* eslint-disable no-use-before-define */
import React, {useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import MessagesList from 'src/components/MessagesList/index';
import FilterInput from 'src/components/FilterInput';
import styled from 'styled-components';
import Colors from 'src/constants/Colors';
import NoMessages from 'src/components/MessagesList/NoMessages';
import Fonts from 'src/constants/Fonts';
import {useQuery} from '@apollo/client';
import {GET_USER_CHAT_ROOMS} from 'src/graphql/queries/chat';
import {isNotEmptyArr} from 'src/utils/helpers';
import {filterRooms} from 'src/utils/filterRooms';
import {GET_USER_PROFILE} from 'src/graphql/queries/profile';

const Wrapper = styled.View({flex: 1});

const NotFoundTextWrapper = styled.View({
  paddingVertical: 20,
  borderBottomWidth: 2,
  borderBottomColor: Colors.backgroundSearchBar,
  width: '100%',
  paddingLeft: 6,
  opacity: 0.5,
});

const NotFoundText = styled.Text({color: Colors.white, ...Fonts.avenir, fontSize: 12});

export const Messages = ({navigation}) => {
  const {data, loading: isChatRoomsLoading} = useQuery(GET_USER_CHAT_ROOMS, {
    pollInterval: 1000,
  });
  const {data: getUserProfile = {}} = useQuery(GET_USER_PROFILE);
  const currUser = getUserProfile?.getUserProfile;

  const rooms = data?.getUserChatRooms;
  const [filter, setFilter] = useState('');
  const filteredData = useMemo(() => filterRooms(rooms, filter), [rooms, filter]);
  if (isChatRoomsLoading) return <ActivityIndicator />;

  return (
    <Wrapper>
      <FilterInput
        value={filter}
        onChangeText={setFilter}
        placeholderTextColor={Colors.greySession}
        style={styles.input}
      />
      {isNotEmptyArr(rooms) && filteredData.length === 0 && (
        <NotFoundTextWrapper>
          <NotFoundText>No results found</NotFoundText>
        </NotFoundTextWrapper>
      )}
      {isNotEmptyArr(rooms) ? (
        <MessagesList currUser={currUser} navigation={navigation} data={filteredData} />
      ) : (
        <NoMessages navigation={navigation} />
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  input: {color: Colors.greySession, paddingLeft: 40},
});
