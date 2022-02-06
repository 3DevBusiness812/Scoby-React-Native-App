import React from 'react';
import styled from 'styled-components/native';
import {Dimensions, Animated} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Outside = styled.TouchableOpacity({
  height: SCREEN_HEIGHT / 2,
});

const Container = styled.View({
  height: SCREEN_HEIGHT / 2,
  backgroundColor: 'white',
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  width: SCREEN_WIDTH,
  paddingTop: 30,
});

export default class TopPanel extends React.Component {
  state = {
    topAnim: new Animated.Value(-1 * SCREEN_HEIGHT),
    visibleTopAnim: true,
  };

  show = () => {
    this.setState({visibleTopAnim: false});
  };

  hide = () => {
    this.setState({visibleTopAnim: true});
  };

  render() {
    const {topAnim, visibleTopAnim} = this.state;
    const {header} = this.props;

    if (visibleTopAnim) {
      Animated.timing(topAnim, {
        toValue: -SCREEN_HEIGHT,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(topAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: false,
      }).start();
    }
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <Animated.View style={{zIndex: 120, position: 'absolute', top: topAnim}}>
        <Container>{header('black')}</Container>
        <Outside activeOpacity={1} onPress={this.hide} />
      </Animated.View>
    );
  }
}
