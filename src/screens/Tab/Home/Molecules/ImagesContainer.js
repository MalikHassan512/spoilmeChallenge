import {StyleSheet, Image, View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';

import React from 'react';
import Images from 'assets/images';

export const ImagesContainer = props => {
  return (
    <View style={[styles.container,props.containerStyle]}>
      {props.images?.map((item, index) => {

         
         return <View key={index}  style={props.imageContainer}>
        <Image
          source={item}
          resizeMode="contain"
          style={[
            styles.image,
            props.imageStyle,
            {marginEnd: index + 1 == props.images.length ? 0 : moderateScale(props.gutter || 0)},
          ]}
        />
        </View>;
      })}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
  },

});
