import React from 'react';
import {ActivityIndicator, Alert, Modal, ScrollView, StyleSheet} from 'react-native';
import {SeriesProfile} from 'src/components/Series';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {Serie, CloseWhiteIco} from 'assets/svg';
import HeaderWithImage from 'src/components/HeaderWithImage';
import {useQuery} from '@apollo/client';
import {GET_SERIE_BY_ID} from 'src/graphql/queries/series';
import {SERIES_ERROR_LOADING, SERIES_ERROR_TITLE, SERIES_NON_EXISTENT} from 'src/constants/Texts';
import {Header, TitleHeaderText} from './components/Header';

const Wrapper = styled.View({
  width: '100%',
  height: '100%',
  backgroundColor: colors.blueBackgroundSession,
  marginTop: 50,
});

const CloseButton = styled.TouchableOpacity({
  left: 0,
  margin: 0,
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

const SeriesLandingView = ({navigation, route, info}) => {
  const seriesID = route?.params?.id;
  const id = seriesID || info;
  const {loading, data, error} = useQuery(GET_SERIE_BY_ID, {
    variables: {id: parseFloat(id, 10)},
    fetchPolicy: 'network-only',
  });
  const series = data?.getSerieById;

  const handleInvite = (seriesObj) => {
    navigation.goBack();
    navigation.navigate('InviteUsers', {sessionParams: {experience: 'seriesInvite', series: seriesObj}});
  };

  const handleWatchMembers = (subscribedUsers) => {
    navigation.goBack();
    navigation.navigate('SeriesMembersJoined', {subscribedUsers});
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={colors.white} />
      </LoadingContainer>
    );
  }

  const getErrorAlert = () => {
    const msg = error ? SERIES_ERROR_LOADING : SERIES_NON_EXISTENT;
    Alert.alert(SERIES_ERROR_TITLE, msg, [
      {
        text: 'Ok',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Modal visible={id != null && !error} transparent statusBarTranslucent animationType="slide">
      <Wrapper>
        {error || !series ? (
          getErrorAlert()
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <CloseButton onPress={() => navigation.goBack()}>
              <CloseWhiteIco />
            </CloseButton>
            <Header>
              <TitleHeaderText>Scoby Cafe</TitleHeaderText>
              <Serie style={styles.icon} />
            </Header>
            <HeaderWithImage avatar={series.avatar} backgroundImage={series.backgroundImage} />
            <SeriesContainer>
              <SeriesProfile
                series={{...series}}
                handleInvite={handleInvite}
                disabled
                navigation={navigation}
                handleWatchMembers={handleWatchMembers}
              />
            </SeriesContainer>
          </ScrollView>
        )}
      </Wrapper>
    </Modal>
  );
};

export default SeriesLandingView;
