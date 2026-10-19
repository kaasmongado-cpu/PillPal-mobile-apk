const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const defaultResolveRequest = config.resolver?.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Resolve shims for native modules and packages causing bundling issues
  if (moduleName === 'react-native-screens') {
    return { filePath: path.resolve(__dirname, 'src/shims/react-native-screens.js'), type: 'sourceFile' };
  }
  if (moduleName === 'react-native-screens/experimental') {
    return { filePath: path.resolve(__dirname, 'src/shims/react-native-screens-experimental.js'), type: 'sourceFile' };
  }
  if (moduleName === 'react-native-reanimated') {
    return { filePath: path.resolve(__dirname, 'src/shims/react-native-reanimated.js'), type: 'sourceFile' };
  }
  if (moduleName === 'expo-image') {
    return { filePath: path.resolve(__dirname, 'src/shims/expo-image.js'), type: 'sourceFile' };
  }
  // Shim for all expo-router and react-navigation asset images and xml icons
  if (
    moduleName.endsWith('.xml') ||
    moduleName.startsWith('expo-router/assets/') ||
    moduleName.includes('assets/react-navigation/') ||
    moduleName.includes('react-navigation/elements/') ||
    (moduleName.includes('assets/') && (moduleName.endsWith('.png') || moduleName.endsWith('.jpg')) && !moduleName.startsWith('@/assets') && !moduleName.startsWith('./assets'))
  ) {
    return { filePath: path.resolve(__dirname, 'src/shims/placeholder.js'), type: 'sourceFile' };
  }
  // Existing AssetRegistry shim
  if (
    moduleName === 'react-native-web/dist/exports/AssetRegistry' ||
    moduleName === 'react-native-web/dist/cjs/exports/AssetRegistry' ||
    moduleName === 'react-native-web/dist/exports/AssetRegistry/index' ||
    moduleName === 'react-native-web/dist/exports/AssetRegistry/index.js'
  ) {
    return { filePath: path.resolve(__dirname, 'src/shims/AssetRegistry.js'), type: 'sourceFile' };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
