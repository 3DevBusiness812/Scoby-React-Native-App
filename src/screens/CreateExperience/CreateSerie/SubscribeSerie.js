import React, {useCallback, useState} from 'react';
import {StyleSheet, View, TextInput, SafeAreaView, Linking} from 'react-native';
import styled from 'styled-components/native';
import Colors from 'src/constants/Colors';
import NewLargeButton from 'src/components/NewLargeButton';
import withSafeArea from 'src/components/withSafeArea';
import Fonts from 'src/constants/Fonts';
import {
  SCOBY_ACADEMY,
  SERIES_CALENDAR_SUBTITLE,
  SERIE_LEARN_MORE,
  SERIE_PROMPT_TEXT,
  SERIE_TRY_AGAIN,
  TITLE_NAME_SERIES,
} from 'src/constants/Texts';
import {Wrong, Check} from 'assets/svg';
import {useMutation} from '@apollo/client';
import {KARTRA_VERIFY_LEAD_CALENDAR} from 'src/graphql/mutations/serie';
import PromptModal from 'src/components/Modal/PromptModal';

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
  marginTop: 30,
});

const SubTitle = styled.Text(({experience = 16}) => ({
  marginTop: 20,
  ...Fonts.avenir,
  fontSize: experience,
  color: Colors.white,
}));

const SubscribeSerie = ({navigation, route}) => {
  const {Schedule, serie} = route.params;
  const [CalendarName, setCalendarName] = useState(serie?.calendarName);
  const [ClassName, setClassName] = useState(serie?.className);
  const [correct, setCorrect] = useState('none');
  const [modalVisible, setModalVisible] = useState(false);

  const cleanFields = () => {
    setCalendarName('');
    setClassName('');
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
      borderBottomColor: Colors.greySession,
      borderRadius: 10,
      borderBottomWidth: 0.5,
      marginVertical: 15,
    },
    inputCalendar: {
      width: '85%',
      marginVertical: 0,
    },
    inputCalendarContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      backgroundColor: Colors.white,
      borderRadius: 10,
      marginBottom: 16,
    },
    inputCheck: {
      width: 30,
      height: 30,
    },
  });

  const handleGoToTopics = () => {
    let {params} = route;
    params = {...params, CalendarName, ClassName, Schedule};
    navigation.navigate('SerieName', {
      ...params,
    });
  };

  const [kartraSubscribe] = useMutation(KARTRA_VERIFY_LEAD_CALENDAR, {
    variables: {
      className: ClassName,
      nameCalendar: CalendarName,
    },
    onError() {
      setCorrect(false);
      setModalVisible(true);
    },
    onCompleted() {
      setCorrect(true);
      setTimeout(handleGoToTopics, 1000);
    },
  });

  const goHandleToNextStep=()=>{
    if(CalendarName && ClassName){
      kartraSubscribe()
    }else{
      handleGoToTopics()
    }
  }

  const setCheckMark = useCallback(() => {
    if (correct === true) {
      return <Check />;
    }
    if (correct === false) {
      return <Wrong />;
    }
  }, [correct]);

  return (
    <Wrapper>
      <PromptModal
        visible={modalVisible}
        setVisible={setModalVisible}
        text={SERIE_PROMPT_TEXT}
        leftButtonText={SERIE_TRY_AGAIN}
        rightButtonText={SERIE_LEARN_MORE}
        onLeftButtonPress={() => {
          setModalVisible(false);
        }}
        onRightButtonPress={() => {
          setModalVisible(false);
          Linking.openURL(SCOBY_ACADEMY);
        }}
      />
      <TitleText>{TITLE_NAME_SERIES}</TitleText>
      <SubTitle>{SERIES_CALENDAR_SUBTITLE}</SubTitle>
      <MainContent>
        <View style={styles.inputCalendarContainer}>
          <TextInput
            style={[styles.input, styles.inputCalendar]}
            onChangeText={setCalendarName}
            value={CalendarName}
            placeholder="Calendar Name"
            returnKeyType="done"
            placeholderTextColor={Colors.greySession}
            maxLength={40}
          />
          <View style={styles.inputCheck}>{setCheckMark()}</View>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={setClassName}
          value={ClassName}
          placeholder="Class Name"
          placeholderTextColor={Colors.greySession}
          maxLength={40}
          returnKeyType="done"
        />
      </MainContent>
      <ButtonContainer>
        <NewLargeButton title="Cancel" transparent onPress={() => cleanFields()} flex />
        <NewLargeButton flex title="Next"  onPress={goHandleToNextStep} />
      </ButtonContainer>
    </Wrapper>
  );
};

export default withSafeArea(SubscribeSerie);
