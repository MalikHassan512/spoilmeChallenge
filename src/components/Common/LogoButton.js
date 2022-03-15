import { Image, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "./CustomText";
import React from "react";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

const LogoButton = ({ label, imgPath, withLabel, container }) => {
  return (
    <View>
      <CustomText
        label={withLabel}
        textStyle={[withLabel && styles.withLabel]}
      />
      <Pressable style={[styles.container, container]}>
        <Image style={styles.img} source={imgPath} />
        <CustomText style={styles.text} label={label} />
      </Pressable>
    </View>
  );
};

export default LogoButton;

const styles = ScaledSheet.create({
  container: {
    paddingVertical: "10@vs",
    paddingHorizontal: "20@s",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: "10@ms",
    marginBottom: "8@vs",
    borderWidth: 2,
    borderColor: "#ebebeb",
  },
  img: {
    width: "25@ms",
    height: "25@ms",
    marginRight: "15@s",
  },
  text: {
    color: "#878787",
    fontSize: "16@ms",
  },
  withLabel: {
    fontSize: "16@ms",
    fontWeight: "bold",
    marginBottom: "5@vs",
  },
});
