import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { LoadingImage } from "../Common/LoadingImage";
import { MyHeading } from "../Common/MyHeading";
import { getAllSpoilTypes } from "../../firebase/firestore/spoils";
import * as Progress from "react-native-progress";
import { sendMessage } from "../../firebase/firestore/chats";
import {
  createRelationship,
  checkUserRelationships,
  updateRelationStatus,
} from "../../firebase/firestore/relationships";
import colors from "../../util/colors";
import SimpleToast from "react-native-simple-toast";
import CustomText from "../CustomText";
import moment from "moment";

export default function MapModal({
  userId,
  user,
  relatedUser,
  modalVisible,
  closeModal,
}) {
  const [spoilTypes, setSpoilTypes] = useState([]);
  const [loadingId, setLoadingId] = useState(-1);
  useEffect(() => {
    getAllSpoilTypes()
      .then((res) => setSpoilTypes(res))
      .catch((e) => {
        console.log(e);
        alert("Error occured");
      });
  }, []);

  const handleSpoilPress = async (spoilType) => {
    setLoadingId(spoilType.name)
    const relationStatus = await checkUserRelationships(userId, relatedUser.id);
    let messages = {};
    if (!relationStatus) {
      messages = await sendMessage(
        user,
        relatedUser,
        spoilType,
        `Here’s a ${spoilType.name}, enjoy!`,
        0
      );
      // console.log("messages", messages);
      await createRelationship(
        user,
        relatedUser,
        `Here’s a ${spoilType.name}, enjoy!`,
        0,
        messages
      );
      // console.log("relation created");
    } else {
      messages = await sendMessage(
        user,
        relatedUser,
        spoilType,
        `Here’s a ${spoilType.name}, enjoy!`,
        0
      );
      await updateRelationStatus(relationStatus, messages);
      // console.log("relation already exist");
    }
    setLoadingId("")
    SimpleToast.show("Spoil sent")
    // alert("Spoil sent");
  };

  return (
    <Modal
      isVisible={modalVisible}
      onBackButtonPress={closeModal}
      style={styles.modal}
      onBackdropPress={closeModal}
    >
      <View>
        <View style={styles.top}>
          <View style={styles.user}>
            <LoadingImage
              source={{ uri: relatedUser.profilePic }}
              style={styles.profilePic}
            />
            <View>
            <MyHeading
              text={`${relatedUser.firstName} ${relatedUser.lastName}`}
            />
            <CustomText marginTop={3} color={"#A1A1A1"} label={relatedUser?.isActive ? "Active now" : `Last active ${moment(relatedUser?.lastActive || new Date()).fromNow()}`}  />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {spoilTypes.map((spoilType, i) => {
              return (
                <TouchableOpacity
                  onPress={() => handleSpoilPress(spoilType)}
                  key={i}
                  style={styles.spoilTypes}
                >
                  {spoilType.name == loadingId ? (
                    <Progress.Circle
                      indeterminate
                      size={65}
                      color={colors.primary}
                      style={{ alignSelf: "center",  }}
                    />
                  ) : (
                    <LoadingImage
                      source={{ uri: spoilType.image }}
                      style={[styles.profilePic, { marginRight: 0 }]}
                    />
                  )}

                  <Text
                    style={{ marginTop: 8, fontWeight: "bold", color: "#000" }}
                  >{`\$${10 + 5 * i}`}</Text>
                  {/* <MyText  text=  /> */}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.btn} onPress={closeModal}>
          <MyHeading text="Cancel" textAlign="center" color="red" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: "flex-end" },
  top: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#EAEAEA",
  },
  profilePic: {
    marginRight: 20,
    width: 70,
    height: 70,
    borderWidth: 2,
    borderRadius: 50,
  },
  spoilTypes: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  btn: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 20,
  },
});
