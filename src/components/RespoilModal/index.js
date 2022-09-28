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

import { Relationship } from "../../screens/Tab/Relationship";

const RespoilModal = (props) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        minHeight: "60%",
      }}
    >
      <Modal
        useNativeDriver={true}
        animationType="slide"
        //   transparent={true}
        presentationStyle="formSheet"
        hardwareAccelerated={true}
        visible={props.isRespoilModalVisible}
      >
        <View>
          {/* <Relationship navigation={navigation} /> */}

          <Pressable onPress={props.setRespoilModalVisible}>
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
    </View>
  );
};

export default RespoilModal;

const styles = StyleSheet.create({
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
});
