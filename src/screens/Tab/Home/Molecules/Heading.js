import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {ScaledSheet} from 'react-native-size-matters'
import React from 'react'
import CustomText from 'components/CustomText'
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from 'util/colors'
export const Heading = (props) => {
  return (
    <View style={[styles.container,props.containerStyle]}>
      <CustomText label={props.label} fontSize={20} />
      <TouchableOpacity activeOpacity={0.8} style={styles.iconContainer}>
      <CustomText label={"More"}  />
      <Entypo name="chevron-down" style={styles.icon}  />
      </TouchableOpacity>
    </View>
  )
}


const styles = ScaledSheet.create({
  container:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginVertical:'15@vs'
  },
  iconContainer:{
    alignItems:'center',
    flexDirection:'row'
  },
  icon: {
    fontSize: '22@ms',
    color:Colors.primary,
  },
})