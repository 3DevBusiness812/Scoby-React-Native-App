import React from 'react';
import {FlatList} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from 'styled-components';
import Message from './Message';

const Wrapper = styled.View({flex: 1});

const keyExtractor = (id) => `message-${id}-${Math.random()}`;

const MessagesList = ({data = [], navigation, currUser}) => {
  const insets = useSafeAreaInsets();
  const paddingBottomStyle = insets.bottom > 0 ? {paddingBottom: insets.bottom + 15} : {paddingBottom: 30};

  return (
    <Wrapper style={paddingBottomStyle}>
      <FlatList
        data={data}
        renderItem={(item) => <Message currUser={currUser} item={item} navigation={navigation} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={({id}) => keyExtractor(id)}
      />
    </Wrapper>
  );
};

export default MessagesList;
