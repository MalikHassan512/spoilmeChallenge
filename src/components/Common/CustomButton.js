import { Pressable } from "react-native";
import CustomText from "./CustomText";
import { ScaledSheet } from "react-native-size-matters";
import React from "react";
import * as Progress from 'react-native-progress';

const CustomButton = ({ label, onPress,disabled,loading, btnContainer }) => {
  return (
    <Pressable disabled={disabled} style={[styles.signUpBtn, btnContainer,{backgroundColor: !disabled ? '#C71F1E' : 'rgba(200,200,200,0.5)'}]} onPress={onPress}>
     {!loading ? ( <CustomText textStyle={styles.signUpText} label={label} />) : (
        <Progress.Circle
          indeterminate
          size={30}
          style={{alignSelf: 'center'}}
        />
      )}
    </Pressable>
  );
};

export default CustomButton;

const styles = ScaledSheet.create({
  signUpBtn: {
    backgroundColor: "#C71F1E",
    borderRadius: "10@ms",
    width: "100%",
    height: "55@vs",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "60@s",
  },
  signUpText: {
    color: "#FFFFFF",
    fontSize: "18@ms",
  },
});
