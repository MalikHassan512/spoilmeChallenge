import { View } from "react-native";
import { TextInput, Surface } from "react-native-paper";
import { moderateScale, ScaledSheet } from "react-native-size-matters";
import CustomText from "./CustomText";
import colors from "util/colors";
import React from "react";
import Entypo from "react-native-vector-icons/Entypo";
const InputField = ({
  label,
  withLabel,
  refer,
  value,
  inputStyle,
  onChangeText,
  errorText,
  profile,
  returnKeyType = "next",
  keyboardType = "default",
  width = "100%",
  multiline = false,
  onSubmitEditing = () => {},
  onFocus = () => {},
  blurOnSubmit = false,
  secureTextEntry = false,
  disabled = false,
  right,
}) => {
  return (
    <View style={styles.surface}>
      <TextInput
        mode="outlined"
        outlineColor="#ebebeb"
        disabled={disabled}
        style={[styles.inputStyle, inputStyle]}
        label={label + (profile ? " " : " *")}
        right={
          right ? (
            <TextInput.Icon
              style={{ marginTop: 15 }}
              onPress={right}
              name={() => (
                <Entypo name="cross" size={20} color={"rgba(0,0,0,0.5)"} />
              )}
            />
          ) : null
        }
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
          roundness: moderateScale(10),
          colors: {
            primary: colors.primary,
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
  surface: {
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  withLabel: {
    fontSize: "16@ms",
    fontWeight: "bold",
    marginBottom: "5@vs",
  },
});
