import React from 'react';
import {Text} from 'react-native';

export const MyText = ({
  text,
  textAlign = 'left',
  color = 'black',
  numberOfLines=1,
  marginBottom,
  marginTop,
  paddingLeft = 10,
  paddingBottom= 10,
  fontSize,
  textStyle
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[textStyle,{
        fontSize: fontSize,
        color: color,
        paddingLeft: paddingLeft,
        paddingBottom: paddingBottom,
        textAlign: textAlign,
        marginBottom: marginBottom,
        marginTop: marginTop,
      }]}
      >
      {text}
    </Text>
  );
};