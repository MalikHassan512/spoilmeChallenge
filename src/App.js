import { NavigationContainer,DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Signup } from "./screens/Auth/Signup";
import { Signin } from "./screens/Auth/Signin";
import { ForgotPassword } from "./screens/Auth/ForgotPassword";
import { Chat } from "./screens/Chat";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeUser,
  selectUser,
  contactList,
} from "./redux/features/userSlice";
import { checkAuth } from "./firebase/auth/checkAuth";
import { Loading } from "./components/Common/Loading";
import { TabStack } from "./components/TabStack";
import { CreateRelationship } from "./screens/CreateRelationship";
import firestore from "@react-native-firebase/firestore";
import { changeUserData } from "./firebase/firestore/users";
import Contacts from "react-native-contacts";
import React, { useRef, useState, useEffect } from "react";
import { AppState, Platform, PermissionsAndroid } from "react-native";

const Main = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state=>state.user.userId);
  const Stack = createNativeStackNavigator();
  const [loading, setLoading] = useState(true);
  const appState = useRef(AppState.currentState);
  const theme= {
    ...DefaultTheme,
    colors:{
      ...DefaultTheme.colors,
      background:'#fff'
    }
  }
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
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    const authSubscriber = checkAuth((user) => dispatch(changeUser(user?.uid)));
    return () => {
      if (authSubscriber) authSubscriber();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === "ios") {
      Contacts.getAll((err, contacts) => {
        if (err) {
          throw err;
        }
        dispatch(contactList(contacts));
      });
    } else {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "Spoil-ME would like to view your contacts.",
        buttonPositive: "Please accept bare mortal",
      }).then(
        Contacts.getAll()
          .then((contacts) => {
            // work with contacts
            dispatch(contactList(contacts));

            // console.log(contacts)
          })
          .catch((e) => {
            console.log("contacts error", e);
          })
      );
    }
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <NavigationContainer theme={theme}>
      {!userId ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Signin" component={Signin} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tab" component={TabStack} />
          <Stack.Screen name="Chat" component={Chat} />

          <Stack.Screen
            name="CreateRelationship"
            component={CreateRelationship}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default App;
