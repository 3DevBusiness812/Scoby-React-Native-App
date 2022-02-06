/* eslint-disable no-use-before-define */
import {useMutation} from '@apollo/client';
import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Alert, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';
import {TEAM_SETTINGS_DELETE_TEAM} from 'src/constants/Texts';
import {DELETE_TEAM} from 'src/graphql/mutations/team';
import styled from 'styled-components';

const ModalButtons = styled.View({
  paddingTop: 24,
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 20,
  alignSelf: 'center',
});

const ModalWrapper = styled.View({
  paddingHorizontal: 24,
  alignSelf: 'center',
  borderColor: Colors.translucentWhite,
  borderWidth: 2,
  paddingVertical: 12,
  backgroundColor: Colors.purple,
  borderRadius: 8,
  width: '92%',
});

const Button = styled.TouchableOpacity({
  width: '40%',
  height: 55,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
});

const ButtonText = styled.Text({...Fonts.avenir, fontSize: 16, color: Colors.grey});

const ModalText = styled.Text({...Fonts.avenir, fontSize: 16, color: Colors.grey, textAlign: 'center'});

const TeamSettingsModal = ({isModalVisible, toggleModal, teamId}) => {
  const navigator = useNavigation();
  const [deleteTeam] = useMutation(DELETE_TEAM, {
    onCompleted: onSuccess,
    onError,
  });

  const onSuccess = () => {
    deleteTeam({variables: {teamId}});
    navigator.replace('MainTabs', {
      screen: 'Profile',
    });
  };

  const onError = () => {
    Alert.alert();
  };

  return (
    <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
      <ModalWrapper>
        <ModalText>{TEAM_SETTINGS_DELETE_TEAM}</ModalText>
        <ModalButtons>
          <Button onPress={onSuccess} style={styles.pinkBtn}>
            <ButtonText>Yes</ButtonText>
          </Button>
          <Button onPress={toggleModal} style={styles.pinkBtn}>
            <ButtonText>No</ButtonText>
          </Button>
        </ModalButtons>
      </ModalWrapper>
    </Modal>
  );
};

const styles = StyleSheet.create({
  pinkBtn: {backgroundColor: Colors.newPink},
});

export default TeamSettingsModal;
