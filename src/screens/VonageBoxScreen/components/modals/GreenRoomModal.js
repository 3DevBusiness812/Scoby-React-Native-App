import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import BottomModal from 'src/components/BottomModal';
import {statusBarHeight} from 'src/components/withSafeArea';
import {topBarHeight} from '../TopBar';
import GreenRoomPanel from '../GreenRoomPanel';

const Wrapper = styled.View({
  width: '100%',
});

export default function GreenRoomModal({
  visible,
  onRequestClose,
  isUserOwner,
  participantsList,
  greenRoomUsers,
  userID,
  sessionID,
  viewerUsers,
}) {
  const [height, setHeight] = useState(0);
  const handleLayout = useCallback((e) => {
    setHeight(e.nativeEvent.layout.height);
  }, []);

  return (
    <BottomModal visible={visible} onRequestClose={onRequestClose} onLayout={handleLayout} green>
      <Wrapper maxHeight={height - topBarHeight - statusBarHeight}>
        <GreenRoomPanel
          participantUsers={participantsList}
          getGreenRoomUsers={greenRoomUsers}
          isUserOwner={isUserOwner}
          userId={userID}
          sessionId={sessionID}
          viewersList={viewerUsers}
        />
      </Wrapper>
    </BottomModal>
  );
}
