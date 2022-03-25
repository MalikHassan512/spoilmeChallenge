import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Signup} from './screens/Auth/Signup';
import {Signin} from './screens/Auth/Signin';
import {ForgotPassword} from './screens/Auth/ForgotPassword';
import {Chat} from './screens/Chat';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {useSelector, useDispatch} from 'react-redux';
import {changeUser, selectUser} from './redux/features/userSlice';
import {checkAuth} from './firebase/auth/checkAuth';
import {signout} from './firebase/auth/signout';
import {Loading} from './components/Common/Loading';
import {TabStack} from './components/TabStack';
import {CreateRelationship} from './screens/CreateRelationship';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, { useRef, useState, useEffect } from "react";
import { AppState } from 'react-native'
const Main = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUser);
  const Stack = createNativeStackNavigator();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    setTimeout(() => {
      setLoading(false);
    }, 500);
    const authSubscriber = checkAuth(user => dispatch(changeUser(user?.uid)));
    return () => {
      if (authSubscriber) authSubscriber();
    };
  }, []);
  // signout();
  return loading ? (
    <Loading />
  ) : (
    <NavigationContainer>
      {!userId ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Signin" component={Signin} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
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
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
      // console.log("AppState", appState.current);
      if(appState.current=="active"){
        console.log("user is active")
      }else{
        console.log("user is inactive")

      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};



export default App;
