import React, {useCallback} from 'react';
import BottomModal from 'src/components/BottomModal';
import NewLargeButton from 'src/components/NewLargeButton';
import InviteFollowers from 'src/components/InviteFollowers';
import Colors from 'src/constants/Colors';

export default function ShareModal({
  visible,
  onRequestClose,
  followersList,
  selectedFollowers,
  setSelectedFollowers,
  sendInvitations,
}) {
  const handleSendInvitations = useCallback(() => {
    sendInvitations(selectedFollowers);
  }, [selectedFollowers, sendInvitations]);

  return (
    <BottomModal
      opaque
      visible={visible}
      onRequestClose={onRequestClose}
      buttons={
        followersList?.data?.length > 0 && (
          <NewLargeButton
            title="Send Invitation"
            onPress={handleSendInvitations}
            disabled={selectedFollowers?.length === 0}
          />
        )
      }>
      <InviteFollowers
        getFollowerUsers={followersList}
        selectedFollowers={selectedFollowers}
        setSelectedFollowers={setSelectedFollowers}
        avatarBorderColor={Colors.violetColor}
      />
    </BottomModal>
  );
}
