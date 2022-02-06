import React from 'react';
import withSafeArea from 'src/components/withSafeArea';
import BoxScreen from 'src/screens/VonageBoxScreen/components/BoxScreen';

const CreateVonageBox = ({navigation, route}) => {
  const paramsSession = route.params;

  return <BoxScreen session={paramsSession.paramsSession} navigation={navigation} isGuest={false} />;
};

export default withSafeArea(CreateVonageBox, {drawUnderStatusBar: true});
