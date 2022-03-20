import { StyleSheet, FlatList, TouchableOpacity, View } from "react-native";
import { LoadingImage } from "../Common/LoadingImage";
import { MyText } from "../Common/MyText";
import { MyHeading } from "../Common/MyHeading";
import React from "react";
import { updateRelationStatus } from "../../firebase/firestore/relationships";
import ChatButton from '../Chat/ChatButton'
import CustomText from "../CustomText";
import colors from "../../util/colors";
export const UserList = ({
  otherUsers,
  userId,
  lastMessages,
  navigation,
  loading,
}) => {
  const renderRelations = ({ index, item: otherUser }) => {
    const user = otherUser.from.id !== userId ? otherUser.from : otherUser.to;
    const currentUser = otherUser.from.id === userId ? otherUser.from : otherUser.to;
    return (
      <TouchableOpacity
        key={index}
        disabled={otherUser.relationStatus==0 ||otherUser.relationStatus==2}
        style={[styles.userContainer]}
        onPress={async () => {
          console.log('sdkjbkajsbdkjabdjk');
            navigation.navigate("Chat", {
              user:currentUser,
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
            <MyText marginBottom={5} text={otherUser.lastMessage} color="#C4C4C4" />
            {otherUser.relationStatus==0 ? <View style={{ flexDirection: "row" }}>
              <ChatButton
                onPress={() => updateRelationStatus(otherUser, 1)}
                text="Approve"
              />
              <ChatButton
                onPress={() => updateRelationStatus(otherUser, 2)}
                text="Decline"
              />
          </View>: otherUser.relationStatus==2  ? <CustomText color={colors.primary} fontSize={10} label={"You've blocked this user"} /> :null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={{ paddingHorizontal: 20 }}
      data={otherUsers}
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
      renderItem={renderRelations}
    />
  );
};

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
