import { View, TouchableOpacity } from "react-native";
import React from "react";
import CustomText from "../../../../components/CustomText";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../../../util/colors";
import { ScaledSheet } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

const Header = ({ label }) => {
  const navigation=useNavigation()
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack()
        }}
      >
        <AntDesign style={styles.icon} name="arrowleft" />
      </TouchableOpacity>
      <CustomText label={label} textStyle={styles.text} />
      <View style={styles.empty}></View>
    </View>
  );
};

export default Header;

const styles = ScaledSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: "25@vs",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    fontSize: "18@ms",
    color: colors.black,
  },
  text: {
    fontSize: "20@ms",
    fontWeight: "bold",
    color: colors.black,
  },
  empty: {
    width: "20@s",
  },
});
