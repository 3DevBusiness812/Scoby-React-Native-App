/* eslint-disable */
import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import Fonts from 'src/constants/Fonts';

export default class CheckboxForm extends React.Component {
  state = {
    checkedTopics: [],
  };

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      if (user.data) {
        let data = user.data.getUserProfile.topics;

        if (Array.isArray(data)) {
          data = data.map((i) => i.id);
          this.setState({ checkedTopics: data });
        }
      }
    }
  }

  getTopics = () => {
    return this.state.checkedTopics;
  };

  enavleButtonSave() {
    if (!this.state.checkedTopics.length) {
      this.props.setDisableTopic(true);
    } else {
      this.props.setDisableTopic(false);
    }
  }

  setTopic(id) {
    const { checkedTopics } = this.state;
    const { setDisableTopic, setTopicCurrent } = this.props;
    if (checkedTopics.includes(id)) {
      const topics = [];
      // eslint-disable-next-line array-callback-return
      checkedTopics.map((i) => {
        if (i !== id) {
          topics.push(i);
        }
      });

      this.setState({ checkedTopics: topics }, () => {
        if (setTopicCurrent) {
          setTopicCurrent(JSON.stringify(this.state.checkedTopics));
        }

        if (setDisableTopic) {
          this.enavleButtonSave();
        }
      });
    } else {
      this.setState({ checkedTopics: [ ...checkedTopics, id ] }, () => {
        if (setTopicCurrent) {
          setTopicCurrent(JSON.stringify(this.state.checkedTopics));
        }

        if (setDisableTopic) {
          this.enavleButtonSave();
        }
      });
    }
  }

  render() {
    const { checkedTopics } = this.state;
    const { data } = this.props;

    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: Platform.OS === 'ios' ? 120 : 150,
          backgroundColor: `${this.props.background_color}`,
        }}>
        {data
          ? data.getTopics.map((checkbox) => (
              <TouchableOpacity
              key={checkbox.id}
              disabled={
                this.props.disabledTouch &&
                checkedTopics.length > 0 &&
                checkedTopics.find(e => e == checkbox.id) == undefined
              }
              onPress={() => this.setTopic(checkbox.id)}
              style={[
                {
                  marginLeft: Platform.OS === 'ios' ? 16 : 14,
                  marginVertical: 8,
                  borderWidth: 1,
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'row',
                  width: 'auto',
                },
                checkedTopics.includes(checkbox.id) ? { backgroundColor: '#6536BB' } : { borderColor: '#E5EAF2' },
              ]}>
              <View
                style={{
                  padding: Platform.OS === 'ios' ? 12 : 8,
                  paddingRight: 0,
                }}>
                <Text>{checkbox.icon ? checkbox.icon : ''}</Text>
              </View>
              <Text
                style={{
                  padding: Platform.OS === 'ios' ? 12 : 8,
                  ...Fonts.avenir,
                  fontSize: 14,
                  color: `${this.props.textBoxColor}`,
                }}>
                {checkbox.name}
              </Text>
            </TouchableOpacity>
          ))
          : null}
      </View>
    );
  }
}
