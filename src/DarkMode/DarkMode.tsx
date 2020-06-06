import React, { useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";
import { Button, Text } from "../components";

import Switch from "./Switch";
import ProfilePic from "./ProfilePic";
import SocialMediaIcons from "./SocialMediaIcons";
import Followers from "./Followers";

export { profilePic } from "./ProfilePic";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  text: {
    textAlign: "center",
  },
});

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={400} />
    <Transition.Out type="fade" durationMs={400} />
  </Transition.Together>
);

export default () => {
  const ref = useRef<TransitioningView>(null);
  const [dark, setDark] = useState(false);
  return (
    <Transitioning.View style={styles.container} {...{ ref, transition }}>
      {dark && (
        <View
          style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "black" }}
        />
      )}
      <SafeAreaView />
      <Switch
        value={dark}
        onValueChange={() => {
          if (ref.current) {
            ref.current.animateNextTransition();
          }
          setDark(!dark);
        }}
      />
      <ProfilePic />
      <View>
        <Text type="title3" style={styles.text} {...{ dark }}>
          Krzysztof Magiera
        </Text>
        <Text type="headline" style={styles.text} {...{ dark }}>
          Kraków, Poland
        </Text>
      </View>
      <Followers followers={3569} following={310} />
      <SocialMediaIcons />
      <Text type="body" style={styles.text} {...{ dark }}>
        When speaking of animations, the key to success is to avoid frame drops
      </Text>
      <Button label="Follow" primary onPress={() => {}} />
    </Transitioning.View>
  );
};
