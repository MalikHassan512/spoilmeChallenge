import React, { useRef, useState,useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Image,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "../../components/Common/CustomText";
import InputField from "../../components/Common/InputField";
import { signinWithEmail, signinWithGoogle } from "../../firebase/auth/signin";
import {changeUserData} from "../../firebase/firestore/users";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useDispatch } from "react-redux";
import { changeUser } from "../../redux/features/userSlice";
import firestore from '@react-native-firebase/firestore';
import CustomButton from "../../components/Common/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import requestLocationPermission from '../../util/getLocation'
export const Signin = ({ navigation }) => {
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  useEffect(() => {
    requestLocationPermission(setLocation);
  }, []);

  const onSigninWithEmail = async () => {
    setError({});
    setLoading(true);
    try {
      const userId = await signinWithEmail(email.trim(), password);
      await changeUserData({id:userId,isActive:true,lastActive:firestore.Timestamp.now(),location})

      dispatch(changeUser(userId));
    } catch (e) {
      if (e.code) {
        switch (e.code) {
          case "auth/user-disabled":
            setError({ email: "Your account is disabled" });
            break;
          default:
            setError({
              email: "Email or password incorrect",
              password: "Email or password incorrect",
            });
        }
      } else {
        console.log("signin line 58",e);
      }
      setLoading(false);
    }
  };

  const onSigninWithGoogle = async () => {
    try {
      const userId = await signinWithGoogle();
      dispatch(changeUser(userId));
    } catch (error) {
      console.log("userId", error);
      if (error === "SIGN_IN_CANCELLED") {
        alert("Cancel");
      } else if (error === "IN_PROGRESS") {
        alert("Signin in progress");
      } else if (error === "PLAY_SERVICES_NOT_AVAILABLE") {
        alert("PLAY_SERVICES_NOT_AVAILABLE");
      } else {
        alert("An error occured. Please try again");
      }
    }
  };

  return (
    <ScreenWrapper scrollEnabled>
      <View style={styles.mainContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <CustomText
          textStyle={styles.loginText}
          label="Login To Your Account"
        />
        <InputField
          keyboardType="email-address"
          refer={emailRef}
          value={email}
          onChangeText={(newVal) => setEmail(newVal)}
          onSubmitEditing={() => passwordRef.current.focus()}
          errorText={error.email}
          autoCapitalize="none"
          label="Email"
          inputStyle={styles.inputStyle}
        />
        <InputField
          refer={passwordRef}
          value={password}
          onChangeText={(newVal) => setPassword(newVal)}
          secureTextEntry
          returnKeyType="done"
          errorText={error.password}
          blurOnSubmit={true}
          label="Password"
          inputStyle={styles.inputStyle}
        />
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <CustomText
            textStyle={styles.forgetText}
            label="Forgot password?"
          />
        </TouchableOpacity>
        <CustomButton disabled={!email || !password}
          loading={loading}
          onPress={onSigninWithEmail} label="Sign in" />
        <CustomText
          label="Or sign in with"
          textStyle={styles.orSignInWithText}
        />
        <View style={styles.googleBtnContainer}>
          <GoogleSigninButton
            style={styles.googleBtn}
            onPress={onSigninWithGoogle}
            size={GoogleSigninButton.Size.Wide}
          />
        </View>
        <View style={styles.signUpTextContainer}>
          <CustomText
            textStyle={styles.dontHaveText}
            label="Don’t have an account? "
          />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CustomText
              textStyle={styles.signUpHereText}
              label="Sign up here"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = ScaledSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: "25@s",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    maxWidth: "200@s",
    maxHeight: "50@vs",
    resizeMode: "contain",
    marginBottom: "40@vs",
    marginTop: "80@vs",
  },
  loginText: {
    fontSize: "20@ms",
    color: "#000000",
    fontWeight: "bold",
    marginBottom: "25@vs",
  },
  inputStyle: {
    marginBottom: "15@vs",
  },
  forgetText: {
    fontSize: "16@ms",
    color: "#505050",
    marginBottom: "20@vs",
  },

  orSignInWithText: {
    color: "#878787",
    fontSize: "16@ms",
    marginBottom: "20@vs",
  },
  googleBtnContainer: {
    width: "200@s",
    height: "40@vs",
    borderRadius: "10@ms",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "60@vs",
    borderWidth: 2,
    borderColor: "#ebebeb",
  },
  googleBtn: {
    width: "210@s",
    height: "50@vs",
    borderRadius: "10@ms",
  },
  signUpTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "80@vs",
  },
  dontHaveText: {
    color: "#878787",
    fontSize: "16@ms",
  },
  signUpHereText: {
    color: "#C71F1E",
    fontSize: "16@ms",
  },
});
