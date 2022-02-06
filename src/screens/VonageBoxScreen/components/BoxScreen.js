import React, {useState, useRef, useCallback, useMemo, useContext, useEffect} from 'react';
import {Alert, BackHandler, AppState} from 'react-native';
import styled from 'styled-components/native';
import {useQuery, useMutation} from '@apollo/client';
import KeepAwake from 'react-native-keep-awake';
import {SHARE_SESSION_IN_SESSION, END_SESSION, LEAVE_SESSION, VIEW_SESSION} from 'src/graphql/mutations/session';
import {GET_LIVE_SESSION} from 'src/graphql/queries/session';
import {
  UNKNOWN_ERROR_TEXT_SHORT,
  SESSION_CONNECTION_ERROR,
  RECONNECT_TO_SESSION,
  DISCONNECT_FROM_SESSION,
  STAY_IN_SESSION,
} from 'src/constants/Texts';
import colors from 'src/constants/Colors';
import LoadingSession from 'src/components/LoadingSession';
import {FollowersContext} from 'src/containers/followers';
import {statusBarHeight} from 'src/components/withSafeArea';
import LeaveModal from './modals/LeaveModal';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import MenuModal from './modals/MenuModal';
import GreenRoomModal from './modals/GreenRoomModal';
import ChatModal from './modals/ChatModal';
import ShareModal from './modals/ShareModal';
import ViewersModal from './modals/ViewersModal';
import LiveVisor from './LiveVisor';
import MenuDotsModal from './modals/MenuDotsModal';

const Wrapper = styled.View({
  flex: 1,
  paddingTop: statusBarHeight,
  backgroundColor: colors.blueBackgroundSession,
});

const Main = styled.View({
  width: '100%',
  height: '100%',
  backgroundColor: colors.greySession,
});

