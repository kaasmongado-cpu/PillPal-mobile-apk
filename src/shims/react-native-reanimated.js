const React = require('react');
const { Animated, View, Text, ScrollView, Image } = require('react-native');

const useSharedValue = (initialValue) => {
  const ref = React.useRef({ value: initialValue });
  return ref.current;
};

const useAnimatedStyle = (fn) => {
  try {
    return fn() || {};
  } catch (e) {
    return {};
  }
};

const withTiming = (toValue, config, callback) => {
  if (callback) callback(true);
  return toValue;
};

const withSpring = (toValue, config, callback) => {
  if (callback) callback(true);
  return toValue;
};

const withDelay = (delay, val) => val;
const withSequence = (...vals) => (vals.length > 0 ? vals[vals.length - 1] : undefined);
const withRepeat = (val) => val;
const cancelAnimation = () => {};

const useAnimatedRef = () => React.useRef(null);
const useAnimatedScrollHandler = () => () => {};
const useDerivedValue = (fn) => {
  const ref = React.useRef({ value: fn ? fn() : undefined });
  if (fn) ref.current.value = fn();
  return ref.current;
};
const useAnimatedReaction = () => {};

class LayoutAnimationBuilder {
  duration() { return this; }
  delay() { return this; }
  springify() { return this; }
  damping() { return this; }
  stiffness() { return this; }
  withCallback() { return this; }
  randomDelay() { return this; }
  easing() { return this; }
  build() { return () => ({ initialValues: {}, animations: {} }); }
}

const createBuilder = () => new LayoutAnimationBuilder();

const Easing = {
  linear: (x) => x,
  ease: (x) => x,
  quad: (x) => x,
  cubic: (x) => x,
  poly: () => (x) => x,
  sin: (x) => x,
  circle: (x) => x,
  exp: (x) => x,
  elastic: () => (x) => x,
  back: () => (x) => x,
  bounce: (x) => x,
  bezier: () => (x) => x,
  in: (fn) => fn,
  out: (fn) => fn,
  inOut: (fn) => fn,
};

const AnimatedView = Animated.View || View;
const AnimatedText = Animated.Text || Text;
const AnimatedScrollView = Animated.ScrollView || ScrollView;
const AnimatedImage = Animated.Image || Image;

const createAnimatedComponent = (Component) => Component;

const Reanimated = {
  ...Animated,
  View: AnimatedView,
  Text: AnimatedText,
  ScrollView: AnimatedScrollView,
  Image: AnimatedImage,
  createAnimatedComponent,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useAnimatedReaction,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  cancelAnimation,
  Easing,
  FadeIn: createBuilder(),
  FadeInDown: createBuilder(),
  FadeInUp: createBuilder(),
  FadeInLeft: createBuilder(),
  FadeInRight: createBuilder(),
  FadeOut: createBuilder(),
  FadeOutDown: createBuilder(),
  FadeOutUp: createBuilder(),
  FadeOutLeft: createBuilder(),
  FadeOutRight: createBuilder(),
  SlideInDown: createBuilder(),
  SlideInUp: createBuilder(),
  SlideInLeft: createBuilder(),
  SlideInRight: createBuilder(),
  SlideOutDown: createBuilder(),
  SlideOutUp: createBuilder(),
  SlideOutLeft: createBuilder(),
  SlideOutRight: createBuilder(),
  ZoomIn: createBuilder(),
  ZoomOut: createBuilder(),
  Layout: createBuilder(),
  LinearTransition: createBuilder(),
  CurvedTransition: createBuilder(),
  EntryExitTransition: createBuilder(),
  interpolate: () => 0,
  interpolateColor: () => '#000000',
  Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  Extrapolate: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  isSharedValue: (val) => Boolean(val && typeof val === 'object' && 'value' in val),
};

module.exports = {
  ...Reanimated,
  default: Reanimated,
};
