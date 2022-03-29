import { Image, View,TextInput } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "./CustomText";
import React from "react";

const LogoButton = ({ label, imgPath, withLabel,textContainer={}, container,onChangeText,value,disabled }) => {
  return (
    <View style={styles.surface}>
     {withLabel && <CustomText
        label={withLabel}
        textStyle={[withLabel && styles.withLabel]}
        container={textContainer}
      />}
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
    marginBottom: "10@vs",
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
    flex: 1,
    flexGrow:1,
  },
  withLabel: {
    fontSize: "16@ms",
    fontWeight: "bold",
    marginBottom: "5@vs",
  },
  surface: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});
