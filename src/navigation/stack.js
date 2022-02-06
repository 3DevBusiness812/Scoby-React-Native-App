/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useMemo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SettingsScreen from 'src/screens/SettingsScreen';
import JoinSession from 'src/screens/CreateExperience/CreateSession/JoinSession';
import FinishSession from 'src/screens/CreateExperience/CreateSession/FinishSession';
import CreateVonageBox from 'src/screens/VonageBoxScreen/CreateVonageBox';
import JoinVonageBox from 'src/screens/VonageBoxScreen/JoinVonageBox';
import UserDetailInfoModal from 'src/screens/UserDetailInfoModal';
import {GlobalContext} from 'src/containers/global';
import {INVALID_DYNAMIC_LINK, UNAUTHORIZED_USER_ERROR_VIEW_TEXT} from 'src/constants/Texts';
import {Alert} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import {ACTIVITY_KEYS} from 'src/screens/Activity/ActivityKeys';
import Chat from 'src/components/Chat/index';
import {FollowersContext} from 'src/containers/followers';
import messaging from '@react-native-firebase/messaging';
import {GET_COUNTER_ACTIVITY} from 'src/graphql/queries/activity';
import {useLazyQuery} from '@apollo/client';
import NameTeam from 'src/screens/CreateExperience/CreateTeam/NameTeam';
import SelectTopics from 'src/screens/CreateExperience/SelectTopics';
import PreviewTeam from 'src/screens/CreateExperience/CreateTeam/PreviewTeam';
import InviteFollowers from 'src/screens/CreateExperience/CreateTeam/InviteFollowers';
import TeamSettings from 'src/screens/CreateExperience/CreateTeam/TeamSettings';
import ShareSession from 'src/screens/CreateExperience/ShareSession';
import SeriesLandingView from 'src/screens/Series/SeriesLandingView';
import TeamScreen from 'src/screens/Team';
import TeamMembers from 'src/screens/Team/TeamMembers';
import CreateSessionScreen from 'src/screens/CreateExperience/CreateSession/CreateSessionScreen';
import SeriesMembers from 'src/screens/Series/SeriesMembers';
import EditSeriesStack from './editSeries';
import Tabs from './tabs';
import AuthStack from './auth';
import {stackConfig} from './config';

const Stack = createStackNavigator();

