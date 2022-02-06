import React, {useCallback, useState} from 'react';
import {Modal} from 'react-native';
import Topics from 'src/components/Topics';
import ListItem from './ListItem';

const EditTopic = ({value, setProfile, navigation}) => {
  const [visible, setVisible] = useState(false);

  const handleSave = useCallback(
    (topics) => {
      setProfile('topics', topics);
      setVisible(false);
    },
    [setProfile],
  );

  const handleOpen = useCallback(() => setVisible(true), []);
  const handleClose = useCallback(() => setVisible(false), []);

  return (
    <>
      <ListItem title="Topics" onPress={handleOpen} value="View all" />
      <Modal visible={visible} transparent statusBarTranslucent animationType="slide" onRequestClose={handleClose}>
        <Topics close={handleClose} value={value} save={handleSave} profile navigation={navigation} title="Topics" />
      </Modal>
    </>
  );
};

export default EditTopic;
