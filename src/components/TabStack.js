import React,{useEffect,useRef} from "react";
import { Image } from "react-native";
import { Profile } from "../screens/Tab/Profile";
import Relations from "../screens/Tab/Profile/Relations";
import Contacts from "../screens/Tab/Profile/Contacts";
import { Relationship } from "../screens/Tab/Relationship";
import { Map } from "../screens/Tab/Map";
import Home from "../screens/Tab/Home";
import { Spoil } from "../screens/Tab/Spoil";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Setting from "../screens/Tab/Profile/Setting";
import Posts from "../screens/Tab/Profile/Posts";
import {useSelector} from 'react-redux'
import firestore from "@react-native-firebase/firestore";
import { changeUserData } from "../firebase/firestore/users";
import { AppState,  } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();
export function TabStack() {
const userId= useSelector(state=>state.user.userId)
const appState = useRef(AppState.currentState);

useEffect(() => {
  const subscription = AppState.addEventListener("change", (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }

    appState.current = nextAppState;
    // console.log("AppState", appState.current);
    if (appState.current == "active") {
      console.log("user is active",userId);
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
        tabBarShowLabel:false,
        unmountOnBlur: true,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          if (route.name === "Spoil") {
            icon = focused
              ? require("../assets/images/spoilClick.png")
              : require("../assets/images/spoil.png");
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
          } else if (route.name === "Home") {
            icon = focused
            ? require("../assets/images/home_red.png")
            : require("../assets/images/home_black.png");
          }
          return (
            <Image
              style={{
                width: scale(23),
                height: verticalScale(23),
              }}
              resizeMode={"contain"}
              source={icon}
            />
          );
        },
        tabBarActiveTintColor: "#C71F1E",
        tabBarInactiveTintColor: "#000",
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Spoil" component={Spoil} />
      <Tab.Screen name="Relationship" component={Relationship} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
}
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="Contacts" component={Contacts} />
    <Stack.Screen name="Relations" component={Relations} />
    <Stack.Screen name="Setting" component={Setting}/>
    <Stack.Screen name="Posts" component={Posts}/>
  </Stack.Navigator>
);
