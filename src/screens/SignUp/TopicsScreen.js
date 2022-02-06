import React, {useCallback} from 'react';
import {Modal} from 'react-native';
import Topics from 'src/components/Topics';

const TopicsScreen = ({navigation, setVisible, visible, createUserProfile, profile, saving}) => {
  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleSave = useCallback(
    (topics) => {
      createUserProfile({variables: {profile: {...profile, topics}}});
    },
    [createUserProfile, profile],
  );

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="slide">
      <Topics
        showLogo
        close={handleClose}
        save={handleSave}
        profile={false}
        saving={saving}
        navigation={navigation}
        showTitle
        showSubtitle
      />
    </Modal>
  );
};

export default TopicsScreen;
