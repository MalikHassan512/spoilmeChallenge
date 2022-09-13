import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Signup } from "./screens/Auth/Signup";
import { Signin } from "./screens/Auth/Signin";
import { ForgotPassword } from "./screens/Auth/ForgotPassword";
import { Chat } from "./screens/Chat";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";
import { changeUser } from "./redux/features/userSlice";
import { checkAuth } from "./firebase/auth/checkAuth";
import { Loading } from "./components/Common/Loading";
import { TabStack } from "./components/TabStack";
import { CreateRelationship } from "./screens/CreateRelationship";
import React, { useState, useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaView, View } from "react-native";

// import CameraScreen from './screens/CameraScreen'

const Main = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);
  const Stack = createNativeStackNavigator();
  const [loading, setLoading] = useState(true);
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#fff",
    },
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    const authSubscriber = checkAuth((user) => dispatch(changeUser(user?.uid)));
    return () => {
      if (authSubscriber) authSubscriber();
    };
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
          {/* <Stack.Screen name="CameraScreen" component={CameraScreen} /> */}
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
        <SafeAreaView style={{ flex: 1 }}>
          <Main />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
