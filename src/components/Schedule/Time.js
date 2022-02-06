import React, {useState} from 'react';
import styled from 'styled-components';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';
import {Remove} from 'assets/svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const Text = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: Colors.black,
});

const TextTime = styled.Text({fontSize: 13, color: Colors.black});

const TextTimeContainer = styled.TouchableOpacity({
  borderRadius: 10,
  borderColor: Colors.errorBackground,
  borderWidth: 0.5,
  height: 35,
  width: 80,
  margin: 10,
  alignItems: 'center',
  justifyContent: 'center',
});

const Container = styled.View({flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'});

const Botton = styled.TouchableOpacity({width: 30, height: 30, justifyContent: 'center', alignItems: 'center'});

const Time = ({deleteOnPress, addStart, addEnd, startValue, endValue}) => {
  const [mode, setMode] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = (setup) => {
    setMode(setup);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    mode ? addStart(moment(date).format('HH:mm:ss')) : addEnd(moment(date).format('HH:mm:ss'));
  };

  return (
    <Container>
      <Text onPress={() => showDatePicker(true)}>Start:</Text>
      <TextTimeContainer onPress={() => showDatePicker(true)}>
        <TextTime>{startValue}</TextTime>
      </TextTimeContainer>
      <Text onPress={() => showDatePicker(false)}>End:</Text>
      <TextTimeContainer onPress={() => showDatePicker(false)}>
        <TextTime>{endValue}</TextTime>
      </TextTimeContainer>
      <Botton onPress={deleteOnPress}>
        <Remove />
      </Botton>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={new Date(Date.now())}
        onHide={() => setDatePickerVisibility(false)}
      />
    </Container>
  );
};

export default Time;
