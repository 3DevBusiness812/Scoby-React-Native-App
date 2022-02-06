import React, {useCallback, useContext, useEffect} from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from 'src/constants/Colors';
import HomeScreen from 'src/screens/HomeScreen';
import SearchScreen from 'src/screens/SearchScreen';
import {
  BrowseIco,
  BrowseActiveIco,
  HomeIco,
  HomeActiveIco,
  StreamIcoActive,
  StreamIcoInactive,
  UserIco,
  BellActive,
  BellInactive,
  BottomLine,
} from 'assets/svg';
import {FollowersContext} from 'src/containers/followers';
import {useQuery} from '@apollo/client';
import {GET_USER_PROFILE} from 'src/graphql/queries/profile';
import ProfileStack from 'src/navigation/profile';
import ActivityStack from 'src/screens/Activity';
import Badge from 'src/components/Badge';
import styled from 'styled-components/native';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import CreateSessionStack from './createExperience';

export const tabsHeight = 60;
export const tabsSpace = 160;

const Tab = createBottomTabNavigator();

const getBadgeNumber = (amount) => (amount <= 999 ? amount : '+999');

const NavIcon = styled.View({
  alignItems: 'center',
  height: 30,
  width: 30,
});

const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  switch (routeName) {
    case 'NameTeam': {
      return false;
    }
    case 'SelectTopics': {
      return false;
    }
    case 'PreviewTeam': {
      return false;
    }
    case 'InviteFollowers': {
      return false;
    }
    case 'TeamSettings': {
      return false;
    }
    default: {
      return true;
    }
  }
};

const Tabs = () => {
  const {currentUserProfile, setCurrentUserProfile, notifications} = useContext(FollowersContext);
  const {data, loading} = useQuery(GET_USER_PROFILE);

  const UserAvatar = useCallback(
    (focused) => {
      if (loading || !currentUserProfile.avatar) {
        return (
          <NavIcon>
            <UserIco />
            {focused ? <BottomLine /> : null}
          </NavIcon>
        );
      }
      return (
        <NavIcon>
          <Image
            style={{
              width: 25,
              height: 25,
              borderRadius: 40,
              marginBottom: 5,
            }}
            source={{
              uri: currentUserProfile.avatar,
            }}
          />
          {focused ? <BottomLine /> : null}
        </NavIcon>
      );
    },
    [loading, currentUserProfile.avatar],
  );

  const ManageActivity = useCallback(
    (focused) => (
      <>
        {notifications > 0 ? <Badge size={29} top={-7} right={15} text={getBadgeNumber(notifications)} /> : null}
        {
          <NavIcon>
            {focused ? (
              <>
                <BellActive />
                <BottomLine />
              </>
            ) : (
              <BellInactive />
            )}
          </NavIcon>
        }
      </>
    ),
    [notifications],
  );

  useEffect(() => {
    if (!loading && data?.getUserProfile) {
      setCurrentUserProfile(data.getUserProfile);
    }
  }, [loading, data, setCurrentUserProfile]);

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: colors.primaryPurpleColor,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          borderTopWidth: 0,
          minHeight: tabsHeight,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowOpacity: 0,
        },
        iconStyle: {
          marginTop: 10,
          paddingBottom: 0,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <NavIcon>
              {focused ? (
                <>
                  <HomeActiveIco />
                  <BottomLine />
                </>
              ) : (
                <HomeIco />
              )}
            </NavIcon>
          ),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerTitle: 'Scoby Members',
          tabBarIcon: ({focused}) => (
            <NavIcon>
              {focused ? (
                <>
                  <BrowseActiveIco />
                  <BottomLine />
                </>
              ) : (
                <BrowseIco />
              )}
            </NavIcon>
          ),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="CreateSession"
        component={CreateSessionStack}
        options={{
          tabBarVisible: false,
          tabBarIcon: ({focused}) => (focused ? <StreamIcoActive /> : <StreamIcoInactive />),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityStack}
        options={{
          tabBarIcon: ({focused}) => ManageActivity(focused),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({focused}) => UserAvatar(focused),
          unmountOnBlur: true,
        })}
      />
    </Tab.Navigator>
  );
};
export default Tabs;
