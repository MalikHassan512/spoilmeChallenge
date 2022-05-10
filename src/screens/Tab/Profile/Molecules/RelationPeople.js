import { View, Image} from "react-native";
import React,{useEffect,useState} from "react";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "../../../../components/CustomText";
import colors from "../../../../util/colors";
import {getUsersById} from '../../../../firebase/firestore/users';
import { ActivityIndicator } from "react-native-paper";

const RelationPeople = ({ userId, item }) => {
  const [loading, setLoading] = useState(false)
    const [toUser, setToUser] = useState({})
    useEffect(() => {
      getUsersName()
  }, [])
  const getUsersName = async()=>{
    setLoading(true)
    try {
      const users = await getUsersById([item.to,item.from])
      if(users[0].id == userId){
          setToUser(users[1])
      }else{
          setToUser(users[0])
      }
    setLoading(false)

    } catch (error) {
      console.log('getUsersName RelationItem',error)
      setLoading(false)
      
    }
     
  }

  return ( loading ? <View style={styles.imgContainer}>
        <ActivityIndicator size={'large'} color="black" />
  </View> :
    <View style={styles.container}>
    <View
      style={[
        styles.imgContainer,
        toUser.isActive && { borderColor: colors.photoBorder, borderWidth: 2 },
      ]}
    >
      <Image style={styles.img} source={{uri:toUser?.profilePic}} />
    </View>
    <CustomText
      label={(toUser?.firstName || "") + " " + (toUser?.lastName || "")}
      textStyle={styles.text}
    />
  </View>
  );
};

export default RelationPeople;

const styles = ScaledSheet.create({
  container: {
    marginBottom: "30@vs",
    alignItems: "center",
  },
  imgContainer: {
    width: "90@ms",
    height: "90@ms",
    overflow: "hidden",
    borderRadius: "100@ms",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10@vs",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    fontSize: "14@ms",
    color: colors.black,
    fontWeight: "500",
  },
});
