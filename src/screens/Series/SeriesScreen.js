import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet} from 'react-native';
import {SeriesProfile} from 'src/components/Series';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {Serie} from 'assets/svg';
import HeaderWithImage from 'src/components/HeaderWithImage';
import BackButton from 'src/components/BackButton';
import {useMutation, useLazyQuery} from '@apollo/client';
import {DELETE_SERIES} from 'src/graphql/mutations/series';
import {UNKNOWN_ERROR_TEXT} from 'src/constants/Texts';
import {GET_USER_SERIES} from 'src/graphql/queries/profile';
import {Header, TitleHeaderText} from './components/Header';

const Wrapper = styled.View({
  width: '100%',
  height: '100%',
  backgroundColor: colors.blueBackgroundSession,
  marginTop: 24,
});

const SeriesContainer = styled.View({
  width: '100%',
  alignSelf: 'center',
});

const LoadingContainer = styled.View({
  flex: 1,
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  marginBottom: 100,
  backgroundColor: colors.blueBackgroundSession,
});

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginRight: 20,
  },
  scroll: {
    paddingBottom: 0,
  },
});

const SeriesScreen = ({navigation, route}) => {
  const {series} = route.params;
  const [currentSeries, setCurrentSeries] = useState(series);

  const [getUserSeries] = useLazyQuery(GET_USER_SERIES, {
    onCompleted(data) {
      setCurrentSeries(data);
    },
  });

  const [deleteSeries, {loading}] = useMutation(DELETE_SERIES, {
    refetchQueries: [{query: GET_USER_SERIES}],
    onError(e) {
      Alert.alert(UNKNOWN_ERROR_TEXT, e);
    },
    onCompleted() {
      navigation.goBack();
    },
  });

  const handleDelete = (serieId) => {
    deleteSeries({variables: {serieId}});
  };

  const handleEdit = (seriesObj) => {
    navigation.navigate('EditSeriesStack', {experience: 'series', series: seriesObj});
  };

  const handleInvite = (seriesObj) => {
    navigation.navigate('InviteUsers', {sessionParams: {experience: 'seriesInvite', series: seriesObj}});
  };

  const handleWatchMembers = (subscribedUsers) => {
    navigation.navigate('SeriesMembersJoined', {subscribedUsers});
  };

  useEffect(() => {
    if (!currentSeries) {
      getUserSeries();
    }
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={colors.white} />
      </LoadingContainer>
    );
  }

  return (
    <>
      <Wrapper>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Header>
            <TitleHeaderText>Scoby Cafe</TitleHeaderText>
            <Serie style={styles.icon} />
          </Header>
          <HeaderWithImage avatar={series.avatar} backgroundImage={series.backgroundImage} />
          <SeriesContainer>
            <SeriesProfile
              series={series}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleInvite={handleInvite}
              handleWatchMembers={handleWatchMembers}
              navigation={navigation}
            />
          </SeriesContainer>
        </ScrollView>
      </Wrapper>
      <BackButton onPress={() => navigation.goBack()} />
    </>
  );
};

export default SeriesScreen;
