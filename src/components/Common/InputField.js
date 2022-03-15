import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { ScaledSheet } from "react-native-size-matters";

import React from "react";

const InputField = ({label,
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
  secureTextEntry = false,}) => {
  return (
    <View>
      <TextInput
        underlineColor={"transparent"}
        outline={"transparent"}
        style={[styles.inputStyle, inputStyle]}
        placeholder={label}
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
          colors: {
            primary: "#FF8112",
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
    borderWidth: 3,
    borderColor: "#ebebeb",
    borderTopRightRadius: "10@ms",
    borderTopLeftRadius: "10@ms",
    borderRadius: "10@ms",
    background: "#FFFFFF",
    fontSize: "16@ms",
    color: "#878787",
    width: "300@s",
    height: "55@vs",
    paddingHorizontal: "20@s",
  },
});
