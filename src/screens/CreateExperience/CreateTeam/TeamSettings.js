/* eslint-disable no-use-before-define */
import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Dropdown from 'src/components/Dropdown';
import CommonSwitch from 'src/components/Switch';
import withSafeArea from 'src/components/withSafeArea';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {
  TEAM_SETTINGS_ALLOW_HOST,
  TEAM_SETTINGS_ALLOW_INVITE,
  TEAM_SETTINGS_PRIVATE_DESC,
  TEAM_SETTINGS_PUBLIC_DESC,
  TEAM_SETTINGS_SECRET_DESC,
  TEAM_SETTINGS_SUBTITLE,
  TEAM_SETTINGS_TITLE,
} from 'src/constants/Texts';
import styled from 'styled-components';
import {useMutation} from '@apollo/client';
import {UPDATE_TEAM} from 'src/graphql/mutations/team';
import useDebouncedEffect from 'src/utils/hook/useDebouncedEffect';
import TeamSettingsModal from './TeamSettingsModal';

const Wrapper = styled.View({
  flex: 1,
  flexGrow: 1,
  paddingHorizontal: 26,
  paddingTop: 24,
  height: '100%',
});

const ScrollableContent = styled.ScrollView({marginBottom: 80});

const Title = styled.Text({...Fonts.goudy, fontSize: 32, lineHeight: '32px', color: Colors.white, alignSelf: 'center'});

const ParamsWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const ContentWrapper = styled.View({
  marginBottom: 24,
});

const ParamsText = styled.Text({
  color: Colors.white,
  width: '60%',
  fontSize: 18,
  ...Fonts.avenirBold,
  paddingVertical: 14,
});

const SubTitle = styled.Text({
  ...Fonts.avenirSemiBold,
  fontSize: 16,
  color: Colors.white,
  paddingVertical: 26,
  marginBottom: 14,
  alignSelf: 'center',
});

const TeamActionsWrapper = styled.View({
  paddingTop: 66,
});

const Buttons = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 20,
  alignSelf: 'center',
  position: 'absolute',
  bottom: 25,
});

const Button = styled.TouchableOpacity({
  width: '40%',
  height: 55,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
});

const ButtonSingle = styled.TouchableOpacity({
  width: '40%',
  height: 55,
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',
  position: 'absolute',
  bottom: 25,
  justifyContent: 'center',
  borderRadius: 12,
  backgroundColor: Colors.newPink,
});

const ITEMS = [
  {label: 'Private', desc: TEAM_SETTINGS_PRIVATE_DESC},
  {label: 'Public', desc: TEAM_SETTINGS_PUBLIC_DESC},
  {label: 'Secret', desc: TEAM_SETTINGS_SECRET_DESC},
];

const ButtonText = styled.Text({...Fonts.avenir, fontSize: 16, color: Colors.grey});

const TeamSettings = ({route}) => {
  const [isAllowToInvite, setIsAllowToInvite] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAllowToHost, setIsAllowToHost] = useState(false);
  const [open, setOpen] = useState(false);
  const [items] = useState(() => ITEMS);
  const [value, setValue] = useState(() => items[0]);

  const {
    params: {sessionParams, team = null},
  } = route;

  const navigator = useNavigation();

  const [updateTeam] = useMutation(UPDATE_TEAM);

  const onMutate = () => {
    if (!team) return;
    const updateTeamPayload = {
      membersAllowedToHost: isAllowToHost,
      membersAllowedToInvite: isAllowToInvite,
      teamType: value.label,
      teamId: team?.id,
    };

    updateTeam({variables: {updateTeamPayload}});
  };

  useDebouncedEffect(onMutate, [isAllowToInvite, isAllowToHost, value], 800);

  useEffect(() => {
    if (team) {
      setIsAllowToHost(team.membersAllowedToHost);
      setIsAllowToInvite(team.membersAllowedToInvite);
      const teamTypeIdx = ITEMS.findIndex((item) => item.label === team.teamType);
      setValue(items[teamTypeIdx]);
    }
  }, [items, team]);

  const goBack = () => {
    if (team) {
      return navigator.replace('TeamScreen', {id: team?.id});
    }
    navigator.goBack();
  };

  const goToEditTeamScreen = () => {
    navigator.navigate('NameTeam', {teamId: team?.id});
  };

  const toggleModal = () => setIsModalVisible((prev) => !prev);

  const handleNext = () => {
    const params = {...sessionParams, isAllowToInvite, isAllowToHost, type: value.label};
    navigator.navigate('InviteFollowers', {sessionParams: params});
  };

  return (
    <Wrapper>
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Title>{TEAM_SETTINGS_TITLE}</Title>
        <SubTitle>{TEAM_SETTINGS_SUBTITLE}</SubTitle>
        <ContentWrapper>
          <ParamsWrapper>
            <ParamsText>{TEAM_SETTINGS_ALLOW_INVITE}</ParamsText>
            <CommonSwitch value={isAllowToInvite} setValue={setIsAllowToInvite} />
          </ParamsWrapper>
          <ParamsWrapper>
            <ParamsText>{TEAM_SETTINGS_ALLOW_HOST}</ParamsText>
            <CommonSwitch value={isAllowToHost} setValue={setIsAllowToHost} />
          </ParamsWrapper>
        </ContentWrapper>
        <Dropdown open={open} setOpen={setOpen} items={items} value={value} setValue={setValue} />
        {team && (
          <TeamActionsWrapper>
            <Button style={[styles.longButton, styles.whiteBtn]} onPress={goToEditTeamScreen}>
              <ButtonText style={styles.darkText}>Edit Team</ButtonText>
            </Button>
            <Button style={[styles.longButton, styles.redBtn]} onPress={toggleModal}>
              <ButtonText style={styles.lightText}>Delete Team</ButtonText>
            </Button>
          </TeamActionsWrapper>
        )}
      </ScrollableContent>
      {team ? (
        <ButtonSingle onPress={goBack}>
          <ButtonText>Back</ButtonText>
        </ButtonSingle>
      ) : (
        <Buttons>
          <Button onPress={goBack}>
            <ButtonText>Back</ButtonText>
          </Button>
          <Button onPress={handleNext} style={styles.pinkBtn}>
            <ButtonText>Next</ButtonText>
          </Button>
        </Buttons>
      )}
      <TeamSettingsModal teamId={team?.id} isModalVisible={isModalVisible} toggleModal={toggleModal} />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  pinkBtn: {backgroundColor: Colors.newPink},
  modalWrapper: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
  longButton: {width: '80%', height: 42, alignSelf: 'center'},
  whiteBtn: {backgroundColor: Colors.white, marginBottom: 24},
  redBtn: {backgroundColor: Colors.red},
  darkText: {color: Colors.blueBackgroundSession, fontSize: 18, ...Fonts.avenirSemiBold},
  lightText: {color: Colors.white, fontSize: 18, ...Fonts.avenirSemiBold},
});

export default withSafeArea(TeamSettings);
