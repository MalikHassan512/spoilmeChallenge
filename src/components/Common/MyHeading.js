import React from "react";
import { Text } from "react-native";

export const MyHeading = ({
  text,
  textAlign = "left",
  color = "black",
  fontSize = 18,
  marginBottom = 0,
  marginTop = 0,
  paddingLeft = 10,
}) => {
  return (
    <Text
      style={{
        paddingLeft: paddingLeft,
        fontSize: fontSize,
        color: color,
        textAlign: textAlign,
        fontWeight: "bold",
        marginBottom: marginBottom,
        marginTop: marginTop
      }}
    >
      {text}
    </Text>
  );
};
