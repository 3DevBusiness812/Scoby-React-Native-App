import React from 'react';
import {View, TouchableOpacity, Text, Platform, ActivityIndicator} from 'react-native';
import styled from 'styled-components';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

const LoadingContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

export default class CheckboxForm extends React.Component {
  state = {
    checkedTopics: [],
  };

  componentDidMount() {
    const {user, selectedTopics} = this.props;
    if (user) {
      if (user.data) {
        let data = user.data.getUserProfile.topics;

        if (Array.isArray(data)) {
          data = data.map((i) => i.id);
          this.setState({checkedTopics: data});
        }
      }
    }
    if (selectedTopics) {
      this.setState({checkedTopics: selectedTopics});
    }
  }

  getTopics = () => this.state.checkedTopics;

  enableSaveButton() {
    if (!this.state.checkedTopics.length) {
      this.props.setDisableTopic(true);
    } else {
      this.props.setDisableTopic(false);
    }
  }

  setTopic(id) {
    const {checkedTopics} = this.state;
    const {setDisableTopic, setTopicCurrent} = this.props;
    if (checkedTopics.includes(id)) {
      const topics = [];
      // eslint-disable-next-line array-callback-return
      checkedTopics.map((i) => {
        if (i !== id) {
          topics.push(i);
        }
      });

      this.setState({checkedTopics: topics}, () => {
        if (setTopicCurrent) {
          setTopicCurrent(JSON.stringify(this.state.checkedTopics));
        }

        if (setDisableTopic) {
          this.enableSaveButton();
        }
      });
    } else {
      this.setState({checkedTopics: [...checkedTopics, id]}, () => {
        if (setTopicCurrent) {
          setTopicCurrent(JSON.stringify(this.state.checkedTopics));
        }

        if (setDisableTopic) {
          this.enableSaveButton();
        }
      });
    }
  }

  render() {
    const {checkedTopics} = this.state;
    const {data} = this.props;

    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          backgroundColor: `${this.props.background_color}`,
        }}>
        {data ? (
          data.getTopics.map((checkbox) => (
            <TouchableOpacity
              key={checkbox.id}
              disabled={
                this.props.disabledTouch &&
                checkedTopics.length > 0 &&
                // eslint-disable-next-line eqeqeq
                checkedTopics.find((e) => e == checkbox.id) == undefined
              }
              onPress={() => this.setTopic(checkbox.id)}
              style={[
                {
                  marginVertical: 8,
                  marginRight: 16,
                  borderWidth: 1,
                  borderRadius: 8,
                  flexDirection: 'row',
                  borderColor: 'black' || Colors.borderGrey,
                },
                checkedTopics.includes(checkbox.id)
                  ? {backgroundColor: Colors.purple}
                  : {borderColor: Colors.borderGrey},
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
                  ...Fonts.avenir,
                  padding: Platform.OS === 'ios' ? 12 : 10,
                  paddingLeft: 8,
                  fontSize: 14,
                  color: `${this.props.textBoxColor}`,
                }}>
                {checkbox.name}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <LoadingContainer>
            <ActivityIndicator color={Colors.white} size="large" />
          </LoadingContainer>
        )}
      </View>
    );
  }
}
