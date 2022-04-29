import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {moderateScale, verticalScale,scale} from 'react-native-size-matters';
const CustomText = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      disabled={!props.onPress}
      style={[props.container]}>
      <Text
        style={[
          {
            fontSize: moderateScale(props.fontSize || 14),
            color: props.color || 'black',
            marginTop: verticalScale(props.marginTop || 0),
            marginBottom: verticalScale(props.marginBottom || 0),
            marginLeft: scale(props.marginLeft || 0),
            marginRight: scale(props.marginRight || 0),
            alignSelf: props.alignSelf || 'flex-start',
            fontWeight: props.fontWeight,
            fontStyle: props.fontStyle,
          },
          props.textStyle,
        ]}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomText;
