/* eslint-disable no-use-before-define */
// /* eslint-disable no-use-before-define */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {timeStamp} from 'src/utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import useExtraStylesChatBubles from 'src/utils/hook/useExtraStylesChatBubles';

const Bubble = ({currentMessage, previousMessage, nextMessage}) => {
  const {user, text} = currentMessage;
  const {_id: id} = user;

  const {result} = useExtraStylesChatBubles(currentMessage, previousMessage, nextMessage, id);

  return (
    <LinearGradient
      style={[styles.gradient, result]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={
        id === 2 ? [Colors.chatGradientStart, Colors.chatGradientEnd] : [Colors.purple, Colors.chatGradientStart]
      }>
      <TouchableOpacity style={styles.bubble}>
        {id === 1 && <Text style={styles.timestamp}>{timeStamp(currentMessage)}</Text>}
        <Text style={[styles.text]}>{text?.trim()}</Text>
        {id === 2 && <Text style={styles.timestamp}>{timeStamp(currentMessage)}</Text>}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {borderRadius: 8, marginVertical: 2, opacity: 0.9},
  bubble: {
    backgroundColor: Colors.transparent,
    paddingVertical: 15,
    paddingHorizontal: 8,
    maxWidth: 280,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {color: Colors.white, ...Fonts.avenirSemiBold, fontSize: 14, marginBottom: 2, maxWidth: '85%'},
  textLeft: {marginRight: -5},
  textRight: {marginLeft: -5},
  timestamp: {color: Colors.white, opacity: 0.9, ...Fonts.avenir, fontSize: 8, marginBottom: -8, alignSelf: 'flex-end'},
});

export default Bubble;
