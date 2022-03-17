import {
  View,
  StyleSheet,
  Pressable,
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

export const Map = () => {
  const [region, setRegion] = useState(null);
  const userId = useSelector(selectUser);
  const [relatedUsers, setRelatedUsers] = useState([]);
  const [selectedRelatedUser, setSelectedRelatedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user,setUser]=useState({})
  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    getUser(userId).then((user) => {
      setUser(user)
      setRegion({
        latitude: user.location.coords.latitude,
        longitude: user.location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    });

    getAllUsers().then((users) => setRelatedUsers(users));
    // getUserRelationships(userId)
    //   .then(relationships => {
    //     const tempRelatedUsersId = [];
    //     relationships.forEach(relationship => {
    //       if (relationship.user1 === userId)
    //         tempRelatedUsersId.push(relationship.user2);
    //       else tempRelatedUsersId.push(relationship.user1);
    //     });
    //     if (tempRelatedUsersId.length === 0) return;
    //     getUsersById(tempRelatedUsersId)
    //       .then(users => setRelatedUsers(users))
    //       .catch(e => {
    //         console.log(e);
    //         alert('Error occured');
    //       });
    //   })
    //   .catch(e => {
    //     console.log(e);
    //     alert('Error occured');
    //   });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {/* <View style={[{ alignItems: "center", padding: 20 }]}>
        <Image source={require("../../assets/images/bar_left.png")} />
        <Image
          style={{ width: 125, height: 31 }}
          source={require("../../assets/images/logo.png")}
        />
        <Pressable style={styles.searchButton}>
          <Image source={require("../../assets/images/search.png")} />
        </Pressable>
      </View> */}

      {region && relatedUsers && (
        <MapView
          style={{ width: "100%", height: "90%" }}
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
                    longitude: relatedUser.location.coords.longitude || 32.4,
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
});
