import React from 'react';
import styled from 'styled-components/native';
import {VibrancyView} from '@react-native-community/blur';

const Button = styled.TouchableOpacity(() => ({
  position: 'relative',
  width: 40,
  height: 40,
}));

const Icon = styled.Image(() => ({
  width: '100%',
  height: '100%',
}));

const Container = styled.View(() => ({
  width: 40,
  height: 61,
}));

const Text = styled.Text(() => ({}));

export default function BlureBtn({event, ico, text}) {
  return (
    <Container>
      <Button onPress={event || (() => {})}>
        {/* <BackgroundIcon source={image} blurRadius={10}> */}
        <VibrancyView
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 20,
          }}
          // viewRef={this.state.viewRef}
          blurType="dark"
          // blurAmount={1}
          blurAmount={5}
          blurRadius={99}
          downsampleFactor={99}
          overlayColor="red"
          reducedTransparencyFallbackColor="black"
        />
        <Icon source={ico} />
        {/* </BackgroundIcon> */}
      </Button>
      {text ? <Text>{text}</Text> : null}
    </Container>
  );
}
