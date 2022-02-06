import React from 'react';
import styled from 'styled-components/native';

const ExternalCircle = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  background-color: rgba(210, 0, 125, 0.5);
  top: ${(props) => props.top}px;
  right: ${(props) => props.right}px;
  padding: 0;
  z-index: 10;
`;

const InnerCircle = styled.View`
  justify-content: center;
  align-items: center;
  width: ${(props) => props.size - 6}px;
  height: ${(props) => props.size - 6}px;
  border-radius: ${(props) => props.size / 2}px;
  background-color: #d2007d;
`;

const Text = styled.Text({
  fontSize: 10,
  color: 'white',
});

function circle({size, top = 0, right = 0, text = ''}) {
  return (
    <ExternalCircle size={size} top={top} right={right}>
      <InnerCircle size={size}>
        <Text>{text}</Text>
      </InnerCircle>
    </ExternalCircle>
  );
}

export default circle;
