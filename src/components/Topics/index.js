import React, {useRef, useEffect, useState, useCallback} from 'react';
import {StyleSheet, Image, ActivityIndicator} from 'react-native';
import {useQuery} from '@apollo/client';
import styled from 'styled-components/native';
import logo from 'assets/images/logos/Scoby_Final_Logos/ScobyDude_preferred_logo/scoby_dude.png';
import {GET_TOPICS, GET_USER_PROFILE} from 'src/graphql/queries/profile';
import colors from 'src/constants/Colors';
import {SIGNUP_SETUP_PROFILE_BUTTON} from 'src/constants/Texts';
import Fonts from 'src/constants/Fonts';
import ModalHeader from 'src/screens/Profile/components/ModalHeader';
import CheckboxForm from './newCheckboxForm';
import NewLargeButton from '../NewLargeButton';
import withSafeArea from '../withSafeArea';

const Container = styled.View({
  flex: 1,
  backgroundColor: `${colors.blueBackgroundSession}`,
});

const LoadingContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

const HeaderContainer = styled.View({
  width: '100%',
  backgroundColor: colors.blueBackgroundSession,
  marginHorizontal: 24,
});

const ScrollView = styled.ScrollView({
  flex: 1,
  marginHorizontal: 24,
});

const TextDesc = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  color: 'white',
  width: '100%',
  marginBottom: '8px',
  lineHeight: '22px',
});

const TextTitle = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  color: colors.white,
  lineHeight: '32px',
  marginBottom: 4,
});

const ButtonWrapper = styled.View({
  marginHorizontal: 24,
  flexDirection: 'row',
});

const styles = StyleSheet.create({
  logo: {
    width: '20%',
    height: '20%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  scroll: {
    paddingBottom: 12,
  },
});

function Topics({value, description, title, close, save, profile, showTitle, showSubtitle, showLogo, saving = false}) {
  const [topic, setTopic] = useState('');
  const [topicCurrent, setTopicCurrent] = useState('[]');
  const [disableTopic, setDisableTopic] = useState(true);
  const [isDisabledDone, setDisableDone] = useState(true);
  const topicsRef = useRef(null);
  const user = useQuery(GET_USER_PROFILE);
  const {data, loading, error} = useQuery(GET_TOPICS);

  const submit = useCallback(() => {
    const currentTopics = topicsRef.current.getTopics();
    setTimeout(() => {
      if (save) {
        save(currentTopics);
      }
    }, 500);
  }, [save]);

  const handleSubmit = useCallback(() => {
    if (!isDisabledDone) {
      submit();
    }
  }, [isDisabledDone, submit]);

  useEffect(() => {
    if (value) {
      const onlyIdArr = value.map((i) => i.id);
      setTopic(JSON.stringify(onlyIdArr));
    }
  }, [value]);

  useEffect(() => {
    if (topic === topicCurrent) {
      setDisableDone(true);
    } else if (topicCurrent === '[]') {
      setDisableDone(true);
    } else {
      setDisableDone(false);
    }
  }, [topicCurrent, topic]);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator color={colors.white} size="large" />
      </LoadingContainer>
    );
  }

  if (error || !data) {
    return <></>;
  }

  return (
    <Container>
      {showLogo && <Image source={logo} style={styles.logo} />}
      {profile ? (
        <ModalHeader title={title} onPressBack={close} onPressDone={handleSubmit} disabled={isDisabledDone} />
      ) : (
        <HeaderContainer>
          {showTitle && <TextTitle>{title || 'Select topics'}</TextTitle>}
          {showSubtitle && (
            <TextDesc>
              {description ||
                'Help us make your Scoby experience better! \nPick interesting topics and our AI will do the rest.'}
            </TextDesc>
          )}
        </HeaderContainer>
      )}
      <ScrollView scrollEventThrottle={16} contentContainerStyle={styles.scroll}>
        {data ? (
          <CheckboxForm
            setTopicCurrent={setTopicCurrent}
            ref={topicsRef}
            data={data}
            user={user}
            setDisableTopic={setDisableTopic}
            background_color={colors.blueBackgroundSession}
            textBoxColor={colors.white}
          />
        ) : null}
      </ScrollView>
      {!profile ? (
        <ButtonWrapper>
          <NewLargeButton
            disabled={disableTopic || saving}
            loading={saving}
            onPress={submit}
            title={SIGNUP_SETUP_PROFILE_BUTTON}
          />
        </ButtonWrapper>
      ) : null}
    </Container>
  );
}

export default withSafeArea(Topics);
