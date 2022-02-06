import React from 'react';
import styled from 'styled-components';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {TITLE_SCHEDULE_COMPONENT} from 'src/constants/Texts';
import Day from 'src/components/Schedule/Day';

const Wrapper = styled.View({
  borderRadius: 10,
  backgroundColor: Colors.white,
  padding: 20,
  marginVertical: 20,
});

const Title = styled.Text({
  ...Fonts.avenir,
  fontSize: 15,
  color: Colors.black,
  marginBottom: 10,
});

const Schedule = ({ScheduleDate, SetScheduleDate}) => (
  <Wrapper>
    <Title>{TITLE_SCHEDULE_COMPONENT}</Title>
    <Day ScheduleDate={ScheduleDate} SetScheduleDate={SetScheduleDate} day="Su" />
    <Day ScheduleDate={ScheduleDate} SetScheduleDate={SetScheduleDate} day="Mo" />
    <Day ScheduleDate={ScheduleDate} SetScheduleDate={SetScheduleDate} day="Tu" />
    <Day ScheduleDate={ScheduleDate} SetScheduleDate={SetScheduleDate} day="We" />
    <Day ScheduleDate={ScheduleDate} SetScheduleDate={SetScheduleDate} day="Th" />
    <Day ScheduleDate={ScheduleDate} SetScheduleDate={SetScheduleDate} day="Fr" />
    <Day ScheduleDate={ScheduleDate} SetScheduleDate={SetScheduleDate} day="Sa" />
  </Wrapper>
);

export default Schedule;
