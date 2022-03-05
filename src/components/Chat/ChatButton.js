import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from 'util/colors'
const ChatButton = props => {
  return (
    <TouchableOpacity activeOpacity={0.6} style={[styles.btn,{borderColor:props.text=="Approve"?Colors.green:Colors.primary}]}>
       { props.text == 'Approve'? <FontAwesome5 color={Colors.green} name='check' size={20}/>:props.text == "Decline"?<Entypo color={Colors.primary} name='cross' size={30}/>:null}
      <Text style={[styles.btnText,{color:props.text=="Approve"?Colors.green:Colors.primary}]}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default ChatButton;

const styles = StyleSheet.create({
  btn: {
    height:40,
    borderWidth: 1.33,
    borderRadius: 6.66,
    justifyContent:"center",
    alignItems:'center',
    flexDirection:'row',
    marginTop:20,    
    marginStart:10,
    paddingHorizontal:5,
  },
  btnText:{
    fontSize:13,
    marginStart:3,
  }
 

});
