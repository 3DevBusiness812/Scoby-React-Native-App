import React, {useState, useRef, useContext, useEffect} from 'react';
import {StyleSheet, View, Alert, Text} from 'react-native';
import Camera from 'src/components/Camera';
import {CongratsIco} from 'assets/svg';
import {useMutation, useQuery} from '@apollo/client';
import {CREATE_SESSION} from 'src/graphql/mutations/session';
import Colors from 'src/constants/Colors';
import {TITLE_SESSION, UNKNOWN_ERROR_TEXT} from 'src/constants/Texts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import withSafeArea from 'src/components/withSafeArea';
import NewLargeButton from 'src/components/NewLargeButton';
import styled from 'styled-components';
import Fonts from 'src/constants/Fonts';
import {CREATE_SESSION_SERIES} from 'src/graphql/mutations/series';
import {GET_FOLLOWERS} from 'src/graphql/queries/followers';
import {FollowersContext} from 'src/containers/followers';
import {requestCameraPermission, requestMicrophonePermission} from 'src/utils/permission/allPermission';

const TopBar = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: Colors.translucentBlack,
  opacity: 0.9,
});

const Username = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  color: Colors.white,
  paddingLeft: 24,
});

const Controls = styled.View({
  flexDirection: 'row',
});

const GoLive = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const GoLiveIcon = styled.View({
  position: 'absolute',
  right: -24,
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.blueBackgroundSession,
  },
  text: {
    ...Fonts.avenirSemiBold,
    fontSize: 18,
    color: Colors.white,
  },
  textHost: {
    ...Fonts.avenirBold,
    fontSize: 16,
    color: Colors.white,
  },
  headContainer: {
    flex: 0,
    alignItems: 'center',
    paddingVertical: 24,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: `${Colors.violetColor}`,
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
    paddingHorizontal: 16,
  },
  textStyle: {
    ...Fonts.avenirBold,
    fontSize: 14,
    color: Colors.white,
  },
  nameStyle: {
    padding: 16,
  },
  iconEndCallStyle: {
    padding: 8,
  },
  iconMicStyle: {
    padding: 8,
  },
  iconRotateStyle: {
    padding: 8,
  },
  button: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
  },
});

const CreateSessionScreen = ({navigation, route}) => {
  const {currentUserProfile} = useContext(FollowersContext);
  const paramsRoutes = route.params?.sessionParams?.sessionParams;
  const {id: seriesId} = route.params.sessionParams;
  const [enableCam, setEnableCam] = useState(true);
  const [enableMic, setEnableMic] = useState(true);
  const [frontCam, setFrontCam] = useState(true);
  const [loading, setLoading] = useState(false);
  const rnCamera = useRef(null);

  const {data: {getFollowerUsers} = {getFollowerUsers: {data: []}}} = useQuery(GET_FOLLOWERS, {
    variables: {
      paging: {
        limit: 100,
        page: 1,
      },
      userId: currentUserProfile.id,
    },
  });

  const getParamSession = (v, type) => {
    const paramsSession = {
      sessionId: v[type].session.vonageSessionToken,
      token: v[type].token,
      vonageApiToken: v[type].vonageApiToken,
      username: v[type].session.ownerUser.username,
      description: v[type].session.description,
      title: v[type].session.title,
      isSubscriber: false,
      isUserOwner: true,
      enableMic,
      enableCam,
      frontCam,
      followersList: paramsRoutes?.followersList || getFollowerUsers.data,
      followers: paramsRoutes?.followers || [],
      sessionBackEndId: v[type].session.id,
      secondScreenLink: v[type].session.secondScreenLink,
    };
    return paramsSession;
  };

  const [createSerie] = useMutation(CREATE_SESSION_SERIES, {
    variables: {
      SerieId: seriesId,
    },
    onError(e) {
      Alert.alert(UNKNOWN_ERROR_TEXT, e.message);
    },
    onCompleted({...v}) {
      const paramsSession = getParamSession(v, 'liveSerie');
      navigation.replace('CreateVonageBox', {paramsSession});
    },
  });

  const [createSession] = useMutation(CREATE_SESSION, {
    variables: {
      description: paramsRoutes?.Description,
      invitedUsers: paramsRoutes?.invitedUsers ?? paramsRoutes?.followers,
      notify: true,
      title: paramsRoutes?.Name,
      topics: paramsRoutes?.topics,
      secondScreenLink: paramsRoutes?.SecondScreenLink,
      // isPrivate: paramsRoutes?.isPrivate,
    },
    onError(e) {
      Alert.alert(UNKNOWN_ERROR_TEXT, e.message);
    },
    onCompleted({...v}) {
      const paramsSession = getParamSession(v, 'createSession');
      navigation.replace('CreateVonageBox', {paramsSession});
    },
  });

  const callCreateSession = async () => {
    setLoading(true);
    if (!seriesId) {
      await createSession();
    } else {
      await createSerie();
    }
  };

  const permission = async () => {
    const camara = await requestCameraPermission();
    const microphone = await requestMicrophonePermission();
    if (!camara || !microphone) {
      Alert.alert('Error', 'You have to authorize the camara and microphone permission');
      navigation.goBack();
    }
  };

  useEffect(() => {
    permission();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={styles.text}>{TITLE_SESSION}</Text>
        <Text style={styles.text}>{paramsRoutes?.Name}</Text>
      </View>
      <View style={styles.videoContainer}>
        {enableCam ? <Camera ref={rnCamera} /> : null}
        <TopBar>
          <Username>{paramsRoutes?.hostName}</Username>
          <Controls>
            <View style={styles.iconMicStyle}>
              <Icon.Button
                size={25}
                iconStyle={{marginRight: 0}}
                backgroundColor="transparent"
                name={enableMic ? 'mic' : 'mic-off'}
                onPress={() => setEnableMic(!enableMic)}
              />
            </View>
            <View style={styles.iconRotateStyle}>
              <Icon.Button
                size={25}
                iconStyle={{marginRight: 0}}
                backgroundColor="transparent"
                name={enableCam ? 'videocam' : 'videocam-off'}
                onPress={() => setEnableCam(!enableCam)}
              />
            </View>
            <View style={styles.iconEndCallStyle}>
              <Icon.Button
                size={25}
                iconStyle={{marginRight: 0}}
                backgroundColor="transparent"
                name="flip-camera-android"
                onPress={() => {
                  rnCamera && rnCamera.current && rnCamera.current.switchCamera && rnCamera.current.switchCamera();
                  setFrontCam(!frontCam);
                }}
              />
            </View>
          </Controls>
        </TopBar>
      </View>
      <View style={styles.buttonsContainer}>
        <NewLargeButton
          title="Back"
          transparent
          noPadding
          style={styles.button}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'MainTabs', screen: 'Home'}],
            });
          }}
        />
        <NewLargeButton
          style={styles.button}
          noPadding
          disabled={loading}
          loading={loading}
          onPress={() => callCreateSession()}>
          <GoLive>
            <Text style={styles.textStyle}>Go Live</Text>
            <GoLiveIcon>
              <CongratsIco />
            </GoLiveIcon>
          </GoLive>
        </NewLargeButton>
      </View>
    </View>
  );
};

export default withSafeArea(CreateSessionScreen);
