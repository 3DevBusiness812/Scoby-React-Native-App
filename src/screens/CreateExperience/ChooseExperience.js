import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, Linking} from 'react-native';
import withSafeArea from 'src/components/withSafeArea';
import styled from 'styled-components';
import {
  TITLE_CHOISE_EXPERIENCE,
  SUBTITLE_CHOISE_EXPERIENCE,
  CADENCE_EVENT,
  CADENCE_EVENT_SUBTITLE,
  CADENCE_SERIES,
  CADENCE_SERIES_SUBTITLE,
  CADENCE_SESSION,
  CADENCE_SESSION_SUBTITLE,
  CREATOR_PROMPT_TEXT,
  CREATOR_APPLY_NOW,
  CREATOR_HOST_SESSION,
  SCOBY_PLUS,
} from 'src/constants/Texts';
import Fonts from 'src/constants/Fonts';
import colors from 'src/constants/Colors';
import {Event, Serie, Session} from 'assets/svg';
import Button from 'src/components/NewLargeButton';
import PromptModal from 'src/components/Modal/PromptModal';

const Style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '7%',
  },
  icons: {
    width: 120,
    height: 120,
  },
  mainContainer: {
    width: '100%',
    height: '100%',
  },
});

const Title = styled.Text({
  ...Fonts.goudy,
  lineHeight: '32px',
  fontSize: 28,
  color: colors.white,
  marginTop: '10%',
  width: '100%',
});

const SubTitle = styled.Text(({experience = 16}) => ({
  marginTop: 10,
  ...Fonts.avenir,
  fontSize: experience,
  color: colors.white,
}));

const CadenceTitle = styled.Text(({experience = 20}) => ({
  ...Fonts.avenirBold,
  fontSize: experience,
  color: colors.white,
}));

const Cadence = styled.TouchableOpacity(({type}) => ({
  height: 160,
  borderBottomColor: colors.borderGrey,
  borderBottomWidth: type === 'middle' ? 1 : 0,
  borderTopColor: colors.borderGrey,
  borderTopWidth: type === 'middle' ? 1 : 0,
  justifyContent: 'center',
}));

const CadenceTextDirection = styled.View({
  flexDirection: 'column',
  width: '58%',
});

const ButtonContainer = styled.View({
  flexDirection: 'row',
  paddingHorizontal: '7%',
});

const ContainerSelected = styled.View(({state}) => ({
  backgroundColor: state ? colors.primaryPurpleColor : colors.blueBackgroundSession,
  borderRadius: 20,
  paddingHorizontal: 5,
  paddingVertical: 5,
  width: '100%',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-around',
}));

const ChooseExperienceSession = ({navigation}) => {
  const [experience, setExperience] = useState('');
  const {unTitleWeight, titleWeight} = {unTitleWeight: 20, titleWeight: 23};
  const {unSubTitleWeight, subTitleWeight} = {unSubTitleWeight: 16, subTitleWeight: 18};
  const [modalVisible, setModalVisible] = useState(false);

  const handlerToNameSession = () => {
    if (experience === 'EventName') {
      return setModalVisible(true);
    }
    navigation.navigate(experience, {
      experience,
    });
  };

  return (
    <View style={Style.mainContainer}>
      <PromptModal
        visible={modalVisible}
        setVisible={setModalVisible}
        text={CREATOR_PROMPT_TEXT}
        leftButtonText={CREATOR_HOST_SESSION}
        rightButtonText={CREATOR_APPLY_NOW}
        onLeftButtonPress={async () => {
          setModalVisible(false);
          navigation.navigate('SessionName');
        }}
        onRightButtonPress={() => {
          setModalVisible(false);
          Linking.openURL(SCOBY_PLUS);
        }}
      />
      <ScrollView style={Style.container}>
        <Title>{TITLE_CHOISE_EXPERIENCE}</Title>
        <SubTitle>{SUBTITLE_CHOISE_EXPERIENCE}</SubTitle>
        <Cadence
          onPress={() => {
            setExperience('SessionName');
          }}>
          <ContainerSelected state={experience === 'SessionName'}>
            <Session style={Style.icons} />
            <CadenceTextDirection>
              <CadenceTitle experience={experience === 'SessionName' ? titleWeight : unTitleWeight}>
                {CADENCE_SESSION}
              </CadenceTitle>
              <SubTitle experience={experience === 'SessionName' ? subTitleWeight : unSubTitleWeight}>
                {CADENCE_SESSION_SUBTITLE}
              </SubTitle>
            </CadenceTextDirection>
          </ContainerSelected>
        </Cadence>
        <Cadence
          type="middle"
          onPress={() => {
            setExperience('EventName');
          }}>
          <ContainerSelected state={experience === 'EventName'}>
            <Event style={Style.icons} />
            <CadenceTextDirection>
              <CadenceTitle experience={experience === 'EventName' ? titleWeight : unTitleWeight}>
                {CADENCE_EVENT}
              </CadenceTitle>
              <SubTitle experience={experience === 'EventName' ? subTitleWeight : unSubTitleWeight}>
                {CADENCE_EVENT_SUBTITLE}
              </SubTitle>
            </CadenceTextDirection>
          </ContainerSelected>
        </Cadence>
        <Cadence
          onPress={() => {
            setExperience('ScheduleSerie');
          }}>
          <ContainerSelected state={experience === 'ScheduleSerie'}>
            <Serie style={Style.icons} />
            <CadenceTextDirection>
              <CadenceTitle experience={experience === 'ScheduleSerie' ? titleWeight : unTitleWeight}>
                {CADENCE_SERIES}
              </CadenceTitle>
              <SubTitle experience={experience === 'ScheduleSerie' ? subTitleWeight : unSubTitleWeight}>
                {CADENCE_SERIES_SUBTITLE}
              </SubTitle>
            </CadenceTextDirection>
          </ContainerSelected>
        </Cadence>
      </ScrollView>
      <ButtonContainer>
        <Button
          title="Back"
          flex
          transparent
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button onPress={handlerToNameSession} flex title="Next" disabled={experience === ''} />
      </ButtonContainer>
    </View>
  );
};

export default withSafeArea(ChooseExperienceSession);
