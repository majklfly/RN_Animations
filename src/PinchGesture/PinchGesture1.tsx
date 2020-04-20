import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { vec } from "react-native-redash";

const { width, height } = Dimensions.get("window");
const CANVAS = vec.create(width, height);
const CENTER = vec.divide(CANVAS, 2);
const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "cover",
  },
});

export default () => {
  return (
    <Image style={[styles.image]} source={require("./assets/zurich.jpg")} />
  );
};
