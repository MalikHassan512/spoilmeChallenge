import { Platform,PermissionsAndroid } from 'react-native'
import Geolocation from "react-native-geolocation-service";

const requestLocationPermission = async (setLocation) => {
    if (Platform.OS === "ios") {
      getOneTimeLocation(setLocation);
      return true;
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This App needs to Access your location to show you other users on map",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return getOneTimeLocation(setLocation);
           
        } else {
         return false
        }
      } catch (err) {
        console.warn(err);
        return false
      }
    }
  };
  const getOneTimeLocation = (setLocation) => {
    return Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        return true
      },
      (error) => {
        console.log("getOneTimeLocation", error.message);
        return false
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  export default requestLocationPermission