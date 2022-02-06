import React, {useState} from 'react';
import {StyleSheet, View, TextInput, Text, SafeAreaView} from 'react-native';
import styled from 'styled-components/native';
import Colors from 'src/constants/Colors';
import {SERIES_NAME_SUBTITLE, TITLE_NAME_SESSION} from 'src/constants/Texts';
import NewLargeButton from 'src/components/NewLargeButton';
import withSafeArea from 'src/components/withSafeArea';
import Fonts from 'src/constants/Fonts';

const Wrapper = styled(SafeAreaView)({
  marginTop: '20%',
  flexDirection: 'column',
  backgroundColor: Colors.blueBackgroundSession,
  marginHorizontal: 24,
});

const TitleText = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  lineHeight: '32px',
  color: Colors.white,
});

const ButtonContainer = styled.View({
  flexDirection: 'row',
});

const MainContent = styled.View({
  flexDirection: 'column',
  marginTop: 15,
});

const SubTitle = styled.Text(({experience = 16}) => ({
  marginTop: 20,
  ...Fonts.avenir,
  fontSize: experience,
  color: Colors.white,
  lineHeight: '23px',
}));

const NameSerie = ({navigation, route}) => {
  const {series} = route.params;

  const [NameCounter, setNameCounter] = useState(0);
  const [Name, setName] = useState(series?.seriesName);
  const [DescriptionCounter, setDescriptionCounter] = useState(0);
  const [Description, setDescription] = useState(series?.description);

  const inputTextUpdate = (name, updateText, updateCounter, text, counter) => {
    const nameInput = name || '';
    updateText(nameInput);
    if (text && text.length > nameInput.length) {
      if (counter > 0) {
        updateCounter(name.length);
      }
    } else if (text && text.length < nameInput.length) {
      updateCounter(name.length);
    } else {
      updateCounter(0);
    }
  };

  const cleanFields = () => {
    setNameCounter(0);
    setName('');
    setDescriptionCounter(0);
    setDescription('');
    navigation.reset({
      index: 0,
      routes: [{name: 'MainTabs', screen: 'Home'}],
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    input: {
      ...Fonts.avenir,
      padding: 16,
      color: Colors.black,
      backgroundColor: Colors.white,
      borderRadius: 10,
      borderBottomColor: Colors.greySession,
      borderBottomWidth: 0.5,
      marginBottom: 24,
    },
    inputDescription: {
      ...Fonts.avenir,
      padding: 16,
      paddingTop: 16,
      minHeight: 96,
      color: Colors.black,
      backgroundColor: Colors.white,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomColor: Colors.greySession,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    textViewStyle: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: Colors.white,
    },
    textStyle: {
      ...Fonts.avenir,
      color: Colors.greySession,
      textAlign: 'right',
      padding: 8,
    },
  });

  /* const handleGoToPrice = () => {
    let {params} = route;
    params = {...params, Description, Name, experience: 'serie'};
    navigation.navigate('PriceSerie', {
      ...params,
    });
  }; */

  const handleGoToTopics = () => {
    let {params} = route;
    params = {...params, Description, Name, experience: 'serie'};
    navigation.navigate('SelectTopics', {
      ...params,
    });
  };

  const handleGoToNextStep = () => {
    /* if (series) { */
    handleGoToTopics();
    /* } else {
      handleGoToPrice();
    } */
  };

  return (
    <Wrapper>
      <TitleText>{TITLE_NAME_SESSION}</TitleText>
      <SubTitle>{SERIES_NAME_SUBTITLE}</SubTitle>
      <MainContent>
        <TextInput
          style={styles.input}
          onChangeText={(e) => inputTextUpdate(e, setName, setNameCounter, Name, NameCounter)}
          value={Name}
          placeholder="Series Name"
          returnKeyType="done"
          placeholderTextColor={Colors.greySession}
          maxLength={40}
        />
        <TextInput
          style={styles.inputDescription}
          onChangeText={(e) =>
            inputTextUpdate(e, setDescription, setDescriptionCounter, Description, DescriptionCounter)
          }
          value={Description}
          placeholder="Description"
          placeholderTextColor={Colors.greySession}
          maxLength={140}
          multiline
          returnKeyType="done"
          textAlignVertical="top"
          numberOfLines={5}
          blurOnSubmit
        />
        <View style={styles.textViewStyle}>
          <Text style={styles.textStyle}>{`${DescriptionCounter}/140`}</Text>
        </View>
      </MainContent>
      <ButtonContainer>
        <NewLargeButton title="Cancel" transparent onPress={() => cleanFields()} flex />
        <NewLargeButton flex title="Next" disabled={!(Name && Description)} onPress={handleGoToNextStep} />
      </ButtonContainer>
    </Wrapper>
  );
};

export default withSafeArea(NameSerie);
