import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from 'components/CustomText'
import {ScaledSheet} from 'react-native-size-matters'
import Colors from 'util/colors'
export const NotificationBox = (props) => {
  return (
    <View style={[styles.container,props.containerStyle]}>
        <CustomText fontSize={16} textStyle={props.labelStyle} label={props.label}  />
        {props.label2 && <CustomText fontSize={16} textStyle={props.labelStyle2} label={props.label2}  /> }
    </View>
  )
}

const styles = ScaledSheet.create({
    container:{
        backgroundColor:Colors.grey,
        paddingVertical:'10@ms',
        borderRadius:5,
        padding:'14@ms',
        flexDirection:'row'
    },
})