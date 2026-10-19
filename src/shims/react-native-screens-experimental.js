const React = require('react');
const { View } = require('react-native');

function Host({ children, ...props }) {
  return React.createElement(View, props, children);
}

function Screen({ children, ...props }) {
  return React.createElement(View, props, children);
}

function HeaderConfig(props) {
  return null;
}

const Stack = {
  Host,
  Screen,
  HeaderConfig,
};

module.exports = {
  Stack,
  default: {
    Stack,
  },
};
