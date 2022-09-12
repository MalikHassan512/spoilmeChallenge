import { View, Modal, TouchableOpacity, Image } from "react-native";
import React from "react";
import CustomText from "../CustomText";
import colors from "../../util/colors";
import { ScaledSheet } from "react-native-size-matters";
import images from "../../assets/images";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "./CustomButton";
import { changeUserData, } from "../../firebase/firestore/users";
import { signout } from "../../firebase/auth/signout";
import firestore from "@react-native-firebase/firestore";
import {useSelector} from 'react-redux'
const PopupModal = ({ visible, onPress, bgPress }) => {
  const navigation = useNavigation();
  const userId = useSelector(state=>state.user.userId);

  const signoutUser = () => {
    changeUserData({
      id: userId,
      isActive: false,
      lastActive: firestore.Timestamp.now(),
    });
    signout();
    onPress();
  };
  return (
    <Modal visible={visible} transparent={true} >
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
          <CustomText textStyle={{alignSelf:'center',marginBottom:20}} label="Deactivate account" />
          <CustomButton onPress={signoutUser} label={"Log out"} />
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
    height: "30%",
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
