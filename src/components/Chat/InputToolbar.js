import React from 'react';
import {StyleSheet} from 'react-native';
import {InputToolbar} from 'react-native-gifted-chat';
import Colors from 'src/constants/Colors';

const styles = StyleSheet.create({
  inputStyles: {
    backgroundColor: Colors.backgroundSearchBar,
    borderRadius: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 10,
  },
});

export const InputToolbarCustom = React.forwardRef((props, ref) => (
  <InputToolbar {...props} isKeyboardInternallyHandlsed multilines ref={ref} containerStyle={styles.inputStyles} />
));
