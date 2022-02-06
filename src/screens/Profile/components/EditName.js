import React, {useCallback, useState} from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components';
import Colors from 'src/constants/Colors';
import Input from 'src/components/Input';
import {statusBarHeight} from 'src/components/withSafeArea';
import ListItem from './ListItem';
import ModalHeader from './ModalHeader';

const MAX_LENGTH = 30;

const ModalWrapper = styled.View({
  flex: 1,
  paddingTop: statusBarHeight,
  backgroundColor: Colors.blueBackgroundSession,
});

const ModalContent = styled.View({
  paddingHorizontal: 24,
});

const EditName = ({fullName, setProfile}) => {
  const [name, setName] = useState(fullName || '');
  const [visible, setVisible] = useState(false);

  const onSave = () => {
    setProfile('fullName', name);
    setVisible(false);
  };

  const handleOpen = useCallback(() => setVisible(true), []);
  const handleClose = useCallback(() => {
    setName(fullName || '');
    setVisible(false);
  }, [fullName]);

  return (
    <>
      <ListItem title="Name" onPress={handleOpen} value={name} />
      <Modal visible={visible} onRequestClose={handleClose} transparent statusBarTranslucent animationType="slide">
        <ModalWrapper>
          <ModalHeader title="Name" onPressBack={handleClose} onPressDone={onSave} disabled={fullName === name} />
          <ModalContent>
            <Input
              noMargin
              value={name}
              onChangeText={setName}
              hint={`${name.length}/${MAX_LENGTH}`}
              maxLength={MAX_LENGTH}
            />
          </ModalContent>
        </ModalWrapper>
      </Modal>
    </>
  );
};

export default EditName;
