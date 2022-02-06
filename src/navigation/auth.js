import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignUpWithPhoneScreen from 'src/screens/SignUp/SignUpWithPhoneScreen';
import VerifyPhoneScreen from 'src/screens/SignUp/VerifyPhoneScreen';
import SetUpProfileScreen from 'src/screens/SignUp/SetUpProfileScreen';
import TermsAndConditions from 'src/screens/SignUp/TermsAndConditions';
import LoginWithPhoneScreen from 'src/screens/Login/LoginWithPhoneScreen';
import NewPassword from 'src/screens/SignUp/NewPassword';
import ResetPassword from 'src/screens/ResetPassword';
import Topics from 'src/components/Topics';

const Stack = createStackNavigator();

const authDefaultOptions = {
  headerShown: false,
  headerTitle: '',
  headerBackTitleVisible: false,
  gestureEnabled: false,
};

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
    }}
    initialRouteName={LoginWithPhoneScreen}>
    <Stack.Screen
      options={{...authDefaultOptions, tabBarVisible: false}}
      name="LoginWithPhone"
      component={LoginWithPhoneScreen}
    />
    <Stack.Screen
      options={{...authDefaultOptions, tabBarVisible: false}}
      name="SignUpWithPhone"
      component={SignUpWithPhoneScreen}
    />
    <Stack.Screen
      options={{...authDefaultOptions, tabBarVisible: false}}
      name="ResetPassword"
      component={ResetPassword}
    />
    <Stack.Screen options={authDefaultOptions} name="NewPassword" component={NewPassword} />
    <Stack.Screen
      options={{...authDefaultOptions, tabBarVisible: false}}
      name="VerifyPhone"
      component={VerifyPhoneScreen}
    />
    <Stack.Screen options={authDefaultOptions} name="SetSignUpTopics" component={Topics} />
    <Stack.Screen
      options={{...authDefaultOptions, tabBarVisible: false}}
      name="TermsAndConditions"
      component={TermsAndConditions}
    />
    <Stack.Screen
      options={{...authDefaultOptions, tabBarVisible: false}}
      name="SetUpProfile"
      component={SetUpProfileScreen}
    />
  </Stack.Navigator>
);

export default AuthStack;
