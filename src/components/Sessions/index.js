import React, {useCallback, useMemo} from 'react';
import { FlatList} from 'react-native';
import styled from 'styled-components/native';
import {NoSession} from 'assets/svg';
import {tabsHeight} from 'src/navigation/tabs';
import FeedItem from 'src/components/Sessions/FeedItem';
import {SerieHome} from 'src/components/Series'

const EmptyComponent = styled.View({
  flex: 1,
});

export default function Sessions({
  sessions, 
  onJoinSession, 
  setVisibleModalPage, 
  loading, 
  navigation, 
  openSerie,
  handleRefresh,
  handleEndReached,
  scrollView
}) {
  const getSessions = useCallback(() => sessions?.filter((i) => !i.finishedAt), [sessions]);

  const renderItem = ({item}) => {
      if(item.__typename==="SessionObject"){
        return <FeedItem session={item} onJoinSession={onJoinSession} setVisibleModalPage={setVisibleModalPage} />
      }

      if(item.__typename==="SeriesObject" || item.__typename==="SeriesViewers"){
        return <SerieHome series={item} navigation={navigation} onJoinSession={onJoinSession} openSerie={openSerie}/>
      } 
  }

  const memorizedValue=useMemo(()=>renderItem,[getSessions])

  const keyExtractor = useCallback((item) => `${item.id.toString()}-feeditem-${Math.random()}`, []);

  return (
    <FlatList
      ref={scrollView}
      data={getSessions()}
      renderItem={memorizedValue}
      keyExtractor={keyExtractor}
      initialNumToRender={5}
      contentContainerStyle={{minHeight: '100%', paddingBottom: tabsHeight}}
      onRefresh={handleRefresh}
      onEndReached={handleEndReached}
      refreshing={false}
      endReached
      ListEmptyComponent={
        !loading && (
          <EmptyComponent>
            <NoSession />
          </EmptyComponent>
        )
      }
      
    />
  );
}
