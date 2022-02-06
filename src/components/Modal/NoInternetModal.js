import * as React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components/native';
import NetInfo from '@react-native-community/netinfo';
import {ALERT_NO_INTERNET_CONNECTION} from 'src/constants/Texts';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';

const ModalWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  opacity: 0.9;
  background-color: rgba(116, 93, 237, 0.9);
`;

const TextNoInternet = styled.Text({
  ...Fonts.avenir,
  color: Colors.white,
  fontSize: 18,
  textAlign: 'center',
});

class NoInternetModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
    };
    this.listener = null;
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
  }

  componentDidMount() {
    this.checkInternetConnection();
    this.listener = NetInfo.addEventListener(this.handleConnectionChange);
  }

  componentWillUnmount() {
    this.listener && this.listener();
  }

  handleConnectionChange = (state) => {
    if (state.isConnected !== this.state.isConnected) {
      this.setState({
        isConnected: state.isConnected,
      });
    }
  };

  checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    this.handleConnectionChange(state);
  };

  render() {
    const {isConnected} = this.state;

    return (
      <Modal visible={!isConnected} transparent hardwareAccelerated animationType="fade">
        <ModalWrapper>
          <TextNoInternet>{ALERT_NO_INTERNET_CONNECTION}</TextNoInternet>
        </ModalWrapper>
      </Modal>
    );
  }
}

export default NoInternetModal;
