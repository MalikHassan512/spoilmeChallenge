import React from 'react';
import {Text, View} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
const CustomText = props => {
  return (
    <View style={[props.container]}>
      <Text
        style={[
          {
            fontSize: moderateScale(props.fontSize || 14),
            color: props.color || 'black',
            marginTop:verticalScale(props.marginTop || 0)
          },
          props.textStyle,
        ]}>
        {props.label}
      </Text>
    </View>
  );
};

export default CustomText;
