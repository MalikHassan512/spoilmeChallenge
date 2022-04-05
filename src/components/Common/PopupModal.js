import { View, Modal, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import CustomText from "../CustomText";
import colors from "../../util/colors";
import { ScaledSheet } from "react-native-size-matters";
import LogoButton from "./LogoButton";
import images from "../../assets/images";
import { useNavigation } from "@react-navigation/native";
const PopupModal = ({ visible, onPress, bgPress }) => {
  const navigation = useNavigation();
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.firstContainer}>
        <TouchableOpacity
          onPress={bgPress}
          style={{ flex: 1 }}
        ></TouchableOpacity>
        <View style={styles.secondContainer}>
          <TouchableOpacity
            onPress={onPress}
            style={styles.emptyView}
          ></TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Setting")}
            style={styles.settingContainer}
          >
            <Image source={images.setting} style={styles.settingIcon} />
            <CustomText label="Settings" textStyle={styles.settingText} />
          </TouchableOpacity>
          <LogoButton
            imgPath={images.faceBook}
            label="Connect with Facebook"
            container={styles.logoButton}
          />
          <LogoButton
            imgPath={images.twitter}
            container={styles.logoButton}
            label="Connect with Twitter"
          />
          <LogoButton
            imgPath={images.linkedin}
            container={styles.logoButton}
            label="Connect with LinkedIn"
          />
        </View>
      </View>
    </Modal>
  );
};

export default PopupModal;

const styles = ScaledSheet.create({
  firstContainer: {
    flex: 1,
    backgroundColor: "#C4C4C4aa",
  },
  secondContainer: {
    backgroundColor: "#ffffff",
    height: "40%",
    borderRadius: "30@ms",
    alignSelf: "flex-end",
    width: "100%",
    paddingHorizontal: "25@s",
    position: "absolute",
    bottom: -10,
    paddingVertical: "15@vs",
  },
  emptyView: {
    width: "45@s",
    alignSelf: "center",
    backgroundColor: colors.primary,
    height: "4@vs",
    borderRadius: "4@ms",
    marginBottom: "30@vs",
  },
  logoButton: {
    paddingHorizontal: "10@s",
    paddingVertical: "6@vs",
    marginBottom: "15@vs",
  },
  settingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "20@vs",
  },
  settingIcon: {
    width: "23@ms",
    height: "22@ms",
    resizeMode: "contain",
    marginRight: "12@s",
    marginLeft: "15@s",
  },
  settingText: {
    fontSize: "16@ms",
    color: colors.text,
  },
});
