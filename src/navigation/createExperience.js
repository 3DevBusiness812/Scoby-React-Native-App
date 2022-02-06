import * as React from 'react';
import NameSession from 'src/screens/CreateExperience/CreateSession/NameSession';
import SubscribeSerie from 'src/screens/CreateExperience/CreateSerie/SubscribeSerie';
import NameSerie from 'src/screens/CreateExperience/CreateSerie/NameSerie';
import SelectTopicsSession from 'src/screens/CreateExperience/SelectTopics';
import ShareSession from 'src/screens/CreateExperience/ShareSession';
import CreateSessionScreen from 'src/screens/CreateExperience/CreateSession/CreateSessionScreen';
import ChooseExperienceSession from 'src/screens/CreateExperience/ChooseExperience';
import PreviewSeries from 'src/screens/CreateExperience/CreateSerie/PreviewSeries';

import {createStackNavigator} from '@react-navigation/stack';
import ScheduleSerie from 'src/screens/CreateExperience/CreateSerie/ScheduleSerie';
import PriceSerie from 'src/screens/CreateExperience/CreateSerie/PriceSerie';

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
      name="SerieSubscribe"
      component={SubscribeSerie}
      options={{
        tabBarVisible: false,
      }}
    />
    <Stack.Screen
      name="SerieName"
      component={NameSerie}
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
    <Stack.Screen
      name="ScheduleSerie"
      component={ScheduleSerie}
      options={{
        tabBarVisible: false,
      }}
    />
    <Stack.Screen
      name="PriceSerie"
      component={PriceSerie}
      options={{
        tabBarVisible: false,
      }}
    />
  </Stack.Navigator>
);

export default CreateSessionStack;
