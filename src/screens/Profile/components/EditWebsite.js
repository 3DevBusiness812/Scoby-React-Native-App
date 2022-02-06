import React, {useCallback, useState} from 'react';
import {Modal} from 'react-native';
import Input from 'src/components/Input';
import styled from 'styled-components';
import {validURL} from 'src/utils/helpers';
import {statusBarHeight} from 'src/components/withSafeArea';
import Colors from 'src/constants/Colors';
import ModalHeader from './ModalHeader';
import ListItem from './ListItem';

const MAX_LENGTH = 120;
const MAX_VISIBLE_LENGTH = 30;

const ModalWrapper = styled.View({
  flex: 1,
  paddingTop: statusBarHeight,
  backgroundColor: Colors.blueBackgroundSession,
});

const ModalContent = styled.View({
  paddingHorizontal: 24,
});

const EditWebsite = ({website, setProfile}) => {
  const [link, setLink] = useState(website || '');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);

  const onSave = () => {
    !validURL(link) && setError('Wrong website address');

    if (validURL(link)) {
      setError(false);
      setProfile('website', link);
      setVisible(false);
    }
  };

  const handleOpen = useCallback(() => setVisible(true), []);
  const handleClose = useCallback(() => {
    setLink(website || '');
    setVisible(false);
  }, [website]);

  return (
    <>
      <ListItem title="Website" onPress={handleOpen} maxLength={MAX_VISIBLE_LENGTH} value={link} />
      <Modal visible={visible} onRequestClose={handleClose} transparent statusBarTranslucent animationType="slide">
        <ModalWrapper>
          <ModalHeader title="Website" onPressBack={handleClose} onPressDone={onSave} disabled={website === link} />
          <ModalContent>
            <Input
              noMargin
              value={link}
              onChangeText={setLink}
              isError={error}
              maxLength={MAX_LENGTH}
              autoCapitalize="none"
            />
          </ModalContent>
        </ModalWrapper>
      </Modal>
    </>
  );
};

export default EditWebsite;
