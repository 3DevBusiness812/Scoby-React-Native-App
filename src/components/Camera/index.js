/* eslint-disable */
import React from 'react';
import { RNCamera } from 'react-native-camera';
import styled from 'styled-components/native';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';

const Container = styled.View({
  flex: 1,
  flexDirection: 'column',
  backgroundColor: 'black',
  zIndex: 1,
});

const ActivityIndicator = styled.ActivityIndicator({});

const ContainerNotAuthorization=styled.View({
  flex:1,
  justifyContent:'center',
  alignItems:'center',
  backgroundColor:Colors.white
})

const Text=styled.Text({
  ...Fonts.avenir,
  fontSize:20,
  color:Colors.black,
  width:'80%'
})

const NotAuthorizedView=()=>{
  return (
    <ContainerNotAuthorization>
      <Text>You have to authorize the camara and microphone permissions</Text>
    </ContainerNotAuthorization>
  )
}

export default class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flashModeState: false,
      frontCamera: true,
      captureAudio: true
    };
  }

  render() {
    const { flashModeState, frontCamera, captureAudio } = this.state;

    return (
      <Container>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          flashMode={
            RNCamera.Constants.FlashMode[flashModeState ? 'on' : 'off']
          }
          captureAudio={captureAudio}
          type={RNCamera.Constants.Type[frontCamera ? 'front' : 'back']}
          // videoStabilizationMode={RNCamera.Constants.VideoStabilization['auto']}
          defaultVideoQuality={RNCamera.Constants.VideoQuality['720p']}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          notAuthorizedView={<NotAuthorizedView/>}
          pendingAuthorizationView={
            <ActivityIndicator color="red" size="large" />
          }
        />
      </Container>
    );
  }

  switchCamera = () => {
    if (this.camera) {
      // eslint-disable-next-line react/no-access-state-in-setstate
      this.setState({frontCamera: !this.state.frontCamera});
      return this.state.frontCamera;
    }
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
      };
      const data = await this.camera.takePictureAsync(options);
      return data;
    }
  };

  // eslint-disable-next-line consistent-return

  captureAudio = () => {
    if (this.camera) {
      this.setState({ captureAudio: !this.state.captureAudio });
    }
  };
}
