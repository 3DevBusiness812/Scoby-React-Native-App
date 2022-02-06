/* eslint-disable no-use-before-define */
import React from 'react';
import Colors from 'src/constants/Colors';
import TriangleDown from 'assets/svg/triangledown.svg';

import styled from 'styled-components';
import Fonts from 'src/constants/Fonts';
import {StyleSheet} from 'react-native';

const Wrapper = styled.View({backgroundColor: Colors.white, width: '100%', borderRadius: 8});

const HeaderWrapper = styled.TouchableOpacity({
  paddingHorizontal: 14,
  paddingVertical: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const ContentItemLabel = styled.Text({...Fonts.avenirBold, fontSize: 16, color: Colors.blueBackgroundSession});

const ContentItemDesc = styled.Text({...Fonts.avenir, fontSize: 16, color: Colors.blueBackgroundSession});

const ContentWrapper = styled.View({paddingHorizontal: 12, paddingVertical: 12});

const ContentItem = styled.TouchableOpacity({
  width: '100%',
  backgroundColor: Colors.white,
  paddingHorizontal: 8,
  paddingVertical: 12,
  marginVertical: 2,
  borderRadius: 8,
});

const HeaderText = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 20,
  color: Colors.blueBackgroundSession,
});

const Dropdown = ({open, setOpen, items, value, setValue}) => {
  const toggleOpen = () => setOpen((prev) => !prev);

  const handleOnPress = (item) => {
    toggleOpen();
    setValue(item);
  };

  const renderItem = (item) => (
    <ContentItem
      key={item.label}
      onPress={() => handleOnPress(item)}
      style={item.label === value.label && styles.currentValue}>
      <ContentItemLabel>{item.label}</ContentItemLabel>
      <ContentItemDesc>{item.desc}</ContentItemDesc>
    </ContentItem>
  );

  return (
    <Wrapper>
      <HeaderWrapper onPress={toggleOpen}>
        <HeaderText>{value?.label}</HeaderText>
        <TriangleDown />
      </HeaderWrapper>
      {open && <ContentWrapper>{items?.map(renderItem)}</ContentWrapper>}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  currentValue: {backgroundColor: Colors.cutePurple},
});

export default Dropdown;
