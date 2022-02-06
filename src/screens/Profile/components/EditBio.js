import React, {useCallback, useState} from 'react';
import {Modal} from 'react-native';
import Input from 'src/components/Input';
import styled from 'styled-components';
import {statusBarHeight} from 'src/components/withSafeArea';
import Colors from 'src/constants/Colors';
import ModalHeader from './ModalHeader';
import ListItem from './ListItem';

const MAX_LENGTH = 120;

const ModalWrapper = styled.View({
  flex: 1,
  paddingTop: statusBarHeight,
  backgroundColor: Colors.blueBackgroundSession,
});

const ModalContent = styled.View({
  paddingHorizontal: 24,
});

const EditBio = ({bio, setProfile}) => {
  const [bioNew, setBio] = useState(bio || '');
  const [visible, setVisible] = useState(false);

  const onSave = () => {
    setProfile('bio', bioNew);
    setVisible(false);
  };

  const handleOpen = useCallback(() => setVisible(true), []);
  const handleClose = useCallback(() => {
    setBio(bio || '');
    setVisible(false);
  }, [bio]);

  const currentStringLength = bioNew ? bioNew.length : 0;

  return (
    <>
      <ListItem title="Bio" onPress={handleOpen} value={bioNew} />
      <Modal visible={visible} onRequestClose={handleClose} transparent statusBarTranslucent animationType="slide">
        <ModalWrapper>
          <ModalHeader title="Bio" onPressBack={handleClose} onPressDone={onSave} disabled={bio === bioNew} />
          <ModalContent>
            <Input
              noMargin
              value={bioNew}
              onChangeText={setBio}
              hint={`${currentStringLength}/${MAX_LENGTH}`}
              maxLength={MAX_LENGTH}
              placeholder="Add bio to your profile"
              multiline
            />
          </ModalContent>
        </ModalWrapper>
      </Modal>
    </>
  );
};

export default EditBio;
