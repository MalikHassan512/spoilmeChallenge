import { Alert,Platform,PermissionsAndroid } from 'react-native'
import Geolocation from "react-native-geolocation-service";
import { request, PERMISSIONS, RESULT } from "react-native-permissions";


function getUserLocation() {
  Geolocation.getCurrentPosition(
    (position) => {

      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        coordinates: this.state.coordinates.concat({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });
    },
    (error) => {
      Alert.alert(error.message.toString());
    },
    {
      showLocationDialog: true,
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    }
  );
}

request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
  switch (result) {
    case RESULTS.UNAVAILABLE:
      console.log(
        "This feature is not available (on this device / in this context)"
      );
      break;
    case RESULTS.DENIED:
      console.log(
        "The permission has not been requested / is denied but requestable"
      );
      break;
    case RESULTS.LIMITED:
      console.log("The permission is limited: some actions are possible");
      break;
    case RESULTS.GRANTED:
      console.log("The permission is granted");
      // Permission has been granted - app can request location coordinates
      getUserLocation();
      break;
    case RESULTS.BLOCKED:
      console.log("The permission is denied and not requestable anymore");
      break;
  }
});

const hasPermissionIOS = async () => {
  console.log("In has permission IOS");
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
      console.log("Unable to open settings");
    });
  };
  const status = await Geolocation.requestAuthorization("whenInUse");

  if (status === 'granted') {
    console.log("Location permissions are granted");
    return true;
  }

  if (status === 'denied') {
    console.log("Location permission denied");
    Alert.alert('Location permission denied');
  }

  if (status === 'disabled') {
    console.log("Location permissions disabled");
    Alert.alert(
      `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
      '',
      [
        { text: 'Go to Settings', onPress: openSetting },
        { text: "Don't Use Location", onPress: () => {} },
      ],
    );
  }

  return false;
};


const requestLocationPermission = async (setLocation) => {
  console.log("getting ios location permissions");
    if (Platform.OS === "ios") {
      await hasPermissionIOS();
      console.log("Permissions checked returning true")
      console.log("Setting current location")
      getOneTimeLocation(setLocation)
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
        console.log("Current location fetched")
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