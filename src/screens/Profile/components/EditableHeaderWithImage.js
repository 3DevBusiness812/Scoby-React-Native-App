import React, {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';
import {CAMERA, GALLERY, PHOTO_CHOOSE, PROFILE_TAP_TO_CHANGE} from 'src/constants/Texts';
import {requestCameraPermission} from 'src/utils/permission/allPermission';
import coverImage from 'assets/images/profile/Cover.png';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import {CameraIcon} from 'assets/svg';
import Fonts from 'src/constants/Fonts';
import PromptModal from 'src/components/Modal/PromptModal';

const Wrapper = styled.View({});

const TopContent = styled.TouchableOpacity({
  width: '100%',
  height: 144,
});

const TapText = styled.Text({
  ...Fonts.avenir,
  color: 'white',
});

const BgImage = styled.ImageBackground({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

const Avatar = styled.TouchableOpacity({
  width: 96,
  height: 96,
  marginTop: -48,
  marginLeft: 16,
  borderWidth: 4,
  borderRadius: 48,
  borderColor: colors.blueBackgroundSession,
  backgroundColor: colors.black,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

const AvatarImage = styled.Image(({avatar}) => ({
  width: '100%',
  height: '100%',
  opacity: avatar && avatar.length ? 1 : 0.5,
}));

const EditIcon = styled.View({
  position: 'absolute',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.7,
});

const EditableHeaderWithImage = ({avatar, setAvatar, cover, setCover}) => {
  const [modalVisible, setModalVisible] = useState(undefined);

  const setImage = useCallback(
    (response, bg) => {
      if (!response.didCancel && !response.errorCode && !response.errorMessage) {
        if (bg) {
          setCover(response.path);
        } else {
          setAvatar(response.path);
        }
      } else if (response.errorMessage) {
        Alert.alert('Image Error', response.errorMessage);
      } else {
        Alert.alert('Error', 'Wrong');
      }
    },
    [setAvatar, setCover],
  );

  const chooseImage = useCallback((bg, type) => {
    if (type === 'CAMERA') {
      ImagePicker.openCamera({
        compressImageMaxHeight: bg ? 600 : 1000,
        compressImageMaxWidth: bg ? 1000 : 1000,
        mediaType: 'photo',
        useFrontCamera: true,
        cropperCircleOverlay: !bg,
        freeStyleCropEnabled: true,
        cropping: true,
        forceJpg: true,
      }).then((response) => setImage(response, bg));
    }

    if (type === 'GALERY') {
      ImagePicker.openPicker({
        compressImageMaxHeight: bg ? 600 : 1000,
        compressImageMaxWidth: bg ? 1000 : 1000,
        mediaType: 'photo',
        cropperCircleOverlay: !bg,
        freeStyleCropEnabled: true,
        cropping: true,
        forceJpg: true,
      }).then((response) => setImage(response, bg));
    }
  }, [setImage]);

  const handleChangeCover = useCallback(
    (type) => {
      setModalVisible(undefined);
      setTimeout(() => chooseImage(true, type), 500);
    },
    [chooseImage],
  );

  const handleChangeAvatar = useCallback(
    (type) => {
      setModalVisible(undefined);
      setTimeout(() => chooseImage(false, type), 500);
    },
    [chooseImage],
  );

  const handleChoise = useCallback(
    (type) => {
      modalVisible === 'COVER' ? handleChangeCover(type) : handleChangeAvatar(type);
    },
    [modalVisible, handleChangeAvatar, handleChangeCover],
  );

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const hideModal = useCallback(
    (state) => {
      setModalVisible(state ? 'AVATAR' : undefined);
    },
    [setModalVisible],
  );

  return (
    <Wrapper>
      <PromptModal
        visible={modalVisible !== undefined}
        setVisible={hideModal}
        text={PHOTO_CHOOSE}
        leftButtonText={CAMERA}
        rightButtonText={GALLERY}
        onLeftButtonPress={() => {
          handleChoise('CAMERA');
          setModalVisible(undefined);
        }}
        onRightButtonPress={() => {
          handleChoise('GALERY');
          setModalVisible(undefined);
        }}
      />
      <TopContent activeOpacity={1} onPress={() => setModalVisible('COVER')}>
        <BgImage source={cover ? {uri: cover} : coverImage} resizeMode="cover">
          <TapText>{PROFILE_TAP_TO_CHANGE}</TapText>
        </BgImage>
      </TopContent>
      <Avatar onPress={() => setModalVisible('AVATAR')}>
        <AvatarImage
          source={avatar ? {uri: avatar} : avatarSrc}
          resizeMode="cover"
          width="100%"
          height="100%"
          avatar={avatar}
        />
        <EditIcon>
          <CameraIcon />
        </EditIcon>
      </Avatar>
    </Wrapper>
  );
};

export default EditableHeaderWithImage;

