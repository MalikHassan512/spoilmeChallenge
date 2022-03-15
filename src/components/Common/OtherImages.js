import { StyleSheet, Text, View, Image } from "react-native";
import images from "../../assets/images";
import { ScaledSheet } from "react-native-size-matters";
import React from "react";

const OtherImages = () => {
  return <Image style={styles.img} source={images.people1} />;
};

export default OtherImages;

const styles = ScaledSheet.create({
  img: {
    width: "25@ms",
    height: "25@ms",
    borderRadius: "100@ms",
    borderColor: "white",
    borderWidth: 1,
    marginLeft: -8,
  },
});