const BoxScreen = (props) => {
  const appState = useRef(AppState.currentState);
  const {navigation} = props;
  const apiKey = props.session.vonageApiToken;
  const {sessionBackEndId, sessionId, username, enableMic, enableCam, frontCam, isSubscriber, secondScreenLink} =
    props.session;
  const [isGuest, setIsGuest] = useState(props.isGuest);
  const [token, setToken] = useState(props.session.token);
  const [audioEnabled, setAudioEnabled] = useState(enableMic);
  const [audioEnabledPrevious, setAudioEnabledPrevious] = useState(enableMic);
  const [videoEnabled, setVideoEnabled] = useState(enableCam);
  const [videoEnabledPrevious, setVideoEnabledPrevious] = useState(enableCam);
  const [useFrontCamera, setUseFrontCamera] = useState(frontCam);
  const [streamProperties, setStreamProperties] = useState({});
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [showAllViewers, setShowAllViewers] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [greenRoomModal, setGreenRoomModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [messagesChat, setMessagesChat] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [signal, setSignal] = useState({});
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const {currentUserProfile} = useContext(FollowersContext);
  const [shouldReconnect, setShouldReconnect] = useState(false);
  const [retries, setRetries] = useState(0);
  const [session, setSession] = useState({id: null, viewerUsers: [], participantUsers: []});
  const sessionRef = useRef();
  const [menuDotsVisible, setMenuDotsVisible] = useState(false);
  const [dotsMenuUserId, setDotsMenuUserId] = useState();

  const {data} = useQuery(GET_LIVE_SESSION, {
    pollInterval: 1000,
    variables: {
      sessionId: sessionBackEndId,
    },
  });

  const publisherProperties = useMemo(
    () => ({
      cameraPosition: useFrontCamera ? 'front' : 'back',
      publishVideo: videoEnabled,
      publishAudio: audioEnabled,
      videoSource: 'camera',
      name: username,
    }),
    [audioEnabled, useFrontCamera, username, videoEnabled],
  );

  const participantsList = useMemo(() => {
    let result = session.id ? [...session.participantUsers] : [];
    // result = result.sort((a, b) => (a.id > b.id ? 1 : -1));
    if (session.ownerUser) {
      result = [session.ownerUser, ...result];
    }
    return result;
  }, [session.id, session.participantUsers, session.ownerUser]);

  const participantsListID = useMemo(() => {
    const IDList = [];
    session.participantUsers.map((user) => IDList.push(user.id));
    return IDList;
  }, [session.participantUsers]);

  const followersList = useMemo(
    () => ({
      data: props.session.followersList ? props.session.followersList : props.session.followers,
    }),
    [props.session.followers, props.session.followersList],
  );

  const navigateHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: 'MainTabs', screen: 'Home'}],
    });
  }, [navigation]);

  const navigateFinishSession = useCallback(() => {
    navigation.replace('FinishSession', {
      params: {
        participants: participantsList,
        hostName: username,
        sessionName: props.session.title,
      },
    });
  }, [navigation, participantsList, props.session.title, username]);

  const handleReconnect = useCallback(() => {
    navigation.replace('JoinSession', {
      params: {
        id: props.session.sessionBackEndId,
        vonageSessionId: props.session.sessionId,
        sessionName: props.session.title,
        sessionDescription: props.session.description,
        hostName: props.session.username,
        userId: currentUserProfile.id,
        followers: followersList,
      },
    });
  }, [
    currentUserProfile.id,
    followersList,
    navigation,
    props.session.description,
    props.session.sessionBackEndId,
    props.session.sessionId,
    props.session.title,
    props.session.username,
  ]);

  const [endSession] = useMutation(END_SESSION, {
    onCompleted: navigateHome,
    onError: navigateHome,
  });

  const [shareSession] = useMutation(SHARE_SESSION_IN_SESSION);

  const [leaveSession] = useMutation(LEAVE_SESSION, {
    variables: {
      sessionId: sessionBackEndId,
      userId: currentUserProfile.id,
      currentUserId: currentUserProfile.id,
    },
    onCompleted: navigateFinishSession,
    onError: navigateFinishSession,
  });

  const [leaveStage] = useMutation(VIEW_SESSION, {
    onCompleted({...v}) {
      setIsGuest(true);
      setToken(v.viewSession.vonageUserToken);
    },
    onError: navigateFinishSession,
  });

  const [moveToViwerList] = useMutation(VIEW_SESSION);

  const sendInvitations = useCallback(
    (usersToInvite) => {
      setShareModal(!shareModal);
      shareSession({
        variables: {
          sessionId: sessionBackEndId,
          userIds: usersToInvite,
          notifyMyFollowers: true,
        },
      });
    },
    [sessionBackEndId, shareModal, shareSession],
  );

  const toggleCamera = useCallback(() => {
    setUseFrontCamera(!useFrontCamera);
  }, [useFrontCamera]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(!audioEnabled);
  }, [audioEnabled]);

  const toggleVideo = useCallback(() => {
    setVideoEnabled(!videoEnabled);
  }, [videoEnabled]);

  const sendMessage = useCallback(
    (text) => {
      setSignal({
        type: currentUserProfile.username,
        data: text,
      });
    },
    [currentUserProfile],
  );

  const handleMoveToViewerList = useCallback(() => {
    const userFound = participantsList.find((user) => user.id === dotsMenuUserId);
    if (userFound) {
      moveToViwerList({
        variables: {
          id: sessionBackEndId,
          userId: dotsMenuUserId,
          currentUserId: dotsMenuUserId,
        },
      });
    }
  }, [dotsMenuUserId, leaveStage, participantsListID, sessionBackEndId]);

  const handleLeaveStage = useCallback(() => {
    const userFound = participantsList.find((user) => user.id === currentUserProfile.id);
    if (userFound) {
      leaveStage({
        variables: {
          id: sessionBackEndId,
          userId: currentUserProfile.id,
          currentUserId: currentUserProfile.id,
        },
      });
    }
  }, [currentUserProfile, leaveStage, participantsList, sessionBackEndId]);

  const handleFinishSession = useCallback(() => {
    endSession({
      variables: {
        sessionId: sessionBackEndId,
        userId: currentUserProfile.id,
        currentUserId: currentUserProfile.id,
      },
    });
  }, [currentUserProfile, endSession, sessionBackEndId]);

  const handleLeave = useCallback(() => {
    setLeaveModalVisible(false);
    KeepAwake.deactivate();
    if (!isSubscriber) {
      handleFinishSession();
    } else if (!isGuest) {
      handleLeaveStage();
    } else {
      leaveSession();
    }
  }, [handleFinishSession, handleLeaveStage, isGuest, isSubscriber, leaveSession]);

  const openLeaveModal = useCallback(() => {
    setLeaveModalVisible(true);
  }, []);

  const closeLeaveModal = useCallback(() => {
    setLeaveModalVisible(false);
  }, []);

  const openMenuDotsModal = useCallback(() => {
    setMenuDotsVisible(true);
  }, []);

  const closeMenuDotsModal = useCallback(() => {
    setMenuDotsVisible(false);
  }, []);

  const openGreenRoomModal = useCallback(() => {
    setGreenRoomModal(true);
  }, []);

  const closeGreenRoomModal = useCallback(() => {
    setGreenRoomModal(false);
  }, []);

  const openMenuModal = useCallback(() => {
    setMenuModalVisible(true);
  }, []);

  const closeMenuModal = useCallback(() => {
    setMenuModalVisible(false);
  }, []);

  const openChatModal = useCallback(() => {
    setShowChat(true);
  }, []);

  const closeChatModal = useCallback(() => {
    setShowChat(false);
    setUnreadMessages(0);
  }, []);

  const openShareModal = useCallback(() => {
    setShareModal(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setShareModal(false);
  }, []);

  const openViewersModal = useCallback(() => {
    setShowAllViewers(true);
  }, []);

  const closeViewersModal = useCallback(() => {
    setShowAllViewers(false);
  }, []);

  const handleInvite = useCallback(() => {
    setShowAllViewers(false);
    setShareModal(true);
  }, []);

  const handleBackPress = useCallback(() => {
    if (isSubscriber && (loading || connecting)) {
      leaveSession();
    }

    if (!isSubscriber || (isSubscriber && !loading && !connecting)) {
      setLeaveModalVisible(true);
    }

    return true;
  }, [isSubscriber, loading, connecting, leaveSession]);

  const handleConnectionLost = useCallback(() => {
    const options = [
      {
        text: RECONNECT_TO_SESSION,
        onPress: handleReconnect,
      },
      {
        text: STAY_IN_SESSION,
      },
      {
        text: DISCONNECT_FROM_SESSION,
        onPress: handleLeave,
      },
    ];

    Alert.alert(UNKNOWN_ERROR_TEXT_SHORT, SESSION_CONNECTION_ERROR, options);
  }, [handleLeave, handleReconnect]);

  /* Begin session event handlers */
  const sessionEventHandlers = useMemo(
    () => ({
      streamCreated(event) {
        setStreamProperties((previousStreamProperties) => ({
          ...previousStreamProperties,
          [event.streamId]: {
            subscribeToAudio: true,
            subscribeToVideo: true,
          },
        }));
      },
      streamDestroyed(event) {
        setStreamProperties((previousStreamProperties) => {
          const newStreamProperties = {...previousStreamProperties};
          delete newStreamProperties[event.streamId];
          return newStreamProperties;
        });
      },
      signal(event) {
        if (event.data && sessionRef) {
          setMessagesChat((previousMessagesChat) =>
            previousMessagesChat.concat([{username: `${event.type}`, text: `${event.data}`}]),
          );
          if (!showChat) {
            setUnreadMessages((prev) => prev + 1);
          }
        }
      },
    }),
    [],
  );

  const publisherEventHandlers = useMemo(
    () => ({
      streamCreated() {
        setConnecting(false);
        setLoading(false);
      },
    }),
    [],
  );

  const subscriberEventHandlers = useMemo(
    () => ({
      videoDataReceived() {
        setConnecting(false);
        setLoading(false);
      },
    }),
    [],
  );
  /* End session event handlers */

  const handleAppStateChange = useCallback(
    (nextAppState) => {
      if (nextAppState === 'active' && shouldReconnect) {
        setShouldReconnect(false);
        setVideoEnabled(videoEnabledPrevious);
        setAudioEnabled(audioEnabledPrevious);
      } else if (!shouldReconnect && appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        setShouldReconnect(true);
        setVideoEnabledPrevious(videoEnabled);
        setAudioEnabledPrevious(audioEnabled);
        setVideoEnabled(false);
        setAudioEnabled(false);
      }
    },
    [audioEnabled, audioEnabledPrevious, shouldReconnect, videoEnabled, videoEnabledPrevious],
  );

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [handleAppStateChange]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleBackPress]);

  useEffect(() => {
    if (session.id === null && data?.getSession) {
      setSession(data.getSession);
      setLoading(false);
      setConnecting(true);
    } else if (data?.getSession) {
      setSession(data.getSession);
    }
  }, [data, session.id]);

  useEffect(() => {
    if (isSubscriber) {
      setIsGuest(!participantsList.find((user) => user.id === currentUserProfile.id));
    }
  }, [currentUserProfile.id, isSubscriber, participantsList]);

  useEffect(() => {
    if (session.finishedAt && isSubscriber) {
      handleLeave();
    }
  }, [handleLeave, isSubscriber, session.finishedAt]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!loading && !connecting && Object.keys(streamProperties).length === 0 && isSubscriber) {
        setRetries(retries + 1);
        handleConnectionLost();
      }
    }, 5000);

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [connecting, handleConnectionLost, isSubscriber, loading, retries, streamProperties]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (connecting || loading) {
        setRetries(retries + 1);
        handleConnectionLost();
      }
    }, 15000);

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [connecting, handleConnectionLost, isGuest, loading, streamProperties, retries]);

  useEffect(() => {
    KeepAwake.activate();
  }, []);

  return (
    <Wrapper>
      <LoadingSession
        loading={loading}
        connecting={connecting}
        title={props.session.title}
        username={props.session.username}
        onBackPress={handleBackPress}
        isSubscriber={isSubscriber}
      />
      <Main>
        <TopBar
          isSubscriber={isSubscriber}
          isGuest={isGuest}
          viewersCount={session.viewers}
          onLeave={openLeaveModal}
          title={props.session.title}
          username={props.session.username}
        />
        {sessionId && (
          <LiveVisor
            apiKey={apiKey}
            token={token}
            sessionId={sessionId}
            isGuest={isGuest}
            signal={signal}
            sessionEventHandlers={sessionEventHandlers}
            publisherEventHandlers={publisherEventHandlers}
            publisherProperties={publisherProperties}
            subscriberEventHandlers={subscriberEventHandlers}
            streamProperties={streamProperties}
            user={currentUserProfile}
            openMenuDots={openMenuDotsModal}
            isSubscriber={isSubscriber}
            participantsListID={participantsListID}
            setDotMenuUserId={setDotsMenuUserId}
            secondScreenLink={secondScreenLink}
            participantsList={participantsList}
          />
        )}
        <LeaveModal
          visible={leaveModalVisible}
          onLeave={handleLeave}
          onRequestClose={closeLeaveModal}
          isGuest={isGuest}
          isUserOwner={!isSubscriber}
        />
        <MenuModal
          visible={menuModalVisible}
          onRequestClose={closeMenuModal}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          onAudioToggle={toggleAudio}
          onVideoToggle={toggleVideo}
          onCameraToggle={toggleCamera}
        />
        <ShareModal
          visible={shareModal}
          onRequestClose={closeShareModal}
          followersList={followersList}
          selectedFollowers={selectedFollowers}
          setSelectedFollowers={setSelectedFollowers}
          sendInvitations={sendInvitations}
        />
        <GreenRoomModal
          visible={greenRoomModal}
          onRequestClose={closeGreenRoomModal}
          isUserOwner={!isSubscriber}
          participantsList={participantsList}
          greenRoomUsers={session.greenRoomUsers}
          userID={currentUserProfile.id}
          sessionID={sessionBackEndId}
          viewerUsers={session.viewerUsers}
        />
        <ViewersModal
          visible={showAllViewers}
          onRequestClose={closeViewersModal}
          viewerUsers={session.viewerUsers}
          onInvite={handleInvite}
        />
        <ChatModal
          visible={showChat}
          onRequestClose={closeChatModal}
          messagesChat={messagesChat}
          sendMessage={sendMessage}
        />
        <MenuDotsModal
          visible={menuDotsVisible}
          onRequestClose={closeMenuDotsModal}
          handleMoveToViewerList={handleMoveToViewerList}
          closeMenuDotsModal={closeMenuDotsModal}
        />
        <BottomBar
          onGreenRoomTouch={openGreenRoomModal}
          onGreenRoomWaiting={session.greenRoomUsers?.length}
          onShareTouch={openShareModal}
          onViewersTouch={openViewersModal}
          onChatTouch={openChatModal}
          unreadMessages={unreadMessages}
          onMenuTouch={openMenuModal}
          isSessionOwner={!isGuest}
          secondScreenLink={secondScreenLink}
        />
      </Main>
    </Wrapper>
  );
};

export default BoxScreen;
