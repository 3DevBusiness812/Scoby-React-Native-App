/* eslint-disable no-use-before-define */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from 'src/constants/Colors';

const RenderSend = ({props, onSend, clearInput}) => {
  const {text, messageIdGenerator, user} = props;

  const handleSend = () => {
    if (text && onSend) {
      const sendData = {text: text.trim(), user, _id: messageIdGenerator()};
      onSend(sendData, true);
      clearInput();
    }
  };

  return (
    <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
      <Text style={{color: text.length > 0 ? Colors.white : 'transparent'}}>Send</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sendBtn: {paddingHorizontal: 15, paddingBottom: 18},
});

export default RenderSend;
