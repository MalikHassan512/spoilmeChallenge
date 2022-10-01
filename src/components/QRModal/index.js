import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QRModal = (props) => {
  return (
    <Modal
      useNativeDriver={true}
      animationType="fade"
      transparent={true}
      hardwareAccelerated={true}
      visible={props.showQr}
    >
      <View style={styles.bottomView}>
        <View style={styles.modalView}>
          <QRCode
            value={props.spoil.id}
            logo={props.spoil.image}
            logoSize={30}
            logoBackgroundColor="white"
            size={200}
          />
        </View>
        <Pressable
          onPress={() => {
            console.log("QR code props image is: ", props.spoil.image);
            props.setQRVisibility(!props.showQr);
          }}
        >
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
  );
};

export default QRModal;

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
