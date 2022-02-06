import React, {useCallback, useState} from 'react';
import {Modal} from 'react-native';
import Input from 'src/components/Input';
import styled from 'styled-components';
import {statusBarHeight} from 'src/components/withSafeArea';
import Colors from 'src/constants/Colors';
import ModalHeader from './ModalHeader';
import ListItem from './ListItem';

const MAX_LENGTH = 30;

const ModalWrapper = styled.View({
  flex: 1,
  paddingTop: statusBarHeight,
  backgroundColor: Colors.blueBackgroundSession,
});

const ModalContent = styled.View({
  paddingHorizontal: 24,
});

const EditNickName = ({nickname, setProfile}) => {
  const [name, setName] = useState(nickname || '');
  const [visible, setVisible] = useState(false);

  const onSave = () => {
    setProfile('username', name);
    setVisible(false);
  };

  const handleOpen = useCallback(() => setVisible(true), []);
  const handleClose = useCallback(() => {
    setName(nickname || '');
    setVisible(false);
  }, [nickname]);

  return (
    <>
      <ListItem title="Nickname" onPress={handleOpen} value={`@${name}`} />
      <Modal visible={visible} onRequestClose={handleClose} transparent statusBarTranslucent animationType="slide">
        <ModalWrapper>
          <ModalHeader title="Nickname" onPressBack={handleClose} onPressDone={onSave} disabled={nickname === name} />
          <ModalContent>
            <Input
              noMargin
              value={name}
              onChangeText={setName}
              hint={`${name.length}/${MAX_LENGTH}`}
              maxLength={MAX_LENGTH}
              autoCapitalize="none"
            />
          </ModalContent>
        </ModalWrapper>
      </Modal>
    </>
  );
};

export default EditNickName;
