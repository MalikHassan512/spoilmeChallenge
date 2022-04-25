import {StyleSheet} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

import {height, width} from 'react-native-dimension';
import Colors from '../../util/colors';

const styles = ScaledSheet.create({
   
  post: {
    borderBottomRightRadius: width(3),
    borderBottomLeftRadius: width(3),
    paddingHorizontal: width(2),
    paddingBottom: height(1.5),
    backgroundColor: Colors.lightGrey,
    width: width(90),
    alignSelf: 'center'
  },
  userInfo: {
      backgroundColor: Colors.lightGrey,
      width: width(90),
      alignSelf: 'center',
      flexDirection: 'row',
      marginTop: height(2),
      borderTopRightRadius: width(3),
      borderTopLeftRadius: width(3),
      paddingHorizontal: width(2),
      paddingVertical: height(1.5),
      justifyContent:'space-between'
  },
  imageContainer: {
    height: height(7),
    width: height(7),
    borderRadius: height(3.5)
  },
  avatar: {
      height: height(7),
      width: height(7),
      borderRadius: height(3.5),
      borderWidth: 1.5,
      borderColor: Colors.white
  },
  name: {
      color: Colors.black,
      fontWeight: 'bold',
  },
  info: {
      marginLeft: width(2)
  },
  time: {
      color: Colors.black,
      fontSize: width(3)
  },
  description: {
      color: Colors.black,
      marginStart: width(3),
      padding:width(2),
  },
  postBtn: {
      width: '95%',
      marginTop: height(2),
      alignSelf: 'center',
      backgroundColor: '#00000010',
      borderRadius: width(4),
      justifyContent:'center',
      alignItems: 'center'
  },
  btnText: {
      color: Colors.black,
      fontWeight: 'bold',
      paddingVertical: height(0.75)
  },
  flatlist: {
      marginVertical: height(1)
  },
  image: {
      height: height(7.4),
      width: height(7.4),
      borderRadius: height(3.2)
  },
  spoilContainer: {
      marginRight: width(2)
  },
  mapImage: {
      width: '98%',
      alignSelf: 'center',
      height: height(30),
      borderRadius: width(2)
  },
  profilePic: {
    marginRight: 20,
    width: 70,
    height: 70,
    borderWidth: 2,
    borderRadius: 50,
  },
  spoilTypes: {
    justifyContent: "center",
    marginRight: 10,
  },

});
export default styles;
