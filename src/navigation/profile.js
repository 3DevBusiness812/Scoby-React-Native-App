import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from 'src/screens/Profile/ProfileScreen';
import EditProfileScreen from 'src/screens/Profile/EditProfileScreen';
import Topics from 'src/components/Topics';
import withSafeArea from 'src/components/withSafeArea';
import SeriesScreen from 'src/screens/Series/SeriesScreen';

const Stack = createStackNavigator();
const defaultScreenOptions = {headerShown: false};

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="ProfileInit" screenOptions={defaultScreenOptions}>
      <Stack.Screen name="ProfileInit" component={ProfileScreen} />
      <Stack.Screen name="SetEditTopics" component={Topics} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="SeriesLandingPage" component={SeriesScreen} />
    </Stack.Navigator>
  );
}

export default withSafeArea(ProfileStack);
