import * as React from 'react';
import MediaSoupContext from 'src/containers/mediasoup/MediasoupContext';
import {CAMERA_ORIENTATION} from '../../constants/Variables';

export class MediaSoupProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaSoup: [],
      mediaSoupUnread: 0,
      joinSessionToken: null,
      currentSession: null,
      isUserOwner: false,
      camera: {
        cameraOrientation: CAMERA_ORIENTATION.FRONT,
        isCameraEnabled: true,
        isMicEnabled: true,
      },
    };

    this.mediaSoupRefresh = (key, value) => {
      this.setState((prevState) => ({...prevState, [key]: value}));
    };

    this.setJoinSessionToken = (token) => {
      this.setState({joinSessionToken: token});
    };

    this.setCurrentSession = (session) => {
      this.setState({currentSession: session});
    };

    this.setUserOwner = (v) => {
      this.setState({isUserOwner: v});
    };

    this.setMicEnabled = (v) => {
      const {camera} = this.state;
      camera.isMicEnabled = v;
      this.setState({camera});
    };

    this.setCameraEnabled = (v) => {
      const {camera} = this.state;
      camera.isCameraEnabled = v;
      this.setState({camera});
    };

    this.setCameraOrientation = (v) => {
      const {camera} = this.state;
      camera.cameraOrientation = v;
      this.setState({camera});
    };
  }

  render() {
    const context = {
      joinSessionToken: this.state.joinSessionToken,
      currentSession: this.state.currentSession,
      isUserOwner: this.state.isUserOwner,
      mediaSoup: this.state.mediaSoup,
      mediaSoupUnread: this.state.mediaSoupUnread,
      camera: this.state.camera,
      mediaSoupRefresh: this.mediaSoupRefresh,
      setJoinSessionToken: this.setJoinSessionToken,
      setCurrentSession: this.setCurrentSession,
      setUserOwner: this.setUserOwner,
      setCameraOrientation: this.setCameraOrientation,
      setCameraEnabled: this.setCameraEnabled,
      setMicEnabled: this.setMicEnabled,
    };

    return <MediaSoupContext.Provider value={context}>{this.props.children}</MediaSoupContext.Provider>;
  }
}

export default MediaSoupContext.Consumer;
