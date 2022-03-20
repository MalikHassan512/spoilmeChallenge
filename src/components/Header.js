import { Image, StyleSheet, Text, View,TouchableOpacity } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import images from "../assets/images";
import React from "react";

const Header = ({ fImgPath, sImgPath, fImgStyle, sImgStyle,sImgPress }) => {
  return (
    <View style={styles.mainContainer}>
      <Image source={fImgPath} style={[styles.fImg, fImgStyle]} />
      <Image style={styles.logo} source={images.logo} />
      <TouchableOpacity activeOpacity={0.7} onPress={sImgPress}>
        <Image source={sImgPath} style={[styles.sImg, sImgStyle]} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = ScaledSheet.create({
  mainContainer: {
    alignItems: "center",
    paddingVertical: "20@vs",
    paddingHorizontal: "25@s",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  logo: {
    width: "120@s",
    height: "30@vs",
    resizeMode: "contain",
  },
  fImg: {
    width: "25@ms",
    height: "25@ms",
    resizeMode: "contain",
  },
  sImg: {
    width: "25@ms",
    height: "25@ms",
    resizeMode: "contain",
  },
});