export default function MainStack({navigation}) {
  const {isLogged, initialLink} = useContext(GlobalContext);
  const {setNotifications, currentUserProfile} = useContext(FollowersContext);

  const [updateActivities] = useLazyQuery(GET_COUNTER_ACTIVITY, {
    onCompleted({getCounterActivity}) {
      setNotifications(getCounterActivity.counter);
    },
  });

  useEffect(() => {
    if (currentUserProfile.id) {
      updateActivities();
    }
  }, [updateActivities]);

  const initialRouteName = useMemo(() => {
    if (isLogged) {
      return initialLink ? 'UserDetailInfoModal' : 'MainTabs';
    }

    return 'Auth';
  }, [initialLink, isLogged]);

  const initialParams = useMemo(() => {
    if (initialLink) {
      const matches = initialLink.url.match(/user\/\d+/);
      const userID = matches ? matches[0].replace('user/', '') : null;
      return {userID};
    }
    return {};
  }, [initialLink]);

  useEffect(() => {
    if (navigation.current && !isLogged && initialLink) {
      Alert.alert(UNAUTHORIZED_USER_ERROR_VIEW_TEXT);
      return;
    }

    if (!initialLink) {
      return;
    }

    const matches = initialLink.url.match(/user\/\d+/);
    const userID = matches ? matches[0].replace('user/', '') : null;

    const matchesTeam = initialLink.url.match(/team\/\d+/);
    const teamID = matchesTeam ? matchesTeam[0].replace('team/', '') : null;

    if (teamID) return navigation.current.navigate('TeamScreen', {id: Number(teamID)});

    if (userID) {
      navigation.current.navigate('UserDetailInfoModal', {userID, fade: true});
    } else {
      Alert.alert(INVALID_DYNAMIC_LINK);
    }
  }, [initialLink, isLogged, navigation]);

  useEffect(() => {
    if (navigation.current && !isLogged) {
      const state = navigation.current.getRootState();
      const currentRoute = state.routes[state.index].name;
      if (currentRoute !== 'Auth') {
        navigation.current.reset({index: 0, routes: [{name: 'Auth', screen: 'LoginWithPhone'}]});
      }
    }
  });

  useEffect(() => {
    const handleMessage = async ({notification, data}) => {
      setNotifications((prev) => prev + 1);

      const {title, body} = notification;

      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        foreground: true,
      });

      await notifee.setNotificationCategories([
        {
          id: 'default',
          actions: [
            {
              id: 'reply',
              title: 'Reply',
              foreground: true,
            },
          ],
        },
      ]);

      await notifee.displayNotification({
        id: 'default',
        title,
        body,
        data,
        android: {
          channelId,
          actions: [
            {
              title: 'Reply',
              pressAction: {id: 'reply'},
            },
          ],
        },
        ios: {
          categoryId: 'default',
        },
      });
    };

    messaging().setBackgroundMessageHandler(handleMessage);

    const unsubscribe = messaging().onMessage(handleMessage);
    return unsubscribe;
  }, []);

  notifee.onBackgroundEvent(async ({type, detail}) => {
    const {pressAction} = detail;

    if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
      return navigation.current.navigate(ACTIVITY_KEYS.PRIVATE_CHAT, {id: detail.notification.data.senderId});
    }

    if (type === EventType.PRESS)
      return navigation.current.navigate(ACTIVITY_KEYS.PRIVATE_CHAT, {id: detail.notification.data.senderId});
  });

  useEffect(
    () =>
      notifee.onForegroundEvent(({type, detail}) => {
        const {pressAction} = detail;

        if (pressAction?.id === 'reply')
          return navigation.current.navigate(ACTIVITY_KEYS.PRIVATE_CHAT, {id: detail.notification.data.senderId});

        switch (type) {
          case EventType.DISMISSED:
            break;
          case EventType.PRESS:
            navigation.current.navigate(ACTIVITY_KEYS.PRIVATE_CHAT, {id: detail.notification.data.senderId});
            break;
          default:
            break;
        }
      }),
    [],
  );

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        ...stackConfig('Auth'),
        gestureEnabled: false,
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
        name="Auth"
        component={AuthStack}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
        name="MainTabs"
        component={Tabs}
      />
      <Stack.Screen
        name="CreateVonageBox"
        component={CreateVonageBox}
        options={{
          tabBarVisible: false,
        }}
      />
      <Stack.Screen
        name="JoinVonageBox"
        component={JoinVonageBox}
        options={{
          tabBarVisible: false,
        }}
      />
      <Stack.Screen
        name="JoinSession"
        component={JoinSession}
        options={{
          tabBarVisible: false,
        }}
      />
      <Stack.Screen
        name="FinishSession"
        component={FinishSession}
        options={{
          tabBarVisible: false,
        }}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {display: 'none'},
        }}
        name="Settings"
        component={SettingsScreen}
      />
      <Stack.Screen
        name="UserDetailInfoModal"
        component={UserDetailInfoModal}
        initialParams={initialParams}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {display: 'none'},
        }}
      />
      <Stack.Screen
        name="SeriesLandingView"
        component={SeriesLandingView}
        initialParams={initialParams}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {display: 'none'},
        }}
      />
      <Stack.Screen
        name="SeriesMembersJoined"
        component={SeriesMembers}
        initialParams={initialParams}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {display: 'none'},
        }}
      />
      <Stack.Screen
        name={ACTIVITY_KEYS.PRIVATE_CHAT}
        component={Chat}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {display: 'none'},
        }}
      />
      <Stack.Screen
        name="EditSeriesStack"
        component={EditSeriesStack}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {display: 'none'},
        }}
      />
      <Stack.Screen
        name="InviteUsers"
        component={ShareSession}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {display: 'none'},
        }}
      />
      <Stack.Screen name="NameTeam" component={NameTeam} />
      <Stack.Screen name="SelectTopics" component={SelectTopics} />
      <Stack.Screen name="PreviewTeam" component={PreviewTeam} />
      <Stack.Screen name="TeamSettings" component={TeamSettings} />
      <Stack.Screen name="InviteFollowers" component={InviteFollowers} />
      <Stack.Screen name="TeamScreen" component={TeamScreen} />
      <Stack.Screen name="TeamMembers" component={TeamMembers} />

      <Stack.Screen
        name="CreateSeriesSession"
        component={CreateSessionScreen}
        options={{
          tabBarVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
