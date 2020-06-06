import React, { useRef, useState } from "react";
import { Dimensions, ImageStyle, StyleSheet, ViewStyle } from "react-native";

import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";

import {
  FlexibleCard as Card,
  Selection,
  StyleGuide,
  cards,
} from "../components";

interface Layout {
  id: string;
  name: string;
  layout: {
    container: ViewStyle;
    child?: ImageStyle;
  };
}
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
  },
});

const column: Layout = {
  id: "column",
  name: "Column",
  layout: {
    container: {},
  },
};

const row: Layout = {
  id: "row",
  name: "Row",
  layout: {
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
  },
};

const wrap: Layout = {
  id: "wrap",
  name: "Wrap",
  layout: {
    container: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
    },
    child: {
      flex: 0,
      width: width / 2 - StyleGuide.spacing * 2,
    },
  },
};

const layouts = [column, row, wrap];

const transition = (
  <Transition.Change interpolation="easeInOut" durationMs={400} />
);

export default () => {
  const ref = useRef<TransitioningView>(null);
  const [currentLayout, setCurrentLayout] = useState(layouts[0].layout);

  return (
    <>
      <Transitioning.View
        style={[styles.container, currentLayout.container]}
        {...{ ref, transition }}
      >
        {cards.map((card) => (
          <Card key={card.id} style={currentLayout.child} {...{ card }} />
        ))}
      </Transitioning.View>
      {layouts.map((layout) => (
        <Selection
          key={layout.id}
          name={layout.name}
          isSelected={layout.layout === currentLayout}
          onPress={() => {
            if (ref.current) {
              ref.current.animateNextTransition();
            }
            setCurrentLayout(layout.layout);
          }}
        />
      ))}
    </>
  );
};
