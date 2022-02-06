import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import NewHomeScreen from 'src/screens/RegistrationScreen/NewHomeScreen';
import CongratsScreen from 'src/screens/RegistrationScreen/CongratsScreen';
import NameScreen from 'src/screens/RegistrationScreen/NameScreen';
import EmailScreen from 'src/screens/RegistrationScreen/EmailScreen';

const Stack = createStackNavigator();

const RegistrationStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    mode="modal"
    initialRouteName={NewHomeScreen}>
    <Stack.Screen
      name="Home"
      component={NewHomeScreen}
      showLabel={false}
      options={{
        tabBarVisible: false,
        gestureEnabled: true,
      }}
    />
    <Stack.Screen
      name="Name"
      component={NameScreen}
      options={{
        tabBarVisible: false,
        gestureEnabled: true,
      }}
    />
    <Stack.Screen
      name="Email"
      component={EmailScreen}
      options={{
        tabBarVisible: false,
        gestureEnabled: true,
      }}
    />
    <Stack.Screen
      name="Congrats"
      component={CongratsScreen}
      options={{
        tabBarVisible: false,
      }}
    />
  </Stack.Navigator>
);

export default RegistrationStack;
