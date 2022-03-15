import { Image, View,TextInput } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "./CustomText";
import React from "react";

const LogoButton = ({ label, imgPath, withLabel, container,onChangeText,value,disabled }) => {
  return (
    <View>
      <CustomText
        label={withLabel}
        textStyle={[withLabel && styles.withLabel]}
      />
      <View style={[styles.container, container]}>
        <Image style={styles.img} source={imgPath} />
        <TextInput editable={!disabled} value={value} onChangeText={onChangeText} placeholder={label} style={styles.text} />
      </View>
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
    padding:0,
    margin:0,
    flexGrow:1
  },
  withLabel: {
    fontSize: "16@ms",
    fontWeight: "bold",
    marginBottom: "5@vs",
  },
});
