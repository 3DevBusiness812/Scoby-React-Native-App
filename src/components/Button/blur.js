import React from 'react';
import styled from 'styled-components/native';

const Button = styled.TouchableOpacity`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 120px;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
`;

const Container = styled.View(() => ({
  width: 40,
  height: 61,
}));

const Text = styled.Text(() => ({
  color: 'white',
  textAlign: 'center',
}));

export default function BlurBtn({event, ico, text, activeOpacity, disabled}) {
  return (
    <Container>
      <Button disabled={disabled} activeOpacity={activeOpacity || 0.5} onPress={event || (() => {})}>
        {/* <Icon source={ico} /> */}
        {ico || null}
      </Button>
      {text ? <Text>{text}</Text> : null}
    </Container>
  );
}
