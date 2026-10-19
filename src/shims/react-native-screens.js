const React = require('react');
const { View } = require('react-native');

const featureFlags = {
  experiment: {
    synchronousScreenUpdatesEnabled: true,
    synchronousHeaderConfigUpdatesEnabled: true,
    synchronousHeaderSubviewUpdatesEnabled: true,
    iosPreventReattachmentOfDismissedScreens: true,
  },
};

const compatibilityFlags = {};

function Screen(props) {
  return React.createElement(View, props);
}

function ScreenContainer(props) {
  return React.createElement(View, props);
}

function ScreenStack(props) {
  return React.createElement(View, props);
}

function ScreenStackHeaderConfig(props) {
  return null;
}

function ScreenStackHeaderSubview(props) {
  return React.createElement(View, props);
}

function SearchBar(props) {
  return null;
}

const RNS = {
  enableScreens: () => {},
  enableFreeze: () => {},
  screensEnabled: () => true,
  freezeEnabled: () => false,
  Screen,
  InnerScreen: Screen,
  ScreenContext: React.createContext(null),
  ScreenStackHeaderConfig,
  ScreenStackHeaderSubview,
  ScreenStackHeaderLeftView: ScreenStackHeaderSubview,
  ScreenStackHeaderCenterView: ScreenStackHeaderSubview,
  ScreenStackHeaderRightView: ScreenStackHeaderSubview,
  ScreenStackHeaderBackButtonImage: ScreenStackHeaderSubview,
  ScreenStackHeaderSearchBarView: ScreenStackHeaderSubview,
  SearchBar,
  ScreenContainer,
  ScreenStack,
  ScreenStackItem: Screen,
  FullWindowOverlay: View,
  ScreenFooter: View,
  ScreenContentWrapper: View,
  isSearchBarAvailableForCurrentPlatform: () => false,
  executeNativeBackPress: () => false,
  compatibilityFlags,
  featureFlags,
  useTransitionProgress: () => ({ progress: { value: 0 }, closing: { value: 0 }, goingForward: { value: 0 } }),
};

module.exports = {
  ...RNS,
  default: RNS,
};
