import React, {useCallback} from 'react';
import styled from 'styled-components';
import {OTSession, OTPublisher, OTSubscriber, OTSubscriberView} from 'opentok-react-native';
import Share from 'react-native-share';
import {ThreeDotsMenu, PcSmartphone} from 'assets/svg';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

const Container = styled.View({
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const FullView = styled(OTSubscriberView)(({isSubscriber = true}) => ({
  width: '100%',
  height: '100%',
  marginTop: isSubscriber ? 0 : -45,
  zIndex: -1000,
}));

const PublisherWindow = styled(OTPublisher)(() => ({
  width: '100%',
  height: '100%',
}));

const subscriberProperties = {
  subscribeToAudio: true,
  subscribeToVideo: true,
  subscribeToSelf: false,
};

const ScreenCameraView = styled.View(({width, height}) => ({
  width,
  height,
}));

const Dots = styled.TouchableOpacity(({topPosition = 0}) => ({
  alignItems: 'flex-end',
  marginRight: 20,
  padding: 20,
  marginTop: topPosition,
}));

const circleSize = 50;

const CircleButton = styled.TouchableOpacity({
  position: 'absolute',
  top: 60,
  right: 5,
  width: circleSize,
  height: circleSize,
  borderRadius: circleSize / 2,
  backgroundColor: '#CD068E99',
  justifyContent: 'center',
  alignItems: 'center',
});

const UserDetails = styled.View(({marginName}) => ({
  width: '100%',
  height: 80,
  alignItems: 'flex-start',
  marginTop: marginName,
  zIndex: 1000,
}));

const UserDetailsContainer = styled.View({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  paddingVertical: 5,
  paddingHorizontal: 10,
  alignItems: 'center',
  justifyContent: 'center',
});

const UserDetailsText = styled.Text({
  ...Fonts.avenir,
  color: Colors.white,
  fontSize: 14,
});

function MenuDots({openModal, participantsListID, setDotMenuUserId, top = 0}) {
  return (
    <Dots
      topPosition={top}
      onPress={() => {
        setDotMenuUserId(participantsListID);
        openModal();
      }}>
      <ThreeDotsMenu />
    </Dots>
  );
}

//! isSubscriber? index === 0 ? '-60%' : '-65%': index === 0 ?'-35%':'-65%'

const setMarginForThree = (index, isSubscriber) => {
  if (!isSubscriber) {
    if (index === 0) {
      return '-60%';
    }
    return '-65%';
  }
  if (index === 0) {
    return '-35%';
  }
  return '-65%';
};

function Subscribers({
  subscribers,
  isGuest,
  openModal,
  isSubscriber,
  participantsListID,
  setDotMenuUserId,
  participantsList,
  user,
}) {
  const ListWithoutMe = participantsList.filter((current) => current.username !== user.username);

  if (subscribers.length === 0) {
    return null;
  }

  if (subscribers.length === 1 && isGuest) {
    return (
      <ScreenCameraView width="100%" height="100%" key={subscribers[0]}>
        <FullView streamId={subscribers[0]} key={subscribers[0]} isSubscriber={isSubscriber} />
        <UserDetails marginName="-35%">
          <UserDetailsContainer>
            <UserDetailsText>{ListWithoutMe[0]?.fullName}</UserDetailsText>
            <UserDetailsText>@{ListWithoutMe[0]?.username}</UserDetailsText>
          </UserDetailsContainer>
        </UserDetails>
      </ScreenCameraView>
    );
  }

  if (subscribers.length === 1 && !isGuest) {
    return (
      <ScreenCameraView width="100%" height="50%">
        {!isSubscriber && (
          <MenuDots
            openModal={openModal}
            participantsListID={participantsListID[0]}
            setDotMenuUserId={setDotMenuUserId}
          />
        )}
        <FullView isSubscriber={isSubscriber} streamId={subscribers[0]} key={subscribers[0]} />
        <UserDetails marginName={!isSubscriber ? '-35%' : '-35%'}>
          <UserDetailsContainer>
            <UserDetailsText>{ListWithoutMe[0]?.fullName}</UserDetailsText>
            <UserDetailsText>@{ListWithoutMe[0]?.username}</UserDetailsText>
          </UserDetailsContainer>
        </UserDetails>
      </ScreenCameraView>
    );
  }

  if (subscribers.length === 2 && isGuest) {
    return subscribers.map((s, index) => (
      <ScreenCameraView width="100%" height="50%" key={`${subscribers[index]}-${Math.random()}`}>
        <FullView isSubscriber={isSubscriber} streamId={s} key={s} />
        <UserDetails marginName={index === 1 ? '-35%' : '-20%'}>
          <UserDetailsContainer>
            <UserDetailsText>{ListWithoutMe[index]?.fullName}</UserDetailsText>
            <UserDetailsText>@{ListWithoutMe[index]?.username}</UserDetailsText>
          </UserDetailsContainer>
        </UserDetails>
      </ScreenCameraView>
    ));
  }

  if (subscribers.length === 2 && !isGuest) {
    return subscribers.map((s, index) => (
      <ScreenCameraView width="50%" height="50%" key={subscribers[index]}>
        {!isSubscriber && (
          <MenuDots
            openModal={openModal}
            participantsListID={participantsListID[index]}
            setDotMenuUserId={setDotMenuUserId}
          />
        )}
        <FullView isSubscriber={isSubscriber} streamId={s} />
        <UserDetails marginName={!isSubscriber ? '-70%' : '-65%'}>
          <UserDetailsContainer>
            <UserDetailsText>{ListWithoutMe[index]?.fullName}</UserDetailsText>
            <UserDetailsText>@{ListWithoutMe[index]?.username}</UserDetailsText>
          </UserDetailsContainer>
        </UserDetails>
      </ScreenCameraView>
    ));
  }

  if (subscribers.length === 3 && isGuest) {
    return (
      <>
        <ScreenCameraView width="100%" height="50%">
          <FullView streamId={subscribers[0]} isSubscriber={isSubscriber} />
          <UserDetails marginName="-20%">
            <UserDetailsContainer>
              <UserDetailsText>{ListWithoutMe[0]?.fullName}</UserDetailsText>
              <UserDetailsText>@{ListWithoutMe[0]?.username}</UserDetailsText>
            </UserDetailsContainer>
          </UserDetails>
        </ScreenCameraView>
        <ScreenCameraView width="50%" height="50%">
          <FullView streamId={subscribers[1]} isSubscriber={isSubscriber} />
          <UserDetails marginName="-65%">
            <UserDetailsContainer>
              <UserDetailsText>{ListWithoutMe[1]?.fullName}</UserDetailsText>
              <UserDetailsText>@{ListWithoutMe[1]?.username}</UserDetailsText>
            </UserDetailsContainer>
          </UserDetails>
        </ScreenCameraView>
        <ScreenCameraView width="50%" height="50%">
          <FullView streamId={subscribers[2]} isSubscriber={isSubscriber} />
          <UserDetails marginName="-65%">
            <UserDetailsContainer>
              <UserDetailsText>{ListWithoutMe[2]?.fullName}</UserDetailsText>
              <UserDetailsText>@{ListWithoutMe[2]?.username}</UserDetailsText>
            </UserDetailsContainer>
          </UserDetails>
        </ScreenCameraView>
      </>
    );
  }

  if (subscribers.length === 3 && !isGuest) {
    return subscribers.map((s, index) => (
      <ScreenCameraView width="50%" height="50%" key={subscribers[index]}>
        {!isSubscriber && (
          <MenuDots
            top={index === 0 ? 50 : 0}
            openModal={openModal}
            participantsListID={participantsListID[index]}
            setDotMenuUserId={setDotMenuUserId}
          />
        )}
        <FullView isSubscriber={isSubscriber} streamId={s} />
        <UserDetails marginName={setMarginForThree(index, isSubscriber)}>
          <UserDetailsContainer>
            <UserDetailsText>{ListWithoutMe[index]?.fullName}</UserDetailsText>
            <UserDetailsText>@{ListWithoutMe[index]?.username}</UserDetailsText>
          </UserDetailsContainer>
        </UserDetails>
      </ScreenCameraView>
    ));
  }

  return subscribers.map((s, index) => (
    <ScreenCameraView width="50%" height="50%" key={subscribers[index]}>
      <FullView isSubscriber={isSubscriber} streamId={s} />
      <UserDetails marginName={index < 2 ? '-35%' : '-65%'}>
        <UserDetailsContainer>
          <UserDetailsText>{ListWithoutMe[index]?.fullName}</UserDetailsText>
          <UserDetailsText>@{ListWithoutMe[index]?.username}</UserDetailsText>
        </UserDetailsContainer>
      </UserDetails>
    </ScreenCameraView>
  ));
}

export default function LiveVisor({
  apiKey,
  token,
  sessionId,
  isGuest,
  signal,
  sessionEventHandlers,
  publisherEventHandlers,
  publisherProperties,
  subscriberEventHandlers,
  streamProperties,
  openMenuDots,
  isSubscriber,
  setDotMenuUserId,
  participantsListID,
  secondScreenLink,
  participantsList,
  user,
}) {
  const streamsCount = Object.keys(streamProperties).length + 1;
  const windowHeight = streamsCount > 1 ? '50%' : '100%';
  const windowWidth = streamsCount > 3 ? '50%' : '100%';

  const shareSecondScreenLink = useCallback(() => {
    const url = secondScreenLink;
    Share.open({
      url,
    });
  }, [secondScreenLink]);

  return (
    <OTSession
      apiKey={apiKey}
      sessionId={sessionId}
      token={token}
      eventHandlers={sessionEventHandlers}
      signal={signal}
      audioTrack
      videoTrack>
      <Container>
        {!isGuest && (
          <ScreenCameraView width={windowWidth} height={windowHeight}>
            <PublisherWindow
              eventHandlers={publisherEventHandlers}
              count={streamsCount}
              properties={publisherProperties}
            />
            {secondScreenLink !== '' && (
              <CircleButton onPress={shareSecondScreenLink}>
                <PcSmartphone />
              </CircleButton>
            )}
            <UserDetails marginName={streamsCount > 1 && streamsCount < 4 ? '-17%' : '-35%'}>
              <UserDetailsContainer>
                <UserDetailsText>{user.fullName}</UserDetailsText>
                <UserDetailsText>@{user.username}</UserDetailsText>
              </UserDetailsContainer>
            </UserDetails>
          </ScreenCameraView>
        )}
        <OTSubscriber
          properties={subscriberProperties}
          eventHandlers={subscriberEventHandlers}
          streamProperties={streamProperties}>
          {(people) => (
            <Subscribers
              user={user}
              subscribers={people}
              isSubscriber={isSubscriber}
              openModal={openMenuDots}
              isGuest={isGuest}
              participantsListID={participantsListID}
              setDotMenuUserId={setDotMenuUserId}
              participantsList={participantsList}
            />
          )}
        </OTSubscriber>
      </Container>
    </OTSession>
  );
}
