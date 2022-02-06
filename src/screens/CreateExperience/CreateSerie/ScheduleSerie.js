import React, {useState, useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import {SERIES_SCHEDULE_SUBTITLE, TITLE_NAME_SERIES} from 'src/constants/Texts';
import styled from 'styled-components';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';
import Schedule from 'src/components/Schedule/Schedule';
import NewLargeButton from 'src/components/NewLargeButton';

const Wrapper = styled.ScrollView({
  marginTop: '20%',
  flexDirection: 'column',
  backgroundColor: Colors.blueBackgroundSession,
  marginHorizontal: 24,
});

const TitleText = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  lineHeight: '32px',
  color: Colors.white,
});

const SubTitle = styled.Text(({experience = 16}) => ({
  marginTop: 20,
  ...Fonts.avenir,
  fontSize: experience,
  color: Colors.white,
  lineHeight: '23px',
}));

const ButtonContainer = styled.View({
  flexDirection: 'row',
});

const ScheduleSerie = ({navigation, route}) => {
  const {params} = route;
  const [scheduleDate, setScheduleDate] = useState([]);
  const checkEmptyField = useCallback(() => scheduleDate.filter((e) => e.start === '' || e.end === ''), [scheduleDate]);

  useEffect(() => {
    if (params.series) {
      setScheduleDate(params.series.schedule.map((item) => ({day: item.day, end: item.end, start: item.start})));
    }
  }, [params]);

  const handleGoToNextStep = () => {
    const EmptyFields = checkEmptyField();
    if (EmptyFields.length === 0 && scheduleDate.length !== 0) {
      navigation.navigate('SerieSubscribe', {Schedule: scheduleDate, serie: params.series});
    } else if (EmptyFields.length > 0) {
      Alert.alert('Empty Field', `(${EmptyFields[EmptyFields.length - 1].day}) has a empty field`);
    } else {
      Alert.alert('Empty selection', 'You did not already select any day');
    }
  };

  return (
    <Wrapper showsVerticalScrollIndicator={false}>
      <TitleText>{TITLE_NAME_SERIES}</TitleText>
      <SubTitle>{SERIES_SCHEDULE_SUBTITLE}</SubTitle>
      <Schedule ScheduleDate={scheduleDate} SetScheduleDate={setScheduleDate} />
      <ButtonContainer>
        <NewLargeButton title="Cancel" transparent onPress={() => navigation.goBack()} flex />
        <NewLargeButton flex title="Next" disabled={false} onPress={handleGoToNextStep} />
      </ButtonContainer>
    </Wrapper>
  );
};

export default ScheduleSerie;
