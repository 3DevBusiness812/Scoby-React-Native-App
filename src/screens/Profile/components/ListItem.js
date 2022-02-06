import React from 'react';
import {Text, StyleSheet} from 'react-native';
import styled from 'styled-components';
import arrowIcon from 'assets/images/profile/arrowRightIcon.png';
import colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

const ListItemWrapper = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 16,
});

const ListItemTitle = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  color: colors.white,
});

const Label = styled.View({
  minWidth: 128,
});

const Button = styled.View({
  marginLeft: 16,
});

const ArrowIcon = styled.Image({});

const Right = styled.View({
  flex: 2,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

const styles = StyleSheet.create({
  text: {
    ...Fonts.avenir,
    fontSize: 16,
    color: colors.regularText,
  },
});

const ListItem = ({title, onPress, value}) => {
  const listValue = value || 'Tap to specify';

  return (
    <ListItemWrapper onPress={onPress}>
      <Label>
        <ListItemTitle>{title}</ListItemTitle>
      </Label>
      <Right>
        <Text numberOfLines={1} style={styles.text}>
          {listValue}
        </Text>
        <Button>
          <ArrowIcon source={arrowIcon} />
        </Button>
      </Right>
    </ListItemWrapper>
  );
};

export default ListItem;
