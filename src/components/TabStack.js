import React from "react";
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
import { Platform } from "react-native";
import Setting from "../screens/Tab/Profile/Setting";
import Posts from "../screens/Tab/Profile/Posts";
const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();
export function TabStack() {
  return (
    <Tab.Navigator
      tabBarPosition={"bottom"}
      screenOptions={({ route }) => ({
        tabBarIndicator: () => {},
        tabBarItemStyle: { padding: 0 },
        tabBarLabelStyle: { fontSize: 10 },
        // keyboardHidesTabBar: Platform.OS === 'ios' ? false : true,
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
              ? require("../assets/images/hearts.png")
              : require("../assets/images/hearts.png");
          } else if (route.name === "Map") {
            icon = focused
              ? require("../assets/images/mapClick.png")
              : require("../assets/images/map.png");
          } else if (route.name === "ProfileStack") {
            icon = focused
              ? require("../assets/images/profileClick.png")
              : require("../assets/images/profile.png");
          } else if (route.name === "Home") {
            icon = require("../assets/images/home.png");
          }
          return (
            <Image
              style={{
                width: 22,
                height: 25,
                tintColor: focused ? "#C71F1E" : "#878787",
              }}
              resizeMode={"contain"}
              source={icon}
            />
          );
        },
        tabBarActiveTintColor: "#C71F1E",
        tabBarInactiveTintColor: "#878787",
      })}
    >
      <Tab.Screen name="Spoil" component={Spoil} />
      <Tab.Screen name="Relationship" component={Relationship} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen
        options={{ tabBarLabel: "Profile" }}
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
