import {View,Image } from 'react-native'
import React from 'react'
import {ScaledSheet} from 'react-native-size-matters'
import Images from 'assets/images'
const Logo = (props) => {
  return (
    <View style={props.imageContainer}>
        <Image source={Images.logo} resizeMode='contain' style={[styles.image,props.imageStyle]} />
    </View>
  )
}

export default Logo

const styles = ScaledSheet.create({
    image:{
        width:"125@s",
        height:'31@vs',
    }
})