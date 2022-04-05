import { Image, View } from "react-native";
import React from "react";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "../CustomText";
import colors from "../../util/colors";

const SocialIconWithText = ({ source, label, title }) => {
  return (
    <View style={styles.container}>
      <Image source={source} style={styles.image} />
    
      {label && <CustomText label={label} textStyle={styles.text} />}
      {title && <CustomText label={title} textStyle={styles.textSecond} />}
    </View>
  );
};

export default SocialIconWithText;

const styles = ScaledSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "10@vs",
  },
  image: {
    width: "18@ms",
    height: "16@ms",
    resizeMode: "contain",
    marginRight: "10@s",
  },
  text: {
    fontSize: "15@ms",
    color: colors.text,
  },
  textSecond: {
    fontWeight: "bold",
    color: colors.black,
  },
});
