import React, { useState } from "react";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Button,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

import {
  getAllSpoilMeUsers,
  transferUserSpoil,
} from "../../firebase/firestore/spoils";
import { useEffect } from "react";
import { LoadingImage } from "../Common/LoadingImage";
import colors from "../../util/colors";
import { selectUser } from "../../redux/features/userSlice";
import { useSelector } from "react-redux";

const RespoilModal = (props) => {
  const userId = useSelector(selectUser);
  const isFocused = useIsFocused();
  const [allSpoilMeUsers, setAllSpoilMeUsers] = useState([]);

  if (isFocused) {
    useEffect(() => {
      getAllSpoilMeUsers(setAllSpoilMeUsers);
    }, [isFocused]);
  }

  return (
    <Modal
      useNativeDriver={true}
      animationType="slide"
      presentationStyle="formSheet"
      hardwareAccelerated={true}
      visible={props.isRespoilModalVisible}
    >
      <View style={styles.container}>
        <FlatList
          data={allSpoilMeUsers}
          keyExtractor={(item, index) => item?.id + index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Transfer Spoil",
                  "Are you sure you want to transfer this spoil to: " +
                    item.firstName +
                    " " +
                    item.lastName,
                  [
                    {
                      text: "Confirm",
                      onPress: () => {
                        transferUserSpoil(userId, item.id, props.userSpoil.id);
                        console.log("Confirm Pressed");
                      },
                      style: "cancel",
                    },
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                    },
                  ]
                );
              }}
            >
              <View style={styles.userContainer}>
                <View width="20%">
                  <LoadingImage
                    style={[
                      styles.profilePic,
                      item?.isActive && {
                        borderColor: colors.photoBorder,
                        borderWidth: 3,
                      },
                    ]}
                    source={{ uri: item?.profilePic }}
                  />
                </View>
                <View width="80%" justifyContent="center" alignContent="center">
                  <Text
                    style={{
                      paddingLeft: 20,
                      fontSize: 18,
                      color: "black",
                      textAlign: "left",
                      fontWeight: "bold",
                      marginBottom: 15,
                    }}
                  >{`${item?.firstName || ""} ${
                    item?.lastName?.[0] || ""
                  }.`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          height: "5%",
        }}
      >
        <Pressable onPress={props.setRespoilModalVisible}>
          <Text
            style={{
              color: "#1e90ff",
              alignContent: "center",
              fontSize: 20,
            }}
          >
            Back
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default RespoilModal;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "92.5%",
    backgroundColor: "white",
    padding: 20,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 36,
  },
  modalView: {
    maxHeight: "80%",
    minHeight: "60%",
    maxWidth: "90%",
    paddingTop: 20,
    backgroundColor: "white",
    borderRadius: 20,

    alignItems: "center",

    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0,0,0,0.75)",
  },

  button: {
    width: "40%",
    color: "black",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 10,
    backgroundColor: "#66c2ff",
    borderColor: "#008ae6",
    alignItems: "center",
    borderWidth: 3,
    elevation: 3,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",

    paddingTop: 6,
    marginBottom: 2,
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
