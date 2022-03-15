import { StyleSheet, Text, View, Image } from "react-native";
import { Box } from "../../screens/Tab/Home/Molecules";
import images from "../../assets/images";
import React from "react";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "./CustomText";

const TextWithIcon = ({ container, label }) => {
  return (
    <Box containerStyle={[styles.mainContainer, container]}>
      <Image style={styles.img} source={images.soda} />

      <CustomText textStyle={styles.text} label={label} />
    </Box>
  );
};

export default TextWithIcon;

const styles = ScaledSheet.create({
  mainContainer: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
  },
  img: {
    width: "25@ms",
    height: "25@ms",
  },
  text: {
    fontWeight: "bold",
    color: "#000000",
    fontSize: "14@ms",
    marginLeft: "10@s",
  },
});
