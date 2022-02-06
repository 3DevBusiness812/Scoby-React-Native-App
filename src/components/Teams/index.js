import React from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import FeedItem from './FeedItem';

const TeamList = styled.FlatList({
  flex: 1,
  paddingTop: 30,
});

const style = StyleSheet.create({
  list: {
    width: '100%',
  },
});

const Wrapper = styled.View({
  width: '100%',
  flex: 1,
  backgroundColor: colors.blueBackgroundSession,
  overflow: 'hidden',
});

function keyExtractor({id}) {
  return `feed-row-${id}-${Math.random()}`;
}

export default function Teams(team) {
  const list = [team];
  return (
    <Wrapper>
      <TeamList data={list} renderItem={FeedItem} keyExtractor={keyExtractor} contentContainerStyle={style.list} />
    </Wrapper>
  );
}
