import { StyleSheet, FlatList, TouchableOpacity, View } from "react-native";
import { LoadingImage } from "../Common/LoadingImage";
import { MyText } from "../Common/MyText";
import { MyHeading } from "../Common/MyHeading";
import React,{useState} from "react";
import { updateSpoilStatus,getMessageById } from "../../firebase/firestore/chats";
import { updateRelationStatus } from "../../firebase/firestore/relationships";
import ChatButton from '../Chat/ChatButton'
import CustomText from "../CustomText";
import colors from "../../util/colors";
import RelationItem from './RelationItem'
export const UserList = ({
  otherUsers,
  userId,
  getRelations,
  navigation,
  loading,
}) => {
  
  return (
    <FlatList
      style={{ paddingHorizontal: 20 }}
      data={otherUsers}
      refreshing={loading}
      onRefresh={getRelations}
      keyExtractor={(item,index)=>item.id+index.toString()}
      ListEmptyComponent={() =>
        !loading ? (
          <View style={{ marginTop: "30%" }}>
            <MyHeading
              textAlign="center"
              text={"You don't have any relation yet"}
            />
            <MyText
              marginTop={5}
              textAlign="center"
              text={"Send a spoil to create a new relation"}
            />
          </View>
        ) : (
          <></>
        )
      }
      renderItem={({item,index})=><RelationItem navigation={navigation} userId={userId} otherUser={item} index={index}  />}
    />
  );
};

