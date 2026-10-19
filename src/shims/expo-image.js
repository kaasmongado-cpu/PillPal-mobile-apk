const React = require('react');
const { Image: RNImage } = require('react-native');

function Image(props) {
  const { contentFit, style, ...rest } = props;
  const resizeMode = contentFit === 'contain' ? 'contain' : contentFit === 'cover' ? 'cover' : undefined;
  return React.createElement(RNImage, { ...rest, style, resizeMode });
}

Image.displayName = 'ExpoImageShim';

module.exports = {
  Image,
  ImageBackground: RNImage,
  default: Image,
};
