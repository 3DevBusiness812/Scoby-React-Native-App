import React from 'react';
import FeedItem from './FeedItem';
import FeedItemProfile from './FeedItemProfile';
import SeriesHomeItem from './SeriesItem'

export default function Series({series, handleDelete, handleEdit, handleOpen}) {
  return <FeedItem series={series} handleDelete={handleDelete} handleEdit={handleEdit} handleOpen={handleOpen} />;
}

export function SeriesProfile({
  series,
  handleDelete,
  handleEdit,
  handleOpen,
  handleInvite,
  handleWatchMembers,
  disabled,
  navigation,
  route,
}) {
  return (
    <FeedItemProfile
      series={series}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      handleOpen={handleOpen}
      handleInvite={handleInvite}
      handleWatchMembers={handleWatchMembers}
      disabled={disabled}
      navigation={navigation}
      route={route}
    />
  );
}

export function SerieHome({
  series,
  navigation,
  onJoinSession,
  openSerie
}){
  return (
    <SeriesHomeItem  
      series={series} 
      navigation={navigation} 
      onJoinSession={onJoinSession} 
      openSerie={openSerie}
    />
  )
}
