import React from 'react'
import {Box} from '.'
import CustomText from 'components/CustomText'
import {ScaledSheet} from 'react-native-size-matters'
import { Image,View } from 'react-native'
import Images from 'assets/images'
import Entypo from 'react-native-vector-icons/Entypo'
export const OpportunityBox = () => {
  return (
    <Box containerStyle={styles.container} >
      <Image style={styles.profile} source={Images.people1} />
      <View style={styles.checkContainer}>
      <Entypo name="check" style={{color:'white',fontSize:10}}/>
      </View>
     <CustomText label="Congratulate Maria for her 47 Birthay" />
     
    </Box>
  )
}

 

const styles = ScaledSheet.create({
    container:{
      backgroundColor:'white'
    },
    profile:{
      width:'36@ms',
      height:'36@ms',
    },
    checkContainer:{
    backgroundColor:'#C71F1E',
    width:16,
    height:16,
    borderRadius:100,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'flex-end',
  }
})