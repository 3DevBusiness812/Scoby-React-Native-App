import React, {useState, useCallback} from 'react';
import {Modal, Platform} from 'react-native';
import {locationIos, myAlert, requestLocationPermission} from 'src/utils/permission/allPermission';
import styled from 'styled-components';
import Colors from 'src/constants/Colors';
import {statusBarHeight} from 'src/components/withSafeArea';
import MapComponent from './MapComponent';
import ModalHeader from './ModalHeader';
import ListItem from './ListItem';

const ModalWrapper = styled.View({
  flex: 1,
  paddingTop: statusBarHeight,
  backgroundColor: Colors.blueBackgroundSession,
});

const ModalContent = styled.View({});

const MAX_VISIBLE_LENGTH = 25;

const EditLocation = ({value, setProfile}) => {
  const [location, setLocation] = useState(value || '');
  const [validLocation, setValidLocation] = useState(true);
  const [visible, setVisible] = useState(false);

  const onSave = useCallback(() => {
    setProfile('location', location);
    setVisible(false);
  }, [location, setProfile]);

  const onCancel = useCallback(() => {
    if (value && value.length) {
      setLocation(value);
    }
    setVisible(false);
  }, [value]);

  const handleOpen = useCallback(async () => {
    const hasPermission = Platform.OS === 'ios' ? await locationIos() : await requestLocationPermission();
    if (hasPermission) {
      setVisible(true);
    } else {
      myAlert({
        title: 'The permission is denied',
        body: 'The permission Location is denied and not requestable anymore',
      });
    }
  }, []);

  return (
    <>
      <ListItem title="Location" onPress={handleOpen} maxLength={MAX_VISIBLE_LENGTH} value={location} />
      <Modal visible={visible} onRequestClose={onCancel} transparent statusBarTranslucent animationType="slide">
        <ModalWrapper>
          <ModalHeader
            title="Location"
            onPressBack={onCancel}
            onPressDone={onSave}
            disabled={location === value && validLocation}
          />
          <ModalContent>
            <MapComponent location={location} setLocation={setLocation} setValidLocation={setValidLocation} />
          </ModalContent>
        </ModalWrapper>
      </Modal>
    </>
  );
};

export default EditLocation;
