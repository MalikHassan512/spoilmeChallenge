import React from "react";
import { Box } from "./Box";
import CustomText from "components/CustomText";
import { ScaledSheet } from "react-native-size-matters";
import { Image, View,TouchableOpacity } from "react-native";
import Images from "assets/images";
import Entypo from "react-native-vector-icons/Entypo";
export const OpportunityBox = () => {
  return (
    <Box containerStyle={styles.container}>
      <View style={{ flexDirection: "row", marginRight: 10 }}>
        <Image style={styles.profile} source={Images.people1} />
        <View style={styles.checkContainer}>
          <Entypo name="check" style={{ color: "white", fontSize: 10 }} />
        </View>
      </View>
      <View>
        <CustomText
          textStyle={styles.congratulateText}
          label="Congratulate Maria for her 47 Birthay"
        />

        <TouchableOpacity style={styles.btnContainer}>
          <CustomText textStyle={styles.btn} label="Say congrats" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CustomText label="20h" textStyle={styles.text20h} />
        <Entypo name="check" style={{ color: "red", fontSize: 18 }} />
      </View>
    </Box>
  );
};

const styles = ScaledSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "10@vs",
    
  },
  profile: {
    width: "36@ms",
    height: "36@ms",
  },
  checkContainer: {
    backgroundColor: "#C71F1E",
    width: "16@ms",
    height: "16@ms",
    borderRadius: "100@ms",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    alignSelf: "center",
    marginBottom: 5,
    marginLeft: -15,
  },
  congratulateText: {
    fontSize: "14@ms",
    width: "166@s",
    marginBottom: "10@vs",
  },
  btn: {
    fontSize: "12@ms",
    color: "#C71F1E",
  },
  btnContainer: {
    width: "92@s",
    height: "26@vs",
    borderWidth: 2,
    borderColor: "#C71F1E",
    borderRadius: "50@ms",
    justifyContent: "center",
    alignItems: "center",
  },
  text20h: {
    color: "#878787",
    fontSize: "12@ms",
  },
});
