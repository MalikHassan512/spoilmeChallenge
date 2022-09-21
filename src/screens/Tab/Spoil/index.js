import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";
import { MyHeading } from "../../../components/Common/MyHeading";

import { getSpoils, getUserSpoils } from "../../../firebase/firestore/spoils";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/userSlice";
import SpoilItem from "./molecules/Item";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { BlurView } from "@react-native-community/blur";
import { useIsFocused } from "@react-navigation/native";

// import Modal from "react-native-modal";

export const Spoil = ({ navigation }) => {
  const userId = useSelector(selectUser);
  const [spoils, setSpoils] = useState([]);
  const [userSpoils, setUserSpoils] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const spoilSubscriber = getSpoils(userId, setSpoils);
    return () => {
      spoilSubscriber();
    };
  }, [userId]);

  useEffect(() => {
    if (isFocused) {
      console.log("Fetching user spoils");
      getUserSpoils(userId, setUserSpoils);
    }
  }, [isFocused]);

  const toggleModal = () => {
    console.log("Toggling modal to: ", isModalVisible);
    setModalVisible(!isModalVisible);
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View>
        <BlurView
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        >
          <Modal
            useNativeDriver={true}
            animationType="fade"
            transparent={true}
            hardwareAccelerated={true}
            visible={isModalVisible}
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
                    {userSpoils.map((spoilGroup, i) => {
                      return (
                        <View key={i}>
                          {spoilGroup.map((spoil, j) => {
                            return (
                              <SpoilItem
                                setModalVisible={setModalVisible}
                                key={spoil.id + j}
                                length={spoils.length}
                                userId={userId}
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
                <Pressable onPress={toggleModal}>
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
        </BlurView>

        <MyHeading text="Your Spoils" fontSize={23} />
        <View style={styles.infosContainer}>
          <LinearGradient
            style={styles.infoContainer}
            colors={["#FFE37E", "#FFBC08"]}
          >
            <MyHeading text="$0" fontSize={25} />
            <MyHeading text="Your balance" fontSize={15} />
          </LinearGradient>
          <TouchableOpacity
            style={[styles.infoContainer, { backgroundColor: "red" }]}
            onPress={toggleModal}
          >
            <View>
              <MyHeading text={userSpoils.length} color="white" fontSize={25} />
              {spoils.length == 1 ? (
                <MyHeading text="Spoil available" color="white" fontSize={15} />
              ) : (
                <MyHeading
                  text="Spoils available"
                  color="white"
                  fontSize={15}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {spoils.map((spoilGroup, i) => {
            return (
              <View key={i} style={{ marginVertical: 5 }}>
                {spoilGroup.length > 0 && (
                  <MyHeading
                    marginBottom={10}
                    text={spoilGroup[0].date.toDateString()}
                  />
                )}
                {spoilGroup.map((spoil, j) => {
                  return (
                    <SpoilItem
                      key={spoil.id + j}
                      length={spoils.length}
                      userId={userId}
                      spoil={spoil}
                      showQRMenu={false}
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

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
