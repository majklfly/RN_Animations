import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import {
  diffClamp,
  panGestureHandler,
  vec,
  withOffset,
} from "react-native-redash";

import { StyleGuide } from "../components";

const { useCode, set, sub, Value, event, block } = Animated;
export const CONTROL_POINT_RADIUS = 20;
interface ControlPointProps {
  point: {
    x: Animated.Value<number>;
    y: Animated.Value<number>;
  };
  min: number;
  max: number;
}

export default ({ point: { x, y }, min, max }: ControlPointProps) => {
  const translationX = new Value(0);
  const translationY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const onGestureEvent = event([
    {
      nativeEvent: {
        translationX,
        translationY,
        state,
      },
    },
  ]);

  const x1 = withOffset(translationX, state);
  const y1 = withOffset(translationY, state);

  const translateX = diffClamp(x1, min, max);
  const translateY = diffClamp(y1, min, max);

  useCode(() => block([set(x, translateX), set(y, translateY)]), []);

  return (
    <PanGestureHandler
      onHandlerStateChange={onGestureEvent}
      {...{ onGestureEvent }}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: StyleGuide.palette.primary,
          borderWidth: 4,
          borderColor: "black",
          transform: [{ translateX: sub(translateX, 15) }, { translateY }],
        }}
      />
    </PanGestureHandler>
  );
};
