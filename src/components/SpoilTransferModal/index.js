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
} from "react-native";

import { LoadingImage } from "../Common/LoadingImage";

const SpoilTransferModal = (props) => {
  const navigation = useNavigation();

  return (
    <Modal
      useNativeDriver={true}
      animationType="fade"
      transparent={true}
      hardwareAccelerated={true}
      visible={props.isSpoilTransferModalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginBottom: 15, // to add bottom spacing
              height: "30%",
            }}
          >
            <LoadingImage
              source={{ uri: props.userSpoil.image }}
              style={styles.img}
            />
          </View>
          <View
            style={{
              height: "10%",
              justifyContent: "center",
              alignItems: "center",

              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 25,
              }}
            >
              {props.userSpoil.name}
            </Text>
          </View>
          <View
            style={{
              height: "30%",

              marginBottom: 25,
            }}
          >
            <Text
              style={{
                fontSize: 20,
              }}
            >
              This is place holder description This is place holder description
              This is place holder description This is place holder description
            </Text>
          </View>

          <View
            style={{
              width: "80%",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Button
              onPress={props.toggleSpoilTransferModal}
              color="#00cc44"
              title="Redeem"
            />

            <Button
              color="#ff3333"
              onPress={props.respoilModal}
              title="Respoil"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SpoilTransferModal;

const styles = StyleSheet.create({
  img: {
    width: 100,
    height: 100,
    borderRadius: 36,
  },
  modalView: {
    maxHeight: "60%",
    minHeight: "40%",
    maxWidth: "90%",
    paddingTop: 20,

    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    paddingLeft: 10,
    paddingRight: 10,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
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
});
