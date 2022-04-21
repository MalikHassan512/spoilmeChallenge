import { NavigationContainer,DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Signup } from "./screens/Auth/Signup";
import { Signin } from "./screens/Auth/Signin";
import { ForgotPassword } from "./screens/Auth/ForgotPassword";
import { Chat } from "./screens/Chat";
import { Provider } from "react-redux";
import { store,persistor } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeUser,
  contactList,
} from "./redux/features/userSlice";
import { checkAuth } from "./firebase/auth/checkAuth";
import { Loading } from "./components/Common/Loading";
import { TabStack } from "./components/TabStack";
import { CreateRelationship } from "./screens/CreateRelationship";
import Contacts from "react-native-contacts";
import React, { useRef, useState, useEffect } from "react";
import { AppState, Platform, PermissionsAndroid } from "react-native";
import { PersistGate } from 'redux-persist/integration/react'

const Main = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state=>state.user.userId);
  const Stack = createNativeStackNavigator();
  const [loading, setLoading] = useState(true);
  const theme= {
    ...DefaultTheme,
    colors:{
      ...DefaultTheme.colors,
      background:'#fff'
    }
  }
 
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
      <PersistGate loading={null} persistor={persistor}>
      <Main />
      </PersistGate>
    </Provider>
  );
};

export default App;
