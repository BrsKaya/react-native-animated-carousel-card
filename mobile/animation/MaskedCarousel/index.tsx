import {
  View,
  Text,
  StatusBar,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import React from "react";
import sliders, { SliderItem } from "../data/sliders";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = width * 0.8;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

interface CarouselItemProps {
  item: SliderItem;
  index: number;
  scrollX: SharedValue<number>;
}

const CarouselItem = React.memo(
  ({ item, index, scrollX }: CarouselItemProps) => {
    const inputRange = [
      (index - 2) * ITEM_SIZE,
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
    ];

    const animatedStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        scrollX.value,
        inputRange,
        [50, 0, 50],
        Extrapolation.CLAMP
      );

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.9, 1.1, 0.9],
        Extrapolation.CLAMP
      );

      const rotateZ = interpolate(
        scrollX.value,
        inputRange,
        [10, 0, -10],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.5, 1, 0.5],
        Extrapolation.CLAMP
      );

      const shadowOpacity = interpolate(
        scrollX.value,
        inputRange,
        [0.1, 0.3, 0.1],
        Extrapolation.CLAMP
      );

      const shadowRadius = interpolate(
        scrollX.value,
        inputRange,
        [10, 20, 10],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ translateY }, { scale }, { rotateZ: `${rotateZ}deg` }],
        opacity,
        shadowOpacity,
        shadowRadius,
        shadowColor: "black",
      };
    });

    const imageAnimatedStyle = useAnimatedStyle(() => {
      const translateX = interpolate(
        scrollX.value,
        inputRange,
        [0, 0, 0],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ translateX }],
      };
    });

    const textAnimatedStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        scrollX.value,
        inputRange,
        [20, 0, 20],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0, 1, 0],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ translateY }],
        opacity,
      };
    });

    return (
      <View style={{ width: ITEM_SIZE }}>
        <Animated.View style={[styles.itemContainer, animatedStyle]}>
          <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
            <Image source={{ uri: item.img }} style={styles.imageView} />
            <View style={styles.overlay} />
          </Animated.View>
          <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
            <Text style={styles.title}>{item.name}</Text>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
);

const MaskedCarousel = () => {
  const scrollX = useSharedValue(0);
  const DATA_LENGTH = sliders.length;

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={"light-content"}
      />

      <View style={{ flex: 1, backgroundColor: "#234458" }}>
        <Animated.FlatList
          data={sliders}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={{ alignItems: "center" }}
          snapToInterval={ITEM_SIZE}
          bounces={false}
          decelerationRate={"fast"}
          scrollEventThrottle={16}
          onScroll={onScrollHandler}
          renderItem={({ item, index }) => {
            if (index === 0 || index == DATA_LENGTH - 1) {
              return <View style={{ width: SPACER_ITEM_SIZE }} />;
            }
            return (
              <CarouselItem
                index={index}
                item={item}
                scrollX={scrollX}
                key={index}
              />
            );
          }}
        />
      </View>
    </>
  );
};

export default MaskedCarousel;

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: SPACING,
    padding: SPACING,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 24,
    elevation: 10,
    overflow: "hidden",
    shadowColor: "#000",
  },
  imageContainer: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  imageView: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  textContainer: {
    paddingHorizontal: SPACING,
    paddingBottom: SPACING * 2,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
