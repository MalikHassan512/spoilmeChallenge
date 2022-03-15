import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Image,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { MyHeading } from "../../components/Common/MyHeading";
import { MyText } from "../../components/Common/MyText";
import { AuthSubmitButton } from "../../components/Common/AuthSubmitButton";
import { MyTextField } from "../../components/Common/MyTextField";
import { signinWithEmail, signinWithGoogle } from "../../firebase/auth/signin";
import { useDispatch } from "react-redux";
import { changeUser } from "../../redux/features/userSlice";
import InputField from "../../components/Common/InputField";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

export const Signin = ({ navigation }) => {
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const onSigninWithEmail = async () => {
    setError({});
    setLoading(true);
    try {
      const userId = await signinWithEmail(email, password);
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
        alert("Something went wrong. Please try again");
      }
      setLoading(false);
    }
  };

  const onSigninWithGoogle = async () => {
    try {
      const userId = await signinWithGoogle();
      dispatch(changeUser(userId));
    } catch (error) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.outerContainer}>
        <Pressable onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inner}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
              />
              <View style={styles.innerContainer}>
                <View style={{ marginBottom: 20 }}>
                  <MyHeading
                    fontSize={20}
                    textAlign="center"
                    text="Login To Your Account"
                  />
                </View>
                <InputField label="Email" />
                <InputField label="Password" inputStyle={{ marginTop: 25 }} />

                <GoogleSigninButton
                  style={{ alignSelf: "center" }}
                  onPress={onSigninWithGoogle}
                  size={GoogleSigninButton.Size.Wide}
                />
                <Pressable
                  style={{ marginBottom: "10%", marginTop: 10 }}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <MyText text="Forgot password?" color="#FF8112" />
                </Pressable>
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 10,
                  }}
                >
                  <MyText text="Don't have an account?" color="gray" />
                  <Pressable
                    style={{ marginLeft: 5 }}
                    onPress={() => navigation.navigate("Signup")}
                  >
                    <MyText text="Sign up" color="#FF8112" />
                  </Pressable>
                </View>
                <AuthSubmitButton
                  text="Sign in"
                  disabled={!email || !password}
                  loading={loading}
                  onPress={onSigninWithEmail}
                />
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = ScaledSheet.create({
  outerContainer: {
    backgroundColor: "#fff",
    flex: 1,
  },
  scrollContainer: {
    width: "101%",
  },
  inner: {
    alignItems: "center",
    flex: 1,
    padding: "30@ms",
    justifyContent: "flex-end",
  },
  innerContainer: {
    paddingHorizontal: "20@s",
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: "30@s",
    marginTop: "40@s",
    borderTopRightRadius: "20@ms",
    borderTopLeftRadius: "20@ms",
  },
  textField: {
    width: "100%",
    backgroundColor: "white",
  },
  logo: {
    maxWidth: "200@s",
    maxHeight: "50@vs",
    marginTop: "40@s",
    resizeMode: "contain",
  },
});
