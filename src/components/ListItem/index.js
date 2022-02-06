import React from 'react';
import styled from 'styled-components/native';
import colors from 'src/constants/Colors';

export default function ListItem({left, center, right, leftStyle, centerStyle, rightStyle, rowStyle, color}) {
  const Wrapper = styled.View((props) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: props.color ? props.color : colors.white,
    ...props.style,
  }));

  const Box = styled.View((props) => ({
    ...props.style,
  }));

  return (
    <Wrapper style={rowStyle} color={color}>
      <Box style={leftStyle}>{left || null}</Box>
      <Box style={centerStyle}>{center || null}</Box>
      <Box style={rightStyle}>{right || null}</Box>
    </Wrapper>
  );
}
