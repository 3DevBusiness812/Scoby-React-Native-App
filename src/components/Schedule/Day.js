import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {CheckBox} from 'react-native-elements';
import {Add, AddUncheck, CheckBoxIcon, UncheckBoxIconBlack} from 'assets/svg';
import moment from 'moment';
import Time from './Time';

const DayOfWeek = styled.Text({
  ...Fonts.avenirBold,
  color: Colors.black,
  fontSize: 15,
});

const TopContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginLeft: -20,
});

const LeftView = styled.View({
  width: '50%',
  flexDirection: 'row',
  alignItems: 'center',
});

const AddNewTime = styled.TouchableOpacity({
  height: 50,
  width: 25,
  justifyContent: 'center',
  alignItems: 'center',
});

const Wrapper = styled.View({});

function keyExtractor({id}) {
  return `time-row-${id}-${Math.random()}`;
}

const Day = ({day, SetScheduleDate, ScheduleDate}) => {
  const changeTextStart = useCallback(
    (index, text) => {
      const time = ScheduleDate;
      time[index] = {...time[index], start: text};
      SetScheduleDate([...time]);
    },
    [ScheduleDate, SetScheduleDate],
  );

  const changeTextEnd = useCallback(
    (index, text) => {
      const time = ScheduleDate;
      time[index] = {...time[index], end: text};
      SetScheduleDate([...time]);
    },
    [ScheduleDate, SetScheduleDate],
  );

  const timeItems = useMemo(
    () =>
      ScheduleDate.map((item, index, data) => {
        if (item.day === day) {
          return (
            <Time
              key={keyExtractor(index)}
              deleteOnPress={() => {
                SetScheduleDate(data.filter((e) => e !== item));
              }}
              addStart={(text) => changeTextStart(index, text)}
              addEnd={(text) => changeTextEnd(index, text)}
              startValue={item.start ? moment(item.start, 'HH:mm:ss').format('hh:mm a') : ''}
              endValue={item.end ? moment(item.end, 'HH:mm.ss').format('hh:mm a') : ''}
            />
          );
        }
        return null;
      }),
    [day,ScheduleDate, SetScheduleDate, changeTextEnd, changeTextStart],
  );

  const isSchedule = useCallback(() => ScheduleDate.filter((e) => e.day === day).length, [ScheduleDate, day]);

  return (
    <Wrapper>
      <TopContainer>
        <LeftView>
          <CheckBox
            checked={isSchedule() !== 0}
            onPress={() => {
              if (!isSchedule()) {
                SetScheduleDate((dates) => [...dates, {day, start: '', end: ''}]);
              } else {
                SetScheduleDate(ScheduleDate.filter((e) => e.day !== day));
              }
            }}
            checkedIcon={<CheckBoxIcon />}
            uncheckedIcon={<UncheckBoxIconBlack />}
          />
          <DayOfWeek>{day}</DayOfWeek>
        </LeftView>
        <AddNewTime onPress={() => SetScheduleDate((time) => [...time, {day, start: '', end: ''}])}>
          {ScheduleDate.length ? <Add /> : <AddUncheck />}
        </AddNewTime>
      </TopContainer>
      {timeItems}
    </Wrapper>
  );
};

export default Day;
