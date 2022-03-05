import React from 'react';
import {Text,} from 'react-native';

export const MyText = ({
  text,
  textAlign = 'left',
  color = 'black',
  numberOfLines,
  marginBottom,
  marginTop,
  fontSize,
  textStyle
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[textStyle,{
        fontSize: fontSize,
        color: color,
        textAlign: textAlign,
        marginBottom: marginBottom,
        marginTop: marginTop,
      }]}>
      {text}
    </Text>
  );
};
