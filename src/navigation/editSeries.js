import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SeriesProvider} from 'src/utils/SeriesContext';
import NameSerie from 'src/screens/CreateExperience/CreateSerie/NameSerie';
import SelectTopics from 'src/screens/CreateExperience/SelectTopics';
import PreviewSeries from 'src/screens/CreateExperience/CreateSerie/PreviewSeries';
import ShareSession from 'src/screens/CreateExperience/ShareSession';
import ScheduleSerie from 'src/screens/CreateExperience/CreateSerie/ScheduleSerie';
import SubscribeSerie from 'src/screens/CreateExperience/CreateSerie/SubscribeSerie';

const Stack = createStackNavigator();

const EditSeriesStack = ({route}) => (
  <SeriesProvider>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName="EditSchedule">
      <Stack.Screen
        name="EditSchedule"
        component={ScheduleSerie}
        showLabel={false}
        options={{
          tabBarVisible: false,
        }}
        initialParams={route.params}
      />
      <Stack.Screen
        name="SerieName"
        component={NameSerie}
        showLabel={false}
        options={{
          tabBarVisible: false,
        }}
        initialParams={route.params}
      />
      <Stack.Screen
        name="SelectTopics"
        component={SelectTopics}
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
        name="ShareSession"
        component={ShareSession}
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
    </Stack.Navigator>
  </SeriesProvider>
);

export default EditSeriesStack;
