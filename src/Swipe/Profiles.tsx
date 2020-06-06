import React, { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { Feather as Icon } from "@expo/vector-icons";

import { useMemoOne } from "use-memo-one";
import { RectButton } from "react-native-gesture-handler";
import Card, { Profile } from "./Profile";
import Swipeable from "./Swipeable";
import { StyleGuide, timing } from "../components";

const {
  Value,
  useCode,
  block,
  Clock,
  cond,
  eq,
  call,
  set,
  clockRunning,
  not,
  interpolate,
  Extrapolate,
} = Animated;

const { width, height } = Dimensions.get("window");
// const deltaX = width / 2;
const α = Math.PI / 12;
const A = Math.round(width * Math.cos(α) + height * Math.sin(α));
const snapPoints = [-A, 0, A];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
    justifyContent: "space-evenly",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  cards: {
    flex: 1,
    marginHorizontal: 16,
    zIndex: 100,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 16,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "gray",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
});

interface ProfilesProps {
  profiles: Profile[];
}

const Profiles = ({ profiles }: ProfilesProps) => {
  const [index, setIndex] = useState(0);
  const profile = profiles[index];
  const { translateX, translateY, offsetX, like, dislike, clock } = useMemoOne(
    () => ({
      clock: new Clock(),
      translateX: new Value(0),
      translateY: new Value(0),
      offsetX: new Value(0),
      like: new Value(0),
      dislike: new Value(0),
    }),
    []
  );

  const rotateZ = interpolate(translateX, {
    inputRange: [-A, 0, A],
    outputRange: [-Math.PI / 12, 0, Math.PI / 12],
    extrapolate: Extrapolate.CLAMP,
  });

  const likeOpacity = interpolate(translateX, {
    inputRange: [0, width / 2],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const nopeOpacity = interpolate(translateX, {
    inputRange: [-width / 2, 0],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const onSnap = ([x]: readonly number[]) => {
    if (x !== 0) {
      setIndex((prevIndex) => (prevIndex + 1) % profiles.length),
        offsetX.setValue(0);
    }
  };

  useCode(
    () =>
      block([
        cond(eq(like, 1), [
          set(offsetX, timing({ clock, from: 0, to: A, duration: 200 })),
          cond(not(clockRunning(clock)), [set(like, 0), call([], onSnap)]),
        ]),
        cond(eq(dislike, 1), [
          set(offsetX, timing({ clock, from: 0, to: -A, duration: 200 })),
          cond(not(clockRunning(clock)), [set(dislike, 0), call([], onSnap)]),
        ]),
      ]),
    [onSnap]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="user" size={32} color="gray" />
        <Icon name="message-circle" size={32} color="gray" />
      </View>
      <View style={styles.cards}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            transform: [{ translateX }, { translateY }, { rotateZ }],
          }}
        >
          <Card {...{ profile, likeOpacity, nopeOpacity }} />
        </Animated.View>
        <Swipeable
          {...{ translateX, translateY, snapPoints, onSnap, offsetX }}
        />
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.circle} onPress={() => dislike.setValue(1)}>
          <Icon name="x" size={32} color="#ec5288" />
        </RectButton>
        <RectButton style={styles.circle} onPress={() => like.setValue(1)}>
          <Icon name="heart" size={32} color="#6ee3b4" />
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

export default Profiles;
