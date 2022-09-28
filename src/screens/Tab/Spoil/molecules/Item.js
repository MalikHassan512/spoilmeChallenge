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
import QRCode from "react-native-qrcode-svg";
import SpoilTransferModal from "../../../../components/SpoilTransferModal";
import { Relationship } from "../../Relationship";

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

  useEffect(() => {
    getUsersName();
  }, [length]);

  const toggleRespoilModal = () => {
    setSpoilTransferModalVisiblity(!showSpoilTransferModal);
    console.log("Show spoil transfer modal is: ", showSpoilTransferModal);

    setRespoilModalVisible(!respoilModalVisible);
    console.log("Toggling respoil modal: ", respoilModalVisible);
  };

  const toggleQRModal = () => {
    setSpoilTransferModalVisiblity(!showSpoilTransferModal);
    console.log("Show spoil transfer modal is: ", showSpoilTransferModal);
    setQRVisibility(!showQr);
  };

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
      <Modal
        useNativeDriver={true}
        animationType="slide"
        presentationStyle="formSheet"
        hardwareAccelerated={true}
        visible={respoilModalVisible}
      >
        <View>
          <Relationship />
        </View>
        <View>
          <Pressable onPress={() => setRespoilModalVisible(false)}>
            <Text
              style={{
                color: "#1e90ff",

                fontSize: 20,
              }}
            >
              Back
            </Text>
          </Pressable>
        </View>
      </Modal>
      <SpoilTransferModal
        userSpoil={spoil}
        isSpoilTransferModalVisible={showSpoilTransferModal}
        toggleSpoilTransferModal={toggleQRModal}
        respoilModal={toggleRespoilModal}
      />

      <Modal
        useNativeDriver={true}
        animationType="fade"
        transparent={true}
        hardwareAccelerated={true}
        visible={showQr}
      >
        <View style={styles.bottomView}>
          <View style={styles.modalView}>
            <QRCode value={spoil.id} logo={spoil.image} size={200} />
          </View>
          <Pressable onPress={() => setQRVisibility(!showQr)}>
            <View
              style={{
                minWidth: "80%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "#1e90ff",
                  padding: 25,
                  fontSize: 20,
                }}
              >
                Back
              </Text>
            </View>
          </Pressable>
        </View>
      </Modal>
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
