import React from "react";
import { Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { panGestureHandler } from "react-native-redash";

import Card, {
  CardProps,
  CARD_HEIGHT as INNER_CARD_HEIGHT,
} from "../components/Card";

export const CARD_HEIGHT = INNER_CARD_HEIGHT + 32;
const { width } = Dimensions.get("window");
const {
  Value,
  eq,
  cond,
  useCode,
  divide,
  floor,
  max,
  multiply,
  block,
  set,
  diff,
  lessThan,
  add,
  greaterThan,
  abs,
  not,
  Clock,
  startClock,
  spring,
} = Animated;

const withSafeOffset = (
  value: Animated.Value<number>,
  state: Animated.Value<State>,
  offset: Animated.Adaptable<number>
) => {
  const safeOffset = new Value(0);
  return cond(eq(state, State.ACTIVE), add(safeOffset, value), [
    set(safeOffset, offset),
    safeOffset,
  ]);
};

const moving = (value: Animated.Node<number>) => {
  const frames = new Value(0);
  const delta = diff(value);
  return cond(
    lessThan(delta, 0.01),
    [set(frames, add(frames, 1)), lessThan(frames, 5)],
    [set(frames, 0), 1]
  );
};

interface SortableCardProps extends CardProps {
  offsets: Animated.Value<number>[];
  index: number;
}

export default ({ card, index, offsets }: SortableCardProps) => {
  const { gestureHandler, translation, velocity, state } = panGestureHandler();

  const translationX = translation.x;
  const translationY = translation.y;
  const x = withSafeOffset(translationX, state, 0);
  const y = withSafeOffset(translationY, state, offsets[index]);

  const withTransition = (
    value: Animated.Node<number>,
    velocity: Animated.Value<number>,
    gestureState: Animated.Value<State>
  ) => {
    const clock = new Clock();
    const state = {
      finished: new Value(0),
      velocity: new Value(0),
      position: new Value(0),
      time: new Value(0),
    };
    const config = {
      toValue: new Value(0),
      damping: 15,
      mass: 1,
      stiffness: 150,
      overshootClamping: false,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 1,
    };
    return block([
      startClock(clock),
      set(config.toValue, value),
      cond(
        eq(gestureState, State.ACTIVE),
        [set(state.position, value), set(state.velocity, velocity)],
        spring(clock, state, config)
      ),
      state.position,
    ]);
  };

  const translateX = withTransition(x, velocity.x, state);
  const translateY = withTransition(y, velocity.y, state);

  const zIndex = cond(
    eq(state, State.ACTIVE),
    100,
    cond(moving(translateY), 100, 1)
  );

  const currentOffset = multiply(
    max(floor(divide(y, CARD_HEIGHT)), 0),
    CARD_HEIGHT
  );
  useCode(
    () =>
      block(
        offsets.map((offset) =>
          cond(eq(offset, currentOffset), [
            set(offset, offsets[index]),
            set(offsets[index], currentOffset),
          ])
        )
      ),
    []
  );

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height: CARD_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ translateY }, { translateX }],
          zIndex,
        }}
      >
        <Card {...{ card }} />
      </Animated.View>
    </PanGestureHandler>
  );
};
