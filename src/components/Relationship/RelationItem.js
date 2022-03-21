import { StyleSheet, TouchableOpacity, View } from "react-native";
import { LoadingImage } from "../Common/LoadingImage";
import { MyText } from "../Common/MyText";
import { MyHeading } from "../Common/MyHeading";
import React,{useState} from "react";
import { updateSpoilStatus,getMessageById } from "../../firebase/firestore/chats";
import { updateRelationStatus } from "../../firebase/firestore/relationships";
import ChatButton from '../Chat/ChatButton'

const RelationItem = ({ index, otherUser,navigation,userId}) => {
    const user = otherUser.from.id !== userId ? otherUser.from : otherUser.to;
    const currentUser = otherUser.from.id === userId ? otherUser.from : otherUser.to;
    const [relation, setRelation] = useState(otherUser.LastMessage.spoilStatus)
    return (
      <TouchableOpacity
        key={index}
        style={[styles.userContainer]}
        onPress={async () => {
          navigation.navigate("Chat", {
            user: currentUser,
            relatedUser: user,
          });

        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            // alignItems: "center",
          }}
        >
          <LoadingImage
            style={styles.profilePic}
            source={{ uri: user.profilePic }}
          />
          <View>
            <MyHeading
              marginBottom={5}
              text={`${user.firstName} ${user.lastName[0]}.`}
            />
            <MyText text={otherUser.LastMessage.text} color="#C4C4C4" />
            <View>
            {relation == 0 && otherUser.LastMessage.from !== userId? <View style={{ flexDirection: "row" }}>
              <ChatButton
                onPress={async() => {
                const tempMessage= await getMessageById(otherUser.LastMessage.id)
                setRelation(1)

                  updateSpoilStatus(tempMessage.data(), 1);updateRelationStatus(otherUser,{...otherUser.LastMessage,spoilStatus:1})}
                }
                text="Approve"
              />
              <ChatButton
                onPress={async() => {
                const tempMessage= await getMessageById(otherUser.LastMessage.id)
                setRelation(2)
                  updateSpoilStatus(tempMessage.data(), 2);updateRelationStatus(otherUser,{...otherUser.LastMessage,spoilStatus:2})}}
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
      padding: 15,
      borderTopWidth: 1,
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
  