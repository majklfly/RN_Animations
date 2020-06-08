import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { clamp, onGestureEvent, withOffset } from "react-native-redash";
import Animated from "react-native-reanimated";

const { Value, divide, useCode, set } = Animated;
const { width } = Dimensions.get("window");
const CURSOR_SIZE = 40;
const CONTAINER_WIDTH = width - 64;
const SLIDER_WIDTH = CONTAINER_WIDTH - CURSOR_SIZE;
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: CONTAINER_WIDTH,
  },
  dividerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    borderColor: "rgba(50, 50, 50, 0.5)",
    width: SLIDER_WIDTH,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cursor: {
    width: CURSOR_SIZE,
    height: CURSOR_SIZE,
    borderRadius: CURSOR_SIZE * 0.3,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  cursorPoint: {
    borderRadius: 5,
    width: 10,
    height: 10,
    backgroundColor: "black",
  },
});

interface SliderProps {
  progress: Animated.Value<number>;
}

export default ({ progress }: SliderProps) => {
  const translationX = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const gestureHandler = onGestureEvent({
    translationX,
    state,
  });

  const translateX = clamp(withOffset(translationX, state), 0, SLIDER_WIDTH);

  useCode(() => set(progress, divide(translateX, SLIDER_WIDTH)), []);

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={[styles.cursor, { transform: [{ translateX }] }]}>
          <View style={styles.cursorPoint} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
