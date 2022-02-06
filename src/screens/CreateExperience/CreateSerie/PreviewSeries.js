import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet, Alert} from 'react-native';
import styled from 'styled-components/native';
import {Serie} from 'assets/svg';
import {FollowersContext} from 'src/containers/followers';
import {tabsHeight} from 'src/navigation/tabs';
import {statusBarHeight} from 'src/components/withSafeArea';
import colors from 'src/constants/Colors';
import {Header, TitleHeaderText} from 'src/screens/Series/components/Header';
import Series from 'src/components/Series';
import Button from 'src/components/NewLargeButton';
import {PREVIEW_SERIES_TITLE} from 'src/constants/Texts';
import {EDIT_SERIES} from 'src/graphql/mutations/series';
import {useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import {GET_USER_SERIES} from 'src/graphql/queries/profile';
import LadingSerie from 'src/components/LoadingSerie';
import EditableHeaderWithImage from '../../Profile/components/EditableHeaderWithImage';

const Wrapper = styled.View({
  width: '100%',
  height: '100%',
  backgroundColor: colors.blueBackgroundSession,
});

const SeriesContainer = styled.View({
  width: '100%',
  alignSelf: 'center',
});

const ButtonContainer = styled.View({
  flexDirection: 'row',
  paddingHorizontal: 24,
  alignSelf: 'center',
});

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginRight: 20,
  },
  scroll: {
    paddingBottom: tabsHeight + statusBarHeight,
    minHeight: '80%',
  },
});

function buildFile(uri) {
  return new ReactNativeFile({
    uri,
    name: 'image.jpg',
    type: 'image/jpeg',
  });
}

export default function PreviewSeries({navigation, route}) {
  const {params} = route;
  const {sessionParams} = params;
  const {currentUserProfile} = useContext(FollowersContext);
  const {username, fullName, avatar, bio} = currentUserProfile;
  const [currentSeries] = useState({
    ownerUser: {
      username,
      fullName,
      bio,
      avatar,
    },
    topics: sessionParams.topicsObjects,
    id: 1,
    members: [],
    description: sessionParams.Description,
    title: sessionParams.Name,
    newSeries: true,
    schedule:sessionParams.Schedule
  });
  const [seriesAvatar, setSeriesAvatar] = useState(sessionParams.series?.avatar);
  const [seriesCover, setSeriesCover] = useState(sessionParams.series?.backgroundImage);
  const [editSerie, {loading}] = useMutation(EDIT_SERIES, {
    refetchQueries: [{query: GET_USER_SERIES}],
    onCompleted() {
      navigation.navigate('ProfileInit');
    },
    onError(e) {
      Alert.alert('Error', `${e.message}`);
      navigation.navigate('ProfileInit');
    },
  });

  const onSubmit = async () => {
    sessionParams.Avatar = seriesAvatar;
    sessionParams.Cover = seriesCover;
    if (sessionParams.series) {
      await editSerie({
        variables: {
          serieId: sessionParams.series.id,
          schedule: sessionParams.Schedule,
          serie: {
            description: sessionParams.Description,
            seriesName: sessionParams.Name,
            topics: sessionParams.topics,
            className: sessionParams.className,
            calendarName: sessionParams.CalendarName,
          },
          avatar: buildFile(sessionParams.Avatar),
          backgroundImage: buildFile(sessionParams.Cover),
        },
      });
    } else {
      navigation.navigate('ShareSession', {sessionParams});
    }
  };

  return (
    <Wrapper>
      <LadingSerie visible={loading} />
      <ScrollView>
        <Header>
          <TitleHeaderText>{PREVIEW_SERIES_TITLE}</TitleHeaderText>
          <Serie style={styles.icon} />
        </Header>
        <EditableHeaderWithImage
          avatar={seriesAvatar}
          setAvatar={setSeriesAvatar}
          cover={seriesCover}
          setCover={setSeriesCover}
        />
        <SeriesContainer>
          <Series series={currentSeries} />
        </SeriesContainer>
        <ButtonContainer>
          <Button
            title="Back"
            flex
            transparent
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Button onPress={onSubmit} flex title="Next" disabled={!seriesAvatar || !seriesCover} />
        </ButtonContainer>
      </ScrollView>
    </Wrapper>
  );
}
