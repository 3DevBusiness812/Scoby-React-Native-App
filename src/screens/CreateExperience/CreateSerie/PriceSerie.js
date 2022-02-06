import React, {useState} from 'react';
import {SafeAreaView, TextInput} from 'react-native';
import styled from 'styled-components';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {TITLE_PRICE_SERIE, SERIES_PRICE_SUBTITLE} from 'src/constants/Texts';
import CommonSwitch from 'src/components/Switch';
import TriangleDown from 'assets/svg/triangledown-white.svg';
import Dolar from 'assets/svg/Dolar_SVG.svg';
import Solana from 'assets/svg/Solana_SVG.svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import NewLargeButton from 'src/components/NewLargeButton';

const Wrapper = styled(SafeAreaView)({
  flex: 1,
  marginTop: '20%',
  alignItems: 'center',
  flexDirection: 'column',
  backgroundColor: Colors.blueBackgroundSession,
});

const TitleText = styled.Text({
  ...Fonts.goudy,
  fontSize: 28,
  lineHeight: '32px',
  color: Colors.white,
});

const SubTitle = styled.Text(({experience = 16}) => ({
  marginTop: 20,
  ...Fonts.avenir,
  fontSize: experience,
  color: Colors.white,
  lineHeight: '23px',
  marginHorizontal: 20,
}));

const BoldText = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 14,
  color: Colors.white,
  width: '55%',
  marginRight: 30,
});

const RowSwitch = styled.View({
  width: '100%',
  paddingHorizontal: '10%',
  flexDirection: 'row',
  marginTop: 15,
  marginBottom: 5,
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottomColor: `${Colors.white}fff35`,
  borderBottomWidth: 1,
  paddingVertical: 15,
});

const SimpleText = styled.Text({
  ...Fonts.avenir,
  fontSize: 11,
  color: Colors.white,
  lineHeight: '15px',
  marginBottom: 5,
});

const SimpleTextCoin = styled.Text({
  ...Fonts.avenir,
  fontSize: 11,
  color: Colors.white,
  marginVertical: 10,
});

const RowView = styled.View({
  width: '90%',
  flexDirection: 'row',
  marginVertical: 30,
  alignItems: 'center',
});

const ContainerPrice = styled.View({
  flexDirection: 'column',
  width: '90%',
  flex: 1,
});

const ContainerPriceInput = styled.View({
  flexDirection: 'column',
  width: '25%',
  justifyContent: 'center',
  alignItems: 'center',
});

const ContainerDate = styled.TouchableOpacity({
  borderColor: `${Colors.white}fffaa`,
  flexDirection: 'row',
  borderWidth: 1,
  width: '40%',
  borderRadius: 10,
  height: 35,
  paddingHorizontal: 10,
  backgroundColor: `${Colors.white}fff35`,
  justifyContent: 'space-between',
  alignItems: 'center',
});

const PlaceholderDate = styled.Text(({color}) => ({
  color,
  fontSize: 11,
}));

const ButtonContainer = styled.View({
  flexDirection: 'row',
  width: '90%',
  flex: 0.1,
  alignItems: 'flex-end',
});

const Scroll = styled.ScrollView({
  flex: 1,
  marginBottom: 50,
});

const IconCoin = styled.View({
  flexDirection: 'row',
  marginBottom: 5,
});

const PriceSerie = ({navigation, route}) => {
  const [isFree, setIsFree] = useState();
  const [date, setDate] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const {params} = route;
  return (
    <Wrapper>
      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={(data) => {
          setDate(moment(data).format('MM/DD/YYYY'));
          setIsVisible(false);
        }}
        onCancel={() => {}}
        date={new Date(Date.now())}
        onHide={() => setIsVisible(false)}
      />
      <TitleText>{TITLE_PRICE_SERIE}</TitleText>
      <SubTitle>{SERIES_PRICE_SUBTITLE}</SubTitle>
      <RowSwitch>
        <BoldText>For Free</BoldText>
        <CommonSwitch setValue={setIsFree} value={isFree} />
      </RowSwitch>
      <Scroll>
        {!isFree && (
          <ContainerPrice>
            <RowView>
              <BoldText>Start Date</BoldText>
              <ContainerDate onPress={() => setIsVisible(true)}>
                {!date ? (
                  <PlaceholderDate color={`${Colors.white}fffaa`}>mm/dd/yyyy</PlaceholderDate>
                ) : (
                  <PlaceholderDate color={Colors.white}>{date}</PlaceholderDate>
                )}
                <TriangleDown />
              </ContainerDate>
            </RowView>
            <RowView>
              <BoldText>
                {`Number of Weeks \n\n`}
                <SimpleText>How many weeks are included in the Program offering at this price?</SimpleText>
              </BoldText>
              <TextInput
                style={{
                  borderColor: `${Colors.white}fffaa`,
                  borderWidth: 1,
                  width: '30%',
                  borderRadius: 10,
                  height: 35,
                  paddingHorizontal: 10,
                  backgroundColor: `${Colors.white}fff35`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 11,
                  color: Colors.white,
                }}
                keyboardType="numeric"
              />
            </RowView>
            <RowView>
              <BoldText>
                {`Price \n\n`}
                <SimpleText>How much wilI you charge for the entire Program?</SimpleText>
              </BoldText>
              <ContainerPriceInput>
                <IconCoin>
                  <SimpleText>SOL</SimpleText>
                  <Solana style={{marginLeft: 5}} />
                </IconCoin>
                <TextInput
                  keyboardType="numeric"
                  placeholder="SOL"
                  style={{
                    borderColor: `${Colors.white}fffaa`,
                    borderWidth: 1,
                    width: '90%',
                    borderRadius: 10,
                    height: 35,
                    paddingHorizontal: 10,
                    backgroundColor: `${Colors.white}fff35`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 11,
                    color: Colors.white,
                  }}
                />
              </ContainerPriceInput>
              <ContainerPriceInput>
                <IconCoin>
                  <SimpleText>USD</SimpleText>
                  <Dolar style={{marginLeft: 5}} />
                </IconCoin>
                <SimpleTextCoin>$000</SimpleTextCoin>
              </ContainerPriceInput>
            </RowView>
          </ContainerPrice>
        )}
      </Scroll>
      <ButtonContainer>
        <NewLargeButton
          title="Cancel"
          transparent
          onPress={() => {
            navigation.goBack();
          }}
          flex
        />
        <NewLargeButton
          flex
          title="Next"
          onPress={() => {
            navigation.navigate('SelectTopics', {...params});
          }}
        />
      </ButtonContainer>
    </Wrapper>
  );
};

export default PriceSerie;
