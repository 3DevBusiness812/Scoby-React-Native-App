import React from 'react';
import withSafeArea from 'src/components/withSafeArea';
import BoxScreen from 'src/screens/VonageBoxScreen/components/BoxScreen';

const JoinVonageBox = ({navigation, route}) => {
  const paramsRoutes = route.params;

  return (
    <BoxScreen
      session={paramsRoutes.paramsSession}
      navigation={navigation}
      enableMic={false}
      enableCam={false}
      frontCam={false}
      isGuest
    />
  );
};

export default withSafeArea(JoinVonageBox, {drawUnderStatusBar: true});
