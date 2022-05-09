import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React,{useEffect,useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { LoadingImage } from '../../../../components/Common/LoadingImage';
import { MyHeading } from '../../../../components/Common/MyHeading';
import { MyText } from '../../../../components/Common/MyText';
import {getUsersById} from '../../../../firebase/firestore/users';


const SpoilItem = ({spoil,userId}) => {
    const navigation=useNavigation();
    const [fromUser, setFromUser] = useState({});
    const [toUser, setToUser] = useState({})
    useEffect(() => {
        getUsersName()
    }, [])
    const getUsersName = async()=>{
        const users = await getUsersById([spoil.to,spoil.from])
        if(users[0].id == userId){
            setFromUser(users[0])
            setToUser(users[1])
        }else{
            setFromUser(users[1])
            setToUser(users[0])
        }
    }
  return (
    <TouchableOpacity activeOpacity={0.8}  onPress={()=>navigation.navigate('Chat', {
        user:fromUser,
        relatedUser: toUser,
      })}>
        <View style={styles.spoilContainer}>
          <LoadingImage
            source={{uri: spoil.image}}
            style={styles.img}
          />
          <View>
            <MyHeading text={spoil.name} fontSize={18} />
            <MyText
              text={
                userId != spoil.from
                  ? `Received from ${fromUser.firstName + fromUser.lastName}`
                  : userId == spoil.from
                  ? `Sent to ${toUser.firstName +" "+ toUser.lastName}`
                  : null
              }
              color="gray"
            />
          </View>
        </View>
      </TouchableOpacity>
  )
}

export default SpoilItem

const styles = StyleSheet.create({
    img: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ECECEC',
        marginRight: 10,
      },
      spoilContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        marginBottom: 10,
        alignItems:'center'
      },
      
})