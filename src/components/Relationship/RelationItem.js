import { StyleSheet, TouchableOpacity, View } from "react-native";
import { LoadingImage } from "../Common/LoadingImage";
import { MyText } from "../Common/MyText";
import { MyHeading } from "../Common/MyHeading";
import React,{useState,useEffect} from "react";
import { updateSpoilStatus,getMessageById } from "../../firebase/firestore/chats";
import { updateRelationStatus } from "../../firebase/firestore/relationships";
import {getUsersById} from '../../firebase/firestore/users';
import { Loading } from "components/Common/Loading";

import ChatButton from '../Chat/ChatButton'
import { ActivityIndicator } from "react-native-paper";
import colors from "../../util/colors";

const RelationItem = ({ index, conversation,navigation,userId}) => {
    const [relation, setRelation] = useState(conversation.relationStatus)
    const [loading, setLoading] = useState(false)
    const [fromUser, setFromUser] = useState({});
    const [toUser, setToUser] = useState({})
    useEffect(() => {
      getUsersName()
  }, [])
  const getUsersName = async()=>{
    setLoading(true)
    try {
      const users = await getUsersById([conversation.to,conversation.from])
      if(users[0].id == userId){
          setFromUser(users[0])
          setToUser(users[1])
      }else{
          setFromUser(users[1])
          setToUser(users[0])
      }
    setLoading(false)

    } catch (error) {
      console.log('getUsersName RelationItem',error)
      setLoading(false)
      
    }
     
  }
    return (loading ?
      <View style={[styles.profilePic,{margin:15}]}>
        <ActivityIndicator size={"small"} color={colors.black} />
      </View> :
      <TouchableOpacity
        key={index}
        style={[styles.userContainer]}
        onPress={async () => {
          navigation.navigate("Chat", {
            user: fromUser,
            relatedUser: toUser,
          });

        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width:"100%"
          }}
        >
          <View width="20%">
            <LoadingImage
              style={[styles.profilePic,toUser?.isActive && {borderColor:colors.photoBorder,borderWidth:3}]}
              source={{ uri: toUser?.profilePic }}
            />
          </View>
          <View width="80%" >
            <MyHeading
              marginBottom={5}
              marginTop={15}
              text={`${(toUser?.firstName || "")} ${((toUser?.lastName?.[0] || ""))}.`}
            />
            <MyText text={conversation?.lastMessage?.text} color="#C4C4C4"  />
            <View>
            {relation == 0 && conversation?.lastMessage?.from !== userId? <View style={{ flexDirection: "row" }}>
              <ChatButton
                onPress={async() => {
                  setRelation(1)
                  updateSpoilStatus(conversation?.lastMessage?.id, 1);
                  updateRelationStatus(fromUser.id,toUser?.id, 1)
                }
                }
                text="Approve"
              />
              <ChatButton
                   onPress={async() => {
                    setRelation(2)
                    updateSpoilStatus(conversation?.lastMessage?.id, 2);
                    updateRelationStatus(fromUser.id,toUser?.id, 2)
                  }
                  }           
                            
                text="Decline"
              />
            </View> : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


export default RelationItem


const styles = StyleSheet.create({
    userContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 6,
      borderBottomWidth:0.3,
      marginBottom:2,
    },
    profilePic: {
      borderRadius: 100,
      backgroundColor: "#F1F1F1",
      height: 70,
      width: 70,
      marginBottom: 15,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
      borderWidth: 2,
    },
    new: {
      backgroundColor: "#38B5EB",
      borderRadius: 100,
      padding: 10,
    },
  });
  