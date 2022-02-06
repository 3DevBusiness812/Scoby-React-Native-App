import React from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {VIEWERS_MODAL_TITLE} from 'src/constants/Texts';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import BottomModal from 'src/components/BottomModal';
import NewLargeButton from 'src/components/NewLargeButton';

const Avatar = styled.Image`
  width: 45px;
  height: 45px;
  resize-mode: cover;
  border-radius: 40px;
  border-color: ${Colors.white};
  border-width: 1;
  align-self: center;
`;

const Viewer = styled.View({
  marginBottom: 16,
  width: '25%',
});

const ListText = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 12,
  textAlign: 'left',
  color: Colors.white,
  alignSelf: 'center',
  marginTop: 8,
  marginBottom: 4,
});

const UsernameText = styled.Text`
  font-size: 13px;
  color: ${Colors.usernameGrey};
  align-self: center;
  text-align: center;
`;

const Title = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 16,
  color: Colors.white,
  paddingBottom: 16,
});

const EmptyTitle = styled.Text({
  ...Fonts.avenirBold,
  fontSize: 16,
  color: Colors.white,
});

const Text = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  color: Colors.white,
  paddingTop: 8,
});

const EmptyContainer = styled.View({
  alignItems: 'center',
});

const Container = styled.View({
  maxHeight: '90%',
});

const Viewers = styled.ScrollView({
  paddingBottom: 24,
});

const styles = StyleSheet.create({
  viewersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default function ViewersModal({visible, onRequestClose, onInvite, viewerUsers = []}) {
  return (
    <BottomModal visible={visible} onRequestClose={onRequestClose} opaque>
      {viewerUsers.length > 0 ? (
        <Container>
          <Title>{VIEWERS_MODAL_TITLE}</Title>
          <Viewers contentContainerStyle={styles.viewersContainer}>
            {viewerUsers.map((viewer) => (
              <Viewer key={viewer.username + viewer.id}>
                <Avatar source={viewer.avatar ? {uri: viewer.avatar} : avatarSrc} />
                <ListText>{viewer.fullName || `@${viewer.username}`}</ListText>
                <UsernameText numberOfLines={1}>{viewer.location}</UsernameText>
              </Viewer>
            ))}
          </Viewers>
        </Container>
      ) : (
        <EmptyContainer>
          <EmptyTitle>No Viewers in the session yet!</EmptyTitle>
          <Text>Send invitations for your followers to join</Text>
          <NewLargeButton title="Invite followers" color_background={Colors.pink} onPress={onInvite} />
        </EmptyContainer>
      )}
    </BottomModal>
  );
}
