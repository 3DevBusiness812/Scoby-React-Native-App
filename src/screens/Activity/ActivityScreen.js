import React, {useEffect, useContext} from 'react';
import styled from 'styled-components/native';
import {INBOX_PLACEHOLDER_TEXT} from 'src/constants/Texts';
import {useMutation} from '@apollo/client';
import {FollowersContext} from 'src/containers/followers';
import {DELETE_COUNTER_ACTIVITY} from 'src/graphql/mutations/activity';
import colors from 'src/constants/Colors';
import withSafeArea from 'src/components/withSafeArea';
import Fonts from 'src/constants/Fonts';
import TopTap from 'src/navigation/activitiesTopTabs';
import {WriteMessage} from 'assets/svg';
import {ACTIVITY_KEYS} from './ActivityKeys';

const Wrapper = styled.View({
  flex: 1,
  marginHorizontal: 24,
  marginVertical: 30,
  backgroundColor: colors.blueBackgroundSession,
});

const Header = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: 5,
});

const TitleText = styled.Text({
  ...Fonts.avenir,
  fontSize: 25,
  color: colors.white,
  fontWeight: 'bold',
});

const WriteMessageBotton = styled.TouchableOpacity({
  width: 30,
  height: 30,
});

function ActivityScreen({navigation}) {
  const {setNotifications} = useContext(FollowersContext);

  const [deleteCounter] = useMutation(DELETE_COUNTER_ACTIVITY, {
    onCompleted() {
      setNotifications(0);
    },
  });

  useEffect(() => {
    const disableNotificationBottom = navigation.addListener('focus', () => {
      deleteCounter();
    });
    return disableNotificationBottom;
  }, [navigation, deleteCounter]);

  return (
    <Wrapper>
      <Header>
        <TitleText>{INBOX_PLACEHOLDER_TEXT}</TitleText>
        <WriteMessageBotton onPress={() => navigation.navigate(ACTIVITY_KEYS.NEW_MESSAGE)}>
          <WriteMessage />
        </WriteMessageBotton>
      </Header>
      <TopTap navigation={navigation} />
    </Wrapper>
  );
}

export default withSafeArea(ActivityScreen);
