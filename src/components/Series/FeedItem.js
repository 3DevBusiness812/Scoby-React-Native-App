import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Platform, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {Crowd, Invite, Serie, ShareSvg, MenuDotsGray} from 'assets/svg';
import Fonts from 'src/constants/Fonts';
import {
  SERIES_EMPTY_MEMBERS,
  SERIES_GO_LIVE,
  SERIES_MEMBERS_JOINED,
  SERIES_INVITE,
  SERIES_SHARE_CARD,
  SERIES_DELETE,
  SERIES_EDIT,
  SERIES_DELETE_CONFIRM,
  MODAL_NO,
  MODAL_YES,
} from 'src/constants/Texts';
import Colors from 'src/constants/Colors';
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import PromptModal from 'src/components/Modal/PromptModal';
import Badge from '../Badge';
import RegularButton from '../RegularButton';
import MenuOption from '../MenuOption';
import {getCurrentWeekDay, getCurrentWeekNumber} from 'src/utils/series';
import moment from 'moment';

const Container = styled.Pressable({
  width: '95%',
  backgroundColor: 'white',
  alignSelf: 'center',
  flexDirection: 'row',
  marginTop: 20,
  borderRadius: 6,
});

const Schedule = styled.View({
  width: 170,
  maxHeight: 300,
  position: 'absolute',
  backgroundColor: Colors.white,
  zIndex: 2000,
  marginVertical: 20,
  marginHorizontal: 10,
  borderRadius: 6,
});

const ScheduleText = styled.Text({
  ...Fonts.avenir,
  color: Colors.purple,
  fontSize: 11,
});

const ScheduleWrraper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 6,
});

const ScheduleTitle = styled.Text({
  ...Fonts.avenirBold,
  color: Colors.purple,
  fontSize: 13,
});

const ScheduleClose = styled.TouchableOpacity({
  width: '25%',
});

const ScheduleTitleWrraper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Arrow = styled.Text({...Fonts.avenirBold, color: Colors.white});

const Text = styled.Text({...Fonts.avenirSemiBold, color: Colors.white, fontSize: 12});

const InnerContainer = styled.View({
  width: '50%',
  flexDirection: 'column',
});

const TextBar = styled.View({
  marginVertical: 2,
  alignSelf: 'flex-start',
  width: '100%',
});

const Ring = styled.View({
  width: 100,
  height: 100,
  borderRadius: 100,
  borderWidth: 3,
  borderColor: '#8600B5',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 5,
});

const Avatar = styled.View({
  width: 85,
  height: 85,
  borderRadius: 45,
  overflow: 'hidden',
});

const AvatarImage = styled.Image({
  width: '100%',
  height: '100%',
  opacity: 1,
  resizeMode: 'cover',
});

const MemberContainer = styled.View({
  flexDirection: 'row',
});

const MemberAvatar = styled.View({
  width: 25,
  height: 25,
  borderRadius: 15,
  overflow: 'hidden',
  flexDirection: 'row',
});

const MainText = styled.Text({
  ...Fonts.avenirBold,
  color: '#484848',
  fontSize: 18,
});

const SecondaryText = styled.Text({
  ...Fonts.avenir,
  color: '#484848',
  fontSize: 18,
});

const MenuDivider = styled.View({
  borderTopColor: 'rgba(101, 54, 187, 0.1)',
  borderTopWidth: 0.5,
  width: '95%',
  alignSelf: 'center',
});

const DotsButton = styled.View({
  padding: 5,
  marginTop: 10,
  height: 30,
  width: 30,
});

