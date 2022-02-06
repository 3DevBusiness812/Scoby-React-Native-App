import colors from 'src/constants/Colors';

export const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.blueBackgroundSession,
    height: 56,
  },
  headerBackTitle: null,
  headerTintColor: colors.white,
  headerForceInset: {
    top: 'never',
  },
};

export const stackConfig = (initialRouteName) => ({
  initialRouteName,
  headerMode: 'screen',
  headerShown: false,
  headerBackTitleVisible: false,
  defaultNavigationOptions,
  headerStatusBarHeight: 0,
});

export const bottomBarVisible = (navigation) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};
