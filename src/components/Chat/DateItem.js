import React from 'react';
import {useWindowDimensions} from 'react-native';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import styled from 'styled-components';

const DayText = styled.Text({
  ...Fonts.avenir,
  color: Colors.white,
  opacity: 0.5,
  textAlign: 'center',
});

const DayWrapper = styled.View({
  width: '120%',
  height: 0.7,
  marginLeft: -22,
  backgroundColor: Colors.translucentWhite,
  marginBottom: 25,
  marginTop: 25,
  position: 'relative',
});

const Day = styled.View({
  position: 'absolute',
  left: '50%',
  top: -9,
  paddingHorizontal: 8,
  backgroundColor: Colors.blueBackgroundSession,
});

const DateItem = ({text, extra = 'default'}) => {
  const {width} = useWindowDimensions();

  return (
    <DayWrapper>
      <Day
        style={{
          transform: [{translateX: extra === 'default' ? -(width * 0.14) : -(width * 0.1)}],
        }}>
        <DayText>{text}</DayText>
      </Day>
    </DayWrapper>
  );
};

export default DateItem;
