import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { interpolateColor } from "react-native-redash";
import Eye from "./Eye";
import Mouth from "./Mouth";
import Slider from "./Slider";

const { Value } = Animated;

const styles = StyleSheet.create({
  face: {
    width: 150,
    height: 150,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 32,
  },
  eyes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const bad = "#FDBEEB";
const normal = "#FDEEBE";
const good = "#BEFDE5";

export default () => {
  const progress = new Value(0);
  const backgroundColor = interpolateColor(progress, {
    inputRange: [0, 0.5, 1],
    outputRange: [bad, normal, good],
  });

  return (
    <Animated.View
      style={{ flex: 1, backgroundColor, justifyContent: "center" }}
    >
      <View style={styles.face}>
        <View style={styles.eyes}>
          <Eye {...{ progress }} />
          <Eye flip {...{ progress }} />
        </View>
        <Mouth {...{ progress }} />
      </View>
      <Slider {...{ progress }} />
    </Animated.View>
  );
};