const styles = StyleSheet.create({
  linearGradient: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    flex: 1,
  },
  daysText: {
    ...Fonts.avenirSemiBold,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  dateText: {
    ...Fonts.avenir,
    color: Colors.whiteText,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  barGradient: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  membersText: {
    ...Fonts.avenirSemiBold,
    fontSize: 15,
    color: 'white',
    paddingHorizontal: 5,
    paddingBottom: 2,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    textAlign: 'center',
    marginBottom: 4,
  },
  secondaryButton: {
    width: '50%',
    marginHorizontal: 5,
    marginBottom: 4,
    backgroundColor: '#F0E7EF4D',
    borderWidth: 0.5,
    borderColor: '#F0E7EF66',
    fontSize: 15,
    height: 35,
  },
  secondaryButtonText: {
    color: `${Colors.whiteText}E6`,
    ...Fonts.avenir,
  },
  topics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  icons: {
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  buttonsContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  menuText: {
    color: '#4A2098',
    fontSize: 15,
  },
});

const getBadgeNumber = (amount) => (amount <= 9 ? `+${amount}` : '+9');

const SpaceBetweenWrapper = styled.TouchableOpacity({flexDirection: 'row', justifyContent: 'space-between'});
const extractKey = (index) => `showSchedule-${Math.random() + index}`;

const FeedItem = ({series, handleDelete, handleEdit, handleOpen}) => {
  const {ownerUser, topics, members, description, title, newSeries, userType, id, landingView, schedule = []} = series;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const ownerUserAvatarUrl = ownerUser && ownerUser.avatar ? {uri: ownerUser.avatar} : avatarSrc;
  const name = ownerUser.fullName ? ownerUser.fullName : ownerUser.username;
  const [showSchedule, setShowSchedule] = useState(false);

  const getAvatar = () => {
    if (members.length === 1) {
      return (
        <MemberAvatar>
          <AvatarImage source={members[0].avatar ? {uri: members[0].avatar} : avatarSrc} />
        </MemberAvatar>
      );
    }
    if (members.length === 2) {
      return (
        <View style={{left: 10}}>
          <MemberAvatar style={{position: 'absolute', left: -20}}>
            <AvatarImage source={members[0].avatar ? {uri: members[0].avatar} : avatarSrc} />
          </MemberAvatar>
          <MemberAvatar>
            <AvatarImage source={members[1].avatar ? {uri: members[0].avatar} : avatarSrc} />
          </MemberAvatar>
        </View>
      );
    }

    return (
      <>
        <MemberAvatar style={{position: 'absolute', left: -20}}>
          <AvatarImage source={members[0].avatar ? {uri: members[0].avatar} : avatarSrc} />
        </MemberAvatar>
        <MemberAvatar>
          <AvatarImage source={members[1].avatar ? {uri: members[0].avatar} : avatarSrc} />
        </MemberAvatar>
        <Badge size={25} right={-20} text={getBadgeNumber(members.length - 2)} />
      </>
    );
  };

  const getMembers = () => {
    if (members.length > 0) {
      return (
        <View style={{paddingHorizontal: 10, alignItems: 'center', marginBottom: 15}}>
          <Text style={styles.membersText}>{SERIES_MEMBERS_JOINED}</Text>
          <MemberContainer>{getAvatar()}</MemberContainer>
        </View>
      );
    }

    return (
      <>
        <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
          <Text style={styles.membersText}>{SERIES_EMPTY_MEMBERS}</Text>
          <Crowd />
        </View>
        <View style={{height: 15, marginBottom: 15}} />
      </>
    );
  };

  const getTopics = () =>
    topics.map((topic) => (
      <View
        key={topic.name}
        style={{
          marginVertical: 4,
          marginRight: 6,
          borderRadius: 5,
          flexDirection: 'row',
          backgroundColor: '#6536BB80',
          justifyContent: 'center',
          alignItems: 'center',
          padding: Platform.OS === 'ios' ? 6 : 8,
        }}>
        <View>
          <Text>{topic.icon ? topic.icon : ''}</Text>
        </View>
        <Text
          style={{
            ...Fonts.avenirBold,
            paddingLeft: 8,
            fontSize: 14,
            color: '#6536BB',
          }}>
          {topic.name}
        </Text>
      </View>
    ));

  const sortDates = useCallback(() => {
    const sortSchedule = schedule.slice().sort((a, b) => {
      const firts = getCurrentWeekNumber(a.day);
      const second = getCurrentWeekNumber(b.day);

      if (firts > second) {
        return 1;
      }
      if (firts < second) {
        return -1;
      }
      return 0;
    });
    return sortSchedule;
  }, [schedule]);

  const setDate = useCallback(() => {
    const Today = sortDates().filter((item) => getCurrentWeekDay(Date.now()) === item.day)[0];
    if (Today) {
      return `${Today.day} ${moment(Today.start, 'HH:mm:ss').format('hh:mm a')} & ${moment(
        Today.end,
        'HH:mm:ss',
      ).format('hh:mm a')}`;
    }
    return sortDates()[0]
      ? `${sortDates()[0].day} ${moment(sortDates()[0].start, 'HH:mm:ss').format('hh:mm a')} & ${moment(
          sortDates()[0].end,
          'HH:mm:ss',
        ).format('hh:mm a')}`
      : 'No dates';
  }, []);

  const RenderSchedule = useCallback(
    (item) => (
      <ScheduleWrraper>
        <ScheduleText>{item.item.day}</ScheduleText>
        <ScheduleText>{moment(item.item.start, 'HH:mm:ss').format('hh:mm a')}</ScheduleText>
        <ScheduleText>{`&`}</ScheduleText>
        <ScheduleText>{moment(item.item.end, 'HH:mm:ss').format('hh:mm a')}</ScheduleText>
      </ScheduleWrraper>
    ),
    [schedule],
  );

  const RenderHeaderSchedule = useCallback(() => (
    <ScheduleTitleWrraper>
      <ScheduleClose onPress={() => setShowSchedule(false)}>
        <ScheduleTitle>{`<`}</ScheduleTitle>
      </ScheduleClose>
      <ScheduleTitle>Schedule</ScheduleTitle>
    </ScheduleTitleWrraper>
  ));

  return (
    <Container
      style={({pressed}) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      disabled={newSeries || landingView}
      onPress={() => handleOpen(series)}>
      {showSchedule && (
        <Schedule>
          <FlatList
            ListHeaderComponent={RenderHeaderSchedule}
            data={sortDates()}
            renderItem={RenderSchedule}
            keyExtractor={extractKey}
            style={{paddingHorizontal: 10, paddingVertical: 20, height: '90%'}}
            ListFooterComponent={<ScheduleWrraper></ScheduleWrraper>}
          />
        </Schedule>
      )}
      <PromptModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        text={SERIES_DELETE_CONFIRM}
        leftButtonText={MODAL_YES}
        rightButtonText={MODAL_NO}
        onLeftButtonPress={() => {
          setIsModalVisible(false);
          handleDelete(id);
        }}
        onRightButtonPress={() => {
          setIsModalVisible(false);
        }}
      />
      <InnerContainer>
        <LinearGradient colors={['#BEEF00', '#03CCD9']} end={{x: 0.7, y: 1.0}} style={styles.linearGradient}>
          <View style={{marginTop: 20, marginBottom: 25, paddingRight: 10}}>
            <TextBar>
              <LinearGradient
                end={{x: 1, y: 1.0}}
                colors={[Colors.translucentGrey, Colors.translucentWhite]}
                style={styles.barGradient}>
                <SpaceBetweenWrapper onPress={() => setShowSchedule(true)}>
                  <Text>{setDate()}</Text>
                  <Arrow>{`>`}</Arrow>
                </SpaceBetweenWrapper>
              </LinearGradient>
            </TextBar>
          </View>
          <View style={{alignItems: 'center'}}>
            <Ring>
              <Avatar>
                <AvatarImage source={ownerUserAvatarUrl} />
              </Avatar>
            </Ring>
            {!newSeries ? getMembers() : <View style={{marginTop: 30}} />}
            <View style={styles.buttonsContainer}>
              <RegularButton
                disabled={newSeries}
                title={SERIES_INVITE}
                style={[styles.button, styles.secondaryButton]}
                large
                numberOfLines={1}
                textStyle={styles.secondaryButtonText}>
                <Invite style={styles.icons} />
              </RegularButton>
              <RegularButton
                disabled={newSeries}
                title={SERIES_SHARE_CARD}
                style={[styles.button, styles.secondaryButton]}
                large
                numberOfLines={1}
                textStyle={styles.secondaryButtonText}>
                <ShareSvg style={styles.icons} />
              </RegularButton>
            </View>
            {!newSeries && (
              <RegularButton
                title={SERIES_GO_LIVE}
                style={[styles.button, {marginBottom: 10}]}
                large
                numberOfLines={1}
                textStyle={{...Fonts.avenirBold}}
              />
            )}
          </View>
        </LinearGradient>
      </InnerContainer>
      <InnerContainer style={{paddingHorizontal: 15, flexDirection: 'column', height: '100%'}}>
        {userType === 'owner' && landingView ? (
          <View style={{justifyContent: 'space-between', marginTop: 5, flexDirection: 'row'}}>
            <Serie style={{width: 40, height: 40}} />
            <Menu>
              <MenuTrigger>
                <DotsButton>
                  <MenuDotsGray />
                </DotsButton>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption label={SERIES_EDIT} onClick={() => handleEdit(series)} />
                <MenuDivider />
                <MenuOption label={SERIES_DELETE} onClick={() => setIsModalVisible(true)} />
              </MenuOptions>
            </Menu>
          </View>
        ) : (
          <View style={{alignItems: 'flex-end', marginTop: 5}}>
            <Serie style={{width: 40, height: 40}} />
          </View>
        )}
        <MainText style={{marginBottom: 10}}>
          {title}
          <SecondaryText> with {name}</SecondaryText>
        </MainText>
        <SecondaryText style={{marginTop: 5, fontSize: 16}}>{description}</SecondaryText>
        <View style={{justifyContent: 'flex-end', minHeight: 200, paddingBottom: 10}}>
          <View style={[styles.topics]}>{getTopics()}</View>
        </View>
      </InnerContainer>
    </Container>
  );
};

export default FeedItem;
