import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { LoadingImage } from "../../../../components/Common/LoadingImage";
import { MyHeading } from "../../../../components/Common/MyHeading";
import { MyText } from "../../../../components/Common/MyText";
import { getUsersById } from "../../../../firebase/firestore/users";
import { ActivityIndicator } from "react-native-paper";
import SpoilTransferModal from "../../../../components/SpoilTransferModal";
import { Relationship } from "../../Relationship";
import QRModal from "../../../../components/QRModal";
import RespoilModal from "../../../../components/RespoilModal";

const SpoilItem = ({
  spoil,
  userId,
  length,
  setModalVisible,
  showQRMenu = false,
}) => {
  const navigation = useNavigation();
  const [fromUser, setFromUser] = useState({});
  const [toUser, setToUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSpoilTransferModal, setSpoilTransferModalVisiblity] =
    useState(false);
  const [showQr, setQRVisibility] = useState(false);
  const [respoilModalVisible, setRespoilModalVisible] = useState(false);

  const toggleRespoilModal = () => {
    setSpoilTransferModalVisiblity(!showSpoilTransferModal);
    // console.log("Show spoil transfer modal is: ", showSpoilTransferModal);

    setRespoilModalVisible(!respoilModalVisible);
    // console.log("Toggling respoil modal: ", respoilModalVisible);
  };

  const toggleQRModal = () => {
    setSpoilTransferModalVisiblity(!showSpoilTransferModal);
    // console.log("Show spoil transfer modal is: ", showSpoilTransferModal);
    setQRVisibility(!showQr);
  };

  useEffect(() => {
    getUsersName();
  }, [length]);

  const getUsersName = async () => {
    try {
      setLoading(true);
      const users = await getUsersById([spoil.to, spoil.from]);
      if (users[0].id == userId) {
        setFromUser(users[0]);
        setToUser(users[1]);
      } else {
        setFromUser(users[1]);
        setToUser(users[0]);
      }
      setLoading(false);
    } catch (error) {
      console.log("getUsersName line 23", error);
      setLoading(false);
    }
  };
  return loading ? (
    <View
      style={[
        styles.img,
        { marginBottom: 10, alignItems: "center", justifyContent: "center" },
      ]}
    >
      <ActivityIndicator color={"black"} />
    </View>
  ) : (
    <TouchableOpacity
      disabled={spoil.isAdmin}
      activeOpacity={0.8}
      onPress={() => {
        if (showQRMenu) {
          setSpoilTransferModalVisiblity(!showSpoilTransferModal);
          // setQRVisibility(!showQr);
        } else {
          if (setModalVisible) {
            setModalVisible(false);
          }
          navigation.navigate("Chat", {
            user: fromUser,
            relatedUser: toUser,
          });
        }
      }}
    >
      <SpoilTransferModal
        userSpoil={spoil}
        isSpoilTransferModalVisible={showSpoilTransferModal}
        toggleSpoilTransferModal={toggleQRModal}
        respoilModal={toggleRespoilModal}
      />

      <RespoilModal
        isRespoilModalVisible={respoilModalVisible}
        setRespoilModalVisible={setRespoilModalVisible}
        userSpoil={spoil}
      />
      <QRModal
        showQr={showQr}
        spoil={spoil}
        setQRVisibility={setQRVisibility}
      />

      <View style={styles.spoilContainer}>
        <LoadingImage source={{ uri: spoil.image }} style={styles.img} />
        <View>
          <MyHeading text={spoil.name} fontSize={18} />
          <MyText
            text={
              spoil.isAdmin
                ? "Received from Admin"
                : userId != spoil.from
                ? `Received from ${
                    (toUser?.firstName || "") + " " + (toUser?.lastName || "")
                  }`
                : userId == spoil.from
                ? `Sent to ${
                    (toUser?.firstName || "") + " " + (toUser?.lastName || "")
                  }`
                : null
            }
            color="gray"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SpoilItem;

const styles = StyleSheet.create({
  modalView: {
    maxWidth: "90%",
    minHeight: "40%",
    width: "80%",
    paddingTop: 20,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  bottomView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingBottom: 60,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ECECEC",
    marginRight: 10,
  },
  spoilContainer: {
    flexDirection: "row",
    alignContent: "center",
    marginBottom: 10,
    marginLeft: 5,
    alignItems: "center",
  },
});
