import React from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {ACTIVITY_KEYS} from './ActivityKeys';
import ActivityScreen from './ActivityScreen';
import NewMessage from './NewMessage';

const Stack = createStackNavigator();

const options = {headerShown: false, headerBackTitleVisible: false, headerTitleStyle: {display: 'none'}};

const ActivityStack = () => (
  <Stack.Navigator initialRouteName={ACTIVITY_KEYS.NOTIFICATIONS}>
    <Stack.Screen options={options} name={ACTIVITY_KEYS.NOTIFICATIONS} component={ActivityScreen} />
    <Stack.Screen options={options} name={ACTIVITY_KEYS.NEW_MESSAGE} component={NewMessage} />
  </Stack.Navigator>
);

export default ActivityStack;
