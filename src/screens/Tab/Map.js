import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  SafeAreaView,
  Text,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useState, useEffect } from "react";
import { getUserRelationships } from "../../firebase/firestore/relationships";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { getUser, getAllUsers } from "../../firebase/firestore/users";
import { LoadingImage } from "../../components/Common/LoadingImage";
import MapHeader from "../../components/Map/MapHeader";
import MapModal from "../../components/Map/MapModal";
import { MyText } from "../../components/Common/MyText";
import Header from "../../components/Header";
import SimpleToast from "react-native-simple-toast";
const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA + ASPECT_RATIO;

export const Map = ({ navigation }) => {
  const [region, setRegion] = useState(null);
  const userId = useSelector(selectUser);
  const [relatedUsers, setRelatedUsers] = useState([]);
  const [selectedRelatedUser, setSelectedRelatedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({});
  const [searchText, setSearchText] = useState("");
  const closeModal = () => {
    setModalVisible(false);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUser(userId).then((user) => {
        if (user) {
          setUser(user);
          setRegion({
            latitude: user.location.coords.latitude,
            longitude: user.location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        } else {
          setRegion({
            latitude: 31.3914008,
            longitude: 32.8377671,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      });

      getAllUsers().then((users) => setRelatedUsers(users));
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  const searchedUser = () => {
    getAllUsers().then((users) => {
      let user = users.find((user) =>user.id!=userId && user.email == searchText.trim().toLowerCase());
      console.log('user',user)
      if(user){
      setRegion({
        latitude: user.location.coords.latitude,
        longitude: user.location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }else{
      // console.log("helos")
      SimpleToast.show("User not found")
    }
      // console.log("tempUser", tempUser);
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        searchedUser={searchedUser}
        searchText={searchText}
        setSearchText={setSearchText}
        sImgContainerStyle={styles.searchIcon}
        sImgPath={require("../../assets/images/search.png")}
        containerStyle={styles.headerContainer}
      />
      {/* <View style={[{ alignItems: "center", padding: 20 }]}>
        <Image source={require("../../assets/images/bar_left.png")} />
        <Image
          style={{ width: 125, height: 31 }}
          source={require("../../assets/images/logo.png")}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image source={require("../../assets/images/search.png")} />
        </TouchableOpacity>
      </View> */}
      {region && relatedUsers && (
        <MapView
          style={{ width: "100%", height: "100%" }}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {relatedUsers.map((relatedUser, index) => {
            return (
              userId != relatedUser?.id && (
                <Marker
                  key={index}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setSelectedRelatedUser(relatedUser);
                  }}
                  coordinate={{
                    latitude: relatedUser?.location?.coords?.latitude || 32.2,
                    longitude: relatedUser?.location?.coords?.longitude || 32.4,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 10,
                      borderRadius: 15,
                    }}
                  >
                    <LoadingImage
                      style={{ width: 50, height: 50, borderRadius: 50 }}
                      source={{ uri: relatedUser.profilePic }}
                    />
                  </View>
                  <View
                    style={{
                      width: 0,
                      height: 0,
                      borderLeftWidth: 6,
                      borderRightWidth: 6,
                      borderTopWidth: 10,
                      borderColor: "transparent",
                      borderTopColor: "white",
                      alignSelf: "center",
                    }}
                  ></View>
                </Marker>
              )
            );
          })}
        </MapView>
      )}
      {selectedRelatedUser && (
        <MapModal
          userId={userId}
          user={user}
          relatedUser={selectedRelatedUser}
          closeModal={closeModal}
          modalVisible={modalVisible}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    zIndex: 99,
    position: "absolute",
    marginTop: 15,
    alignItems: "flex-start",
  },
  searchIcon: {
    backgroundColor: "white",
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
