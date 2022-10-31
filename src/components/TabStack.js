import React, { useEffect, useRef } from "react";
import { Image, PermissionsAndroid } from "react-native";
import { Profile } from "../screens/Tab/Profile";
import Relations from "../screens/Tab/Profile/Relations";
import ContactsScreen from "../screens/Tab/Profile/Contacts";
import { Relationship } from "../screens/Tab/Relationship";
import { Map } from "../screens/Tab/Map";
// import Home from "../screens/Tab/Home";
import { Spoil } from "../screens/Tab/Spoil";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Setting from "../screens/Tab/Profile/Setting";
import Posts from "../screens/Tab/Profile/Posts";
import { useSelector, useDispatch } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import { changeUserData } from "../firebase/firestore/users";
import { AppState } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { contactList } from "../redux/features/userSlice";
import Contacts from "react-native-contacts";

const Tab = createMaterialTopTabNavigator();

const Stack = createNativeStackNavigator();

export function TabStack() {
  const userId = useSelector((state) => state.user.userId);
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const requestContacts = async () => {
    try {
      if (Platform.OS === "ios") {
        const contacts = await Contacts.getAll();
        dispatch(contactList(contacts));
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: "Spoil Me Contacts Permission",
            message:
              "Spoil Me Need Access to Your contacts " +
              "to send users Spoils.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const contacts = await Contacts.getAll();
          dispatch(contactList(contacts));
        } else {
          console.log("PermissionsAndroid.PERMISSIONS.READ_CONTACTS ", granted);
        }
      }
    } catch (err) {
      console.warn("requestContactsAndroid" + err);
    }
  };
  useEffect(() => {
    requestContacts();
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
      if (appState.current == "active") {
        console.log("user is active", userId);
        if (userId)
          changeUserData({
            id: userId,
            isActive: true,
            lastActive: firestore.Timestamp.now(),
          });
      } else {
        if (userId)
          changeUserData({
            id: userId,
            isActive: false,
            lastActive: firestore.Timestamp.now(),
          });

        console.log("user is inactive", userId);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      tabBarPosition={"bottom"}
      screenOptions={({ route }) => ({
        tabBarIndicator: () => {},
        tabBarShowLabel: false,
        unmountOnBlur: true,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          if (route.name === "Spoil") {
            icon = focused
              ? require("../assets/images/wallet_red.png")
              : require("../assets/images/wallet_black.png");
          } else if (route.name === "Relationship") {
            icon = focused
              ? require("../assets/images/heart_red.png")
              : require("../assets/images/heart_black.png");
          } else if (route.name === "Map") {
            icon = focused
              ? require("../assets/images/map_red.png")
              : require("../assets/images/map_black.png");
          } else if (route.name === "ProfileStack") {
            icon = focused
              ? require("../assets/images/avatar_red.png")
              : require("../assets/images/avatar_black.png");
          }
          // else if (route.name === "Home") {
          //   icon = focused
          //   ? require("../assets/images/home_red.png")
          //   : require("../assets/images/home_black.png");
          // }
          return (
            <Image
              style={{
                width: scale(23),
                height: scale(18),
              }}
              resizeMode={"contain"}
              source={icon}
            />
          );
        },

        tabBarActiveTintColor: "#C71F1E",
        tabBarInactiveTintColor: "#000",
      })}
      initialRouteName="Spoil"
    >
      {/* <Tab.Screen name="Home" component={Home} /> */}
      <Tab.Screen name="Spoil" component={Spoil} />
      <Tab.Screen name="Relationship" component={Relationship} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  );
}
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="Contacts" component={ContactsScreen} />
    <Stack.Screen name="Relations" component={Relations} />
    <Stack.Screen name="Setting" component={Setting} />
    <Stack.Screen name="Posts" component={Posts} />
  </Stack.Navigator>
);
