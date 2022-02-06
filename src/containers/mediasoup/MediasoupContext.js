import * as React from 'react';
import {CAMERA_ORIENTATION} from 'src/constants/Variables';

const MediaSoupContext = React.createContext({
  joinSessionToken: null,
  isUserOwner: false,
  currentSession: null,
  mediaSoup: [],
  mediaSoupUnread: 0,
  mediaSoupRefresh: () => undefined,
  setJoinSessionToken: (token) => undefined,
  setCurrentSession: (session) => undefined,
  setUserOwner: (v) => undefined,
  camera: {
    cameraOrientation: CAMERA_ORIENTATION.FRONT,
    isCameraEnabled: true,
    isMicEnabled: true,
  },
  setCameraOrientation: (orientation) => undefined,
  setCameraEnabled: (enabled) => undefined,
  setMicEnabled: (enabled) => undefined,
});

export default MediaSoupContext;
