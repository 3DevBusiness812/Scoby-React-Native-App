import {Alert} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {FollowersContext} from 'src/containers/followers';
import colors from 'src/constants/Colors';
import {Header, TitleHeaderText} from 'src/screens/Series/components/Header';
import Teams from 'src/components/Teams';
import Button from 'src/components/NewLargeButton';
import {buildFile, checkIsFileUploaded} from 'src/utils/helpers';
import {PREVIEW_SERIES_TITLE, UNKNOWN_ERROR_TEXT} from 'src/constants/Texts';
import {useMutation} from '@apollo/client';
import {EDIT_TEAM} from 'src/graphql/mutations/team';
import EditableHeaderWithImage from '../../Profile/components/EditableHeaderWithImage';

const Wrapper = styled.View({
  width: '100%',
  height: '100%',
  backgroundColor: colors.blueBackgroundSession,
  justifyContent: 'flex-end',
});
const ButtonContainer = styled.View({
  flexDirection: 'row',
  paddingHorizontal: 24,
  alignSelf: 'center',
  position: 'absolute',
  marginBottom: 0,
});

export default function PreviewTeam({navigation, route}) {
  const {currentUserProfile} = useContext(FollowersContext);
  const [seriesAvatar, setSeriesAvatar] = useState(null);
  const [seriesCover, setSeriesCover] = useState(null);
  const {params} = route;
  const {sessionParams} = params;

  useEffect(() => {
    if (sessionParams?.team) {
      setSeriesCover(sessionParams?.team?.backgroundImage);
      setSeriesAvatar(sessionParams?.team?.avatar);
    }
  }, []);

  const handleSuccessfulEditTeam = ({editTeam: {id}}) => navigation.replace('TeamScreen', {id});

  const [editTeam, {loading: isTeamEditingInProcess}] = useMutation(EDIT_TEAM, {
    onCompleted: handleSuccessfulEditTeam,
    onError: () => Alert.alert(UNKNOWN_ERROR_TEXT),
  });

  const onSubmit = () => {
    sessionParams.Avatar = seriesAvatar;
    sessionParams.Cover = seriesCover;

    const isEdit = !!sessionParams?.team;
    if (!isEdit) return navigation.navigate('TeamSettings', {sessionParams});

    const {Description: description, Name: name, teamId, topics, SecondScreenLink: linkWebsite} = sessionParams;

    const isAvatarChanged = !checkIsFileUploaded(seriesAvatar);
    const isCoverChanged = !checkIsFileUploaded(seriesCover);

    const editTeamPayload = {description, name, topics, teamId, linkWebsite};
    let variables = {editTeamPayload};

    if (isAvatarChanged) variables = {...variables, avatar: buildFile(seriesAvatar)};
    if (isCoverChanged) variables = {...variables, backgroundImage: buildFile(seriesCover)};

    editTeam({variables});
  };

  return (
    <Wrapper>
      <Header>
        <TitleHeaderText>{PREVIEW_SERIES_TITLE}</TitleHeaderText>
      </Header>
      <EditableHeaderWithImage
        avatar={seriesAvatar}
        setAvatar={setSeriesAvatar}
        cover={seriesCover}
        setCover={setSeriesCover}
      />
      <Teams
        currentUserProfile={currentUserProfile}
        name={sessionParams.Name}
        description={sessionParams.Description}
        topics={sessionParams.topicsObjects}
        newTeam
      />
      <ButtonContainer>
        <Button
          title="Back"
          flex
          transparent
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button
          onPress={onSubmit}
          flex
          title="Next"
          loading={isTeamEditingInProcess}
          disabled={!seriesAvatar || !seriesCover}
        />
      </ButtonContainer>
    </Wrapper>
  );
}
