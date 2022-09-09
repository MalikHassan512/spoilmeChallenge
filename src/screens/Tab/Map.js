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
import MapModal from "../../components/Map/MapModal";
import Header from "../../components/Header";
import SimpleToast from "react-native-simple-toast";
import requestLocationPermission  from '../../util/getLocation'
import { changeUserData } from "../../firebase/firestore/users";
import { Loading } from "components/Common/Loading";

import Geolocation from 'react-native-geolocation-service';
import RNPermissions, {request,check, NotificationOption, Permission, PERMISSIONS,RESULTS} from 'react-native-permissions';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA + ASPECT_RATIO;

export const Map = ({ navigation }) => {
  const [currentUserLocation,setCurrentUserLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const userId = useSelector(selectUser);
  const [relatedUsers, setRelatedUsers] = useState([]);
  const [selectedRelatedUser, setSelectedRelatedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true)
  const closeModal = () => {
    setModalVisible(false);
  };

  
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true)
      getUser(userId).then(async (user) => {
        if (user) {
          setUser(user);
          console.log("setting user as user exists");

            if(user?.location?.coords){
              console.log("in if condition")
              console.log("setting user as user exists");
              
          console.log(user?.location?.coords?.latitude);
          console.log(user?.location?.coords?.longitude);

          await requestLocationPermission(async(location)=>{
            console.log("logging location")              
            console.log(location)
            setRegion({
              latitude:location?.coords?.latitude ||  31.3914008,
              longitude:location.coords?.longitude || 32.8377671,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            });
           await changeUserData({
              id: userId,
              location: location,
            });
            });

              setRegion({
                latitude: user?.location?.coords?.latitude ,
                longitude: user?.location.coords?.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              });
            }
            else {
              console.log("In else");

            const permission = await requestLocationPermission(async(location)=>{
              console.log("logging location")              
              console.log(location)
              setRegion({
                latitude:location?.coords?.latitude ||  31.3914008,
                longitude:location.coords?.longitude || 32.8377671,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              });
             await changeUserData({
                id: userId,
                location: location,
              });
              })
              setLoading(false)
              if(!permission){
                setRegion({
                  latitude:  31.3914008,
                  longitude: 32.8377671,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                });
              }
            }
          getAllUsers().then((users) => setRelatedUsers(users));
        } else {

          setRegion({
            latitude:31.3914008,
            longitude: 32.8377671,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        }
        setLoading(false)

      }).catch(error=>{
        console.log('map error line 90',error)
        setLoading(false)
      });

    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  const searchedUser = () => {
    getAllUsers().then((users) => {
      let user = users.find((user) =>user.id!=userId && user?.email?.split("@")?.[0] == searchText.trim().toLowerCase());
      if(user){
      setRegion({
        latitude: user.location.coords.latitude,
        longitude: user.location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }else{
      SimpleToast.show("User not found")
    }
    });
  };

  return (
    loading ? <Loading  /> : <SafeAreaView style={styles.container}>
      {(region && relatedUsers) ? (
        <>
          <Header
          searchedUser={searchedUser}
          searchText={searchText}
          setSearchText={setSearchText}
          sImgContainerStyle={styles.searchIcon}
          sImgPath={require("../../assets/images/search.png")}
          containerStyle={styles.headerContainer}
        />
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
        </>
      ):
      loading ? <Loading  /> :
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={styles.emptyText}>Please enable location permission from setting to use this feature</Text>
          </View>
      }
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
  emptyText: {
    color: '#000',
    fontWeight: "bold",
    fontSize: 22,
    paddingHorizontal:20,
    textAlign:'center'
  },
});
