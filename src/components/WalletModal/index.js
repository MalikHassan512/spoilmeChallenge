import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import SpoilItem from "../../screens/Tab/Spoil/molecules/Item";

const WalletModal = (props) => {
  return (
    <Modal
      useNativeDriver={true}
      animationType="fade"
      transparent={true}
      hardwareAccelerated={true}
      visible={props.isModalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              padding: 30,
              borderBottomWidth: 1,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 25,
              }}
            >
              Spoils you own
            </Text>
          </View>
          <View
            style={{
              maxHeight: "80%",
              minHeight: "40%",
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            <ScrollView>
              {props.userSpoils.map((spoilGroup, i) => {
                return (
                  <View key={i}>
                    {spoilGroup.map((spoil, j) => {
                      return (
                        <SpoilItem
                          setModalVisible={props.setModalVisible}
                          key={spoil.id + j}
                          length={spoil.length}
                          userId={props.userId}
                          spoil={spoil}
                          showQRMenu={true}
                        />
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <Pressable onPress={props.toggleModal}>
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
      </View>
    </Modal>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  modalView: {
    maxHeight: "80%",
    minHeight: "40%",
    paddingTop: 20,
    margin: 20,
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
  outerContainer: {
    flex: 1,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    flexDirection: "row",
  },
  infosContainer: {
    width: "100%",
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  infoContainer: {
    padding: 20,

    paddingLeft: 10,
    width: "45%",
    borderWidth: 3,
    borderRadius: 10,
  },
  button: {
    color: "red",
    height: "10%",
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
    borderColor: "red",
    alignItems: "center",
    borderWidth: 3,

    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
});
