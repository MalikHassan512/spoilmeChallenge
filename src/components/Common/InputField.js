import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { moderateScale, ScaledSheet } from "react-native-size-matters";
import CustomText from "./CustomText";
import colors from 'util/colors'
import React from "react";

const InputField = ({
  label,
  withLabel,
  refer,
  value,
  inputStyle,
  onChangeText,
  errorText,
  returnKeyType = "next",
  keyboardType = "default",
  width = "100%",
  multiline = false,
  onSubmitEditing = () => {},
  onFocus = () => {},
  blurOnSubmit = false,
  secureTextEntry = false,
  disabled=false
}) => {
  return (
    <View>
     {/* {withLabel && <CustomText label={withLabel} textStyle={styles.withLabel} />} */}
      <TextInput
        mode="outlined"
        outlineColor="#ebebeb"
        disabled={disabled}
        style={[styles.inputStyle, inputStyle]}
        label={label+" *"}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        numberOfLines={10}
        enablesReturnKeyAutomatically={true}
        ref={refer}
        value={value}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        returnKeyType={returnKeyType}
        error={!!errorText}
        secureTextEntry={!!secureTextEntry}
        onFocus={onFocus}
        theme={{
          roundness:moderateScale(10),
          colors: {
            primary:colors.primary,
          },
        }}
      />
    </View>
  );
};

export default InputField;

const styles = ScaledSheet.create({
  inputStyle: {
    backgroundColor: "white",
    background: "#FFFFFF",
    fontSize: "14@ms",
    color: "#878787",
    width: "300@s",
    height: "45@vs",
    
  },
  withLabel: {
    fontSize: "16@ms",
    fontWeight: "bold",
    marginBottom: "5@vs",
  },
});
