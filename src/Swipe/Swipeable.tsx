import React from "react";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { onGestureEvent } from "react-native-redash";
import { withSpring } from "../components/AnimationHelpers";

const {
  Clock,
  Value,
  cond,
  set,
  eq,
  add,
  spring,
  clockRunning,
  startClock,
  stopClock,
  block,
  and,
  not,
  useCode,
} = Animated;

interface SwipeableProps {
  translateX: Animated.Value<any>;
  translateY: Animated.Value<any>;
  snapPoints: number[];
  offsetX?: Animated.Value<number>;
  onSnap?: (args: readonly number[]) => void;
}

const Swipeable = ({
  translateX,
  translateY,
  snapPoints,
  onSnap,
  offsetX,
}: SwipeableProps) => {
  const translationX = new Value(0);
  const translationY = new Value(0);
  const velocityX = new Value(0);
  const velocityY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const gestureHandler = onGestureEvent({
    translationX,
    translationY,
    velocityX,
    state,
  });

  const x = withSpring({
    value: translationX,
    velocity: velocityX,
    state,
    snapPoints,
    onSnap,
    offset: offsetX,
  });

  const y = withSpring({
    value: translationY,
    velocity: velocityY,
    state,
    snapPoints: [0],
  });

  useCode(() => block([set(translateX, x), set(translateY, y)]), []);
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View style={StyleSheet.absoluteFill} />
    </PanGestureHandler>
  );
};

export default Swipeable;
