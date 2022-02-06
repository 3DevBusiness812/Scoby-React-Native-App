import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Activities from 'src/screens/Activity/Activities';
import {Messages} from 'src/screens/Activity/Messages';
import fonts from 'src/constants/Fonts';
import colors from 'src/constants/Colors';

const Tabs = createMaterialTopTabNavigator();

const tabStyle = () => ({
  tabBarStyle: {
    backgroundColor: colors.blueBackgroundSession,
  },
  tabBarLabelStyle: {
    fontFamily: fonts.avenir.fontFamily,
    fontSize: 20,
    textTransform: 'capitalize',
  },
  tabBarIndicatorStyle: {
    backgroundColor: colors.white,
  },
  tabBarIndicatorContainerStyle: {
    borderBottomColor: colors.borderGrey,
    borderBottomWidth: 1,
  },
  tabBarPressColor: colors.darkBlue,
  tabBarInactiveTintColor: colors.borderGrey,
  tabBarActiveTintColor: colors.white,
});

const ActivitiesTopTap = (props) => (
  <Tabs.Navigator initialRouteName="activity" screenOptions={tabStyle}>
    <Tabs.Screen
      name="activity"
      options={{
        tabBarLabel: 'Activity',
      }}>
      {({navigation}) => <Activities navigation={navigation} />}
    </Tabs.Screen>
    <Tabs.Screen name="messages">{() => <Messages navigation={props.navigation} />}</Tabs.Screen>
  </Tabs.Navigator>
);

export default ActivitiesTopTap;
