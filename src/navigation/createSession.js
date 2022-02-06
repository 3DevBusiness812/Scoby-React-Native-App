import * as React from 'react';
import NameSession from 'src/screens/CreateSession/NameSession';
import SelectTopicsSession from 'src/screens/CreateSession/SelectTopicsSession';
import ShareSession from 'src/screens/CreateSession/ShareSession';
import CreateSessionScreen from 'src/screens/CreateSession/CreateSessionScreen';
import ChooseExperienceSession from 'src/screens/CreateSession/ChooseExperienceSession';
import PreviewSeries from 'src/screens/CreateSession/PreviewSeries';

import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const CreateSessionStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
    }}
    initialRouteName={ChooseExperienceSession}>
    <Stack.Screen
      name="ChoiseExperience"
      component={ChooseExperienceSession}
      showLabel={false}
      options={{
        tabBarVisible: false,
      }}
    />
    <Stack.Screen
      name="SessionName"
      component={NameSession}
      showLabel={false}
      options={{
        tabBarVisible: false,
      }}
    />
    <Stack.Screen
      name="SelectTopics"
      component={SelectTopicsSession}
      options={{
        tabBarVisible: false,
      }}
    />
    <Stack.Screen
      name="ShareSession"
      component={ShareSession}
      options={{
        tabBarVisible: false,
      }}
    />
    <Stack.Screen
      name="CreateSessionScreen"
      component={CreateSessionScreen}
      options={{
        tabBarVisible: false,
      }}
    />
    <Stack.Screen
      name="PreviewSeries"
      component={PreviewSeries}
      options={{
        tabBarVisible: false,
      }}
    />
  </Stack.Navigator>
);

export default CreateSessionStack;
