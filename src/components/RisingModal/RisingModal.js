/* eslint-disable no-use-before-define */
import React from 'react';
import {ActivityIndicator, StyleSheet, useWindowDimensions} from 'react-native';
import Modal from 'react-native-modal';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import Colors from 'src/constants/Colors';
import styled from 'styled-components';
import Fonts from 'src/constants/Fonts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Wrapper = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  backgroundColor: Colors.violetColor,
  borderTopLeftRadius: 18,
  borderTopRightRadius: 18,
});

const Img = styled.Image({
  borderRadius: 50,
  width: 50,
  height: 50,
  marginTop: 20,
});

const Anchor = styled.View({
  width: 105,
  height: 6,
  backgroundColor: Colors.white,
  borderRadius: 8,
  marginBottom: 15,
  marginTop: 12,
});

const Btn = styled.TouchableOpacity({
  paddingVertical: 22,
  borderTopColor: Colors.borderGreyModal,
  borderTopWidth: 0.7,
  marginTop: 25,
  width: '100%',
});

const BtnText = styled.Text({
  textAlign: 'center',
  ...Fonts.avenirBold,
  color: Colors.white,
  opacity: 0.7,
  fontSize: 14,
});

const RisingModal = ({toggleModal, isVisible, avatar, onSubmit, btnText, isLoading = false}) => {
  const {height, width} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Modal
        onBackdropPress={toggleModal}
        isVisible={isVisible}
        onSwipeComplete={toggleModal}
        swipeDirection="down"
        style={styles.modalStyle}
        backdropColor="black"
        backdropOpacity={0.2}>
        <Wrapper style={{width, height: height * 0.3 - insets.bottom * 2}}>
          <Anchor />
          <Img source={avatar ? {uri: avatar} : avatarSrc} />
          <Btn onPress={onSubmit}>{isLoading ? <ActivityIndicator /> : <BtnText>{btnText}</BtnText>}</Btn>
        </Wrapper>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    justifyContent: 'flex-end',
  },
});

export default RisingModal;
