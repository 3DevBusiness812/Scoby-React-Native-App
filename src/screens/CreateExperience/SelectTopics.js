import React, {useState, useRef, useEffect, useMemo} from 'react';
import {useQuery} from '@apollo/client';
import {GET_TOPICS} from 'src/graphql/queries/profile';
import CheckboxForm from 'src/components/Topics/newCheckboxForm';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {
  EVENT_TOPIC_TITLE,
  EVENT_TOPIC_SUBTITLE,
  SERIES_TOPIC_TITLE,
  SERIES_TOPIC_SUBTITLE,
  SESSION_TOPIC_TITLE,
  SESSION_TOPIC_SUBTITLE,
  TEAM_TOPIC_SUBTITLE,
  TEAM_TOPIC_TITLE,
} from 'src/constants/Texts';
import withSafeArea from 'src/components/withSafeArea';
import Button from 'src/components/NewLargeButton';
import Fonts from 'src/constants/Fonts';

const Wrapper = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #09073a;
  padding-top: 24px;
  padding-horizontal: 24px;
`;

const TitleText = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  color: colors.white,
  marginBottom: 4,
  lineHeight: '32px',
});

const ButtonContainer = styled.View({
  flexDirection: 'row',
});

const TitleContainer = styled.View`
  margin-bottom: 10px;
  align-self: flex-start;
`;

const SubtitleText = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: colors.white,
});

const ScrollView = styled.ScrollView({
  backgroundColor: '#09073a',
  flex: 1,
});

const TopicsCountText = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 16,
  color: colors.white,
  textAlign: 'right',
});

const SelectTopicsSession = ({navigation, route}) => {
  const {series, team} = route.params;
  // const topicsSeries=series.topics
  // eslint-disable-next-line no-unused-vars
  const [_topicCurrent, setTopicCurrent] = useState('[]');
  // eslint-disable-next-line no-unused-vars
  const [_disableTopic, setDisableTopic] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState();
  const [counterTopics, setCounterTopics] = useState(0);
  const topicsRef = useRef(null);

  useEffect(() => {
    if (series?.topics !== undefined) {
      setTimeout(() => {
        series.topics.map((item) => {
          topicsRef.current.setTopic(item.id);
          return null;
        });
      }, 500);
    }
    if (team?.topics !== undefined) {
      setTimeout(() => {
        team.topics.map((item) => {
          topicsRef.current.setTopic(item.id);
          return null;
        });
      }, 500);
    }
  }, [topicsRef]);

  const {data} = useQuery(GET_TOPICS);
  const {experience} = route.params;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setTitle = useMemo(() => {
    switch (experience) {
      case 'event': {
        return (
          <>
            <TitleContainer>
              <TitleText>{EVENT_TOPIC_TITLE}</TitleText>
            </TitleContainer>
            <SubtitleText>{EVENT_TOPIC_SUBTITLE}</SubtitleText>
          </>
        );
      }
      case 'serie': {
        return (
          <>
            <TitleContainer>
              <TitleText>{SERIES_TOPIC_TITLE}</TitleText>
            </TitleContainer>
            <SubtitleText>{SERIES_TOPIC_SUBTITLE}</SubtitleText>
          </>
        );
      }
      case 'session': {
        return (
          <>
            <TitleContainer>
              <TitleText>{SESSION_TOPIC_TITLE}</TitleText>
            </TitleContainer>
            <SubtitleText>{SESSION_TOPIC_SUBTITLE}</SubtitleText>
          </>
        );
      }
      case 'team': {
        return (
          <>
            <TitleContainer>
              <TitleText>{TEAM_TOPIC_TITLE}</TitleText>
            </TitleContainer>
            <SubtitleText>{TEAM_TOPIC_SUBTITLE}</SubtitleText>
          </>
        );
      }
      default: {
        return <></>;
      }
    }
  }, [experience]);

  useEffect(() => {
    const topicsArray = topicsRef.current ? topicsRef.current.getTopics() : [];
    if (selectedTopics && topicsRef.current && selectedTopics.length > topicsRef.current.getTopics().length) {
      if (counterTopics > 0) {
        setCounterTopics(counterTopics - 1);
      }
    } else if (selectedTopics && topicsRef.current && selectedTopics.length < topicsRef.current.getTopics().length) {
      setCounterTopics(counterTopics + 1);
    } else {
      setCounterTopics(0);
    }
    setSelectedTopics(topicsArray);
  }, [counterTopics, selectedTopics]);

  const getTopicsObjects = (topics) => {
    const topicsSet = new Set(topics);
    return data.getTopics
      .filter(({id}) => topicsSet.has(id))
      .map(({icon, name}) => ({
        icon,
        name,
      }));
  };

  const goTo = (expe) => {
    const {params} = route;
    if (expe === 'serie') {
      return 'PreviewSeries';
    }
    if (expe === 'session') {
      return params?.invitedUsers ? 'CreateSessionScreen' : 'ShareSession';
    }
    if (expe === 'team') {
      return 'PreviewTeam';
    }
  };

  const submit = () => {
    // eslint-disable-next-line no-shadow
    const {params} = route;
    params.topics = topicsRef.current.getTopics();
    params.topicsObjects = getTopicsObjects(params.topics);
    navigation.navigate(goTo(params.experience), {
      sessionParams: params?.invitedUsers ? {sessionParams: params} : params,
    });
  };

  const topics = [];

  if (data) {
    // eslint-disable-next-line array-callback-return
    data.getTopics.map((i, index) => {
      topics[index] = {};
      topics[index].label = i.name;
      topics[index].id = i.id;
    });
  }

  return (
    <Wrapper>
      {setTitle}
      <TopicsCountText>{`${topicsRef.current?.getTopics().length || 0}/4`}</TopicsCountText>
      <ScrollView scrollEventThrottle={16}>
        <CheckboxForm
          setTopicCurrent={setTopicCurrent}
          ref={topicsRef}
          data={data}
          setDisableTopic={setDisableTopic}
          background_color={colors.blueBackgroundSession}
          textBoxColor={colors.white}
          disabledTouch={topicsRef.current && topicsRef.current.getTopics().length === 4}
        />
      </ScrollView>
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
          onPress={submit}
          flex
          title="Next"
          disabled={topicsRef.current === null || topicsRef.current.getTopics().length === 0}
        />
      </ButtonContainer>
    </Wrapper>
  );
};

export default withSafeArea(SelectTopicsSession);
