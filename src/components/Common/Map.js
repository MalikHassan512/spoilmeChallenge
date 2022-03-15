import { StyleSheet, Text, View, Image } from "react-native";
import { Box } from "../../screens/Tab/Home/Molecules";
import { ScaledSheet } from "react-native-size-matters";
import images from "../../assets/images";
import CustomText from "../Common/CustomText";
import OtherImages from "./OtherImages";
import React from "react";
import { Colors } from "react-native-paper";

const Map = ({ mainContainer }) => {
  let four = [0, 1, 2, 3];
  return (
    <View style={[styles.mainContainer, mainContainer]}>
      <Image style={styles.imgContainer} source={images.mapIstanbul} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", marginLeft: 8 }}>
          {four.map((item) => (
            <OtherImages />
          ))}
        </View>
        <CustomText textStyle={styles.text35} label="35" />
      </View>
    </View>
  );
};

export default Map;

const styles = ScaledSheet.create({
  mainContainer: {
    padding: "10@ms",
    backgroundColor: "white",
    borderRadius: "5@ms",
  },
  imgContainer: {
    width: "118@s",
    height: "70@vs",
    resizeMode: "contain",
    borderTopRightRadius: "5@ms",
    borderTopLeftRadius: "5@ms",
    marginBottom: "10@vs",
  },
  text35: {
    fontSize: "15@ms",
    color: Colors.black,
    fontWeight: "bold",
  },
});
