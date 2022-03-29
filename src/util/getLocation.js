import { Platform,PermissionsAndroid } from 'react-native'
import Geolocation from "react-native-geolocation-service";

const requestLocationPermission = async (setLocation) => {
    if (Platform.OS === "ios") {
      getOneTimeLocation(setLocation);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This App needs to Access your location for address",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation(setLocation);
        } else {
          console.log("Permission Denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const getOneTimeLocation = (setLocation) => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        // console.log("positon", position);
        setLocation(position);
      },
      (error) => {
        console.log("getOneTimeLocation", error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  export default requestLocationPermission