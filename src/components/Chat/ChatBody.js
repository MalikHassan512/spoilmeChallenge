import { StyleSheet, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { getMessages, updateSpoilStatus } from "../../firebase/firestore/chats";
import { updateRelationStatus } from "../../firebase/firestore/relationships";
import { LoadingImage } from "../Common/LoadingImage";
import { MyText } from "../Common/MyText";
import ChatButton from "./ChatButton";
import CustomText from "../CustomText";
import colors from "../../util/colors";
import {chatFormat} from "../../util/helper";
export const ChatBody = ({ userId, relatedUserId}) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const messageSubscriber = getMessages(userId, relatedUserId, setMessages);
    return () => messageSubscriber();
  }, [userId, relatedUserId]);
  const updateStatus = (message, status, index) => {

    updateSpoilStatus(message.id, status);
    if (messages.length - 1 == index) {
      updateRelationStatus(
        userId,
        relatedUserId,
        status
      );
    }
  };
  const renderMessages = ({ index, item: message }) => {
    const isUser = message?.from === userId;
    return (
      <View key={index} style={{ padding: 5 }}>
        <View
          style={{
            alignSelf: isUser ? "flex-end" : "flex-start",
            minWidth: "50%",
          }}
        >
          <View
            style={[
              styles.message,

              isUser && {
                backgroundColor: "white",
                borderColor: "#E8E8E8",
                borderWidth: 1,
              },
            ]}
          >
            <MyText text={message.text} />
            {message.spoilStatus === 0 && !isUser ? (
              <View style={{ flexDirection: "row" }}>
                <ChatButton
                  onPress={() => updateStatus(message, 1,index)}
                  text="Approve"
                />
                <ChatButton
                  onPress={() => updateStatus(message, 2,index)}
                  text="Decline"
                />
              </View>
            ) : message.spoilStatus === 1 && !isUser ? (
              <CustomText
                color={colors.green}
                textStyle={{ bottom: -7, right: 25 }}
                fontSize={10}
                label="You've accepted this spoil"
              />
            ) : message.spoilStatus === 2 && !isUser ? (
              <CustomText
                color={colors.primary}
                textStyle={{ bottom: -7, right: 25 }}
                fontSize={10}
                label="You've rejected this spoil"
              />
            ) : null}
          </View>
          <MyText
          
            textStyle={isUser && { alignSelf: "flex-end" }}
            text={`${isUser ? "Sent on" : "Received on"}  ${
              chatFormat(message.date,"M.D.YY hh:MM")
              }`}
          />
          <LoadingImage
            source={{ uri: message?.spoil?.image }}
            style={[
              styles.messageSpoil,
              isUser && { alignSelf: "flex-start", left: -15 },
            ]}
          />
        </View>
      </View>
    );
  };
  return (
    <FlatList
      data={messages}
      renderItem={renderMessages}
      style={styles.chat}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  chat: {
    padding: 15,
    height: "75%",
  },
  message: {
    backgroundColor: "#F3F3F3",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 10,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  messageSpoil: {
    height: 30,
    width: 30,
    alignSelf: "flex-end",
    top: -30,
    right: -15,
  },
});
