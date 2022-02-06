import React, {useCallback, useState} from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components';
import Input from 'src/components/Input';
import {validEmail} from 'src/utils/helpers';
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

const EditEmail = ({value, setProfile}) => {
  const [email, setEmail] = useState(value || '');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);

  const onSave = () => {
    !validEmail(email) && setError('Wrong email address');

    if (validEmail(email)) {
      setError(false);
      setProfile('email', email);
      setVisible(false);
    }
  };

  const handleOpen = useCallback(() => setVisible(true), []);
  const handleClose = useCallback(() => {
    setEmail(value || '');
    setVisible(false);
  }, [value]);

  const currentStringLength = email ? email.length : 0;

  return (
    <>
      <ListItem title="Email" onPress={handleOpen} value={email} />
      <Modal visible={visible} onRequestClose={handleClose} transparent statusBarTranslucent animationType="slide">
        <ModalWrapper>
          <ModalHeader title="Email" onPressBack={handleClose} onPressDone={onSave} disabled={value === email} />
          <ModalContent>
            <Input
              noMargin
              value={email}
              onChangeText={setEmail}
              hint={`${currentStringLength}/${MAX_LENGTH}`}
              maxLength={MAX_LENGTH}
              autoCapitalize="none"
              isError={error}
            />
          </ModalContent>
        </ModalWrapper>
      </Modal>
    </>
  );
};

export default EditEmail;
