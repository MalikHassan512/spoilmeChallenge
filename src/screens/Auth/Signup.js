import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  PermissionsAndroid,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import DateTimePicker from "@react-native-community/datetimepicker";

import InputField from "../../components/Common/InputField";
import CustomButton from "../../components/Common/CustomButton";
import CustomText from "../../components/Common/CustomText";
import LogoButton from "../../components/Common/LogoButton";
import images from "../../assets/images";
import { useDispatch } from "react-redux";
import Geolocation from "react-native-geolocation-service";
import {signupWithEmail} from '../../firebase/auth/signup'
import UploadPhoto from "components/UploadPhoto";
import DropDownPicker from "react-native-dropdown-picker";

export const Signup = ({ navigation }) => {
  const dispatch = useDispatch();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const genderRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(gender);
  const [dob, setDob] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState("");
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  // const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ]);
  const [open, setOpen] = useState(false);

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShow(Platform.OS === "ios");
    setDob(currentDate);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode("date");
  };
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This App needs to Access your location for address",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
        } else {
          console.log("Permission Denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        console.log("positon", position);
        setLocation(position);
      },
      (error) => {
        console.log("getOneTimeLocation", error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError({});
    if (password.length < 8) {
      setError({
        password: "Password should be atleast 8 characters long",
      });
      setLoading(false);
      return;
    }
    try {
      var tempUser = {
        firstName,
        lastName,
        gender,
        email,
        password,
        dob,
        profilePic: image,
        location,
      };
      const userId = await signupWithEmail(tempUser);
      console.log("userId", userId);
      // dispatch(changeUser(userId));
    } catch (e) {
      console.log("error line 154 handlesubmit", e);
      switch (e.code) {
        case "auth/email-already-in-use":
          setError({ email: "Email already in use" });
          break;
        case "auth/invalid-email":
          setError({ email: "Invalid email" });
          break;
        case "auth/weak-password":
          setError({ password: "Weak password." });
        default:
          alert("Some error occured. Please try again");
          setLoading(false);
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
            <View style={styles.mainContainer}>
              <Image style={styles.logo} source={images.logo} />
              <CustomText
                textStyle={styles.createYourAccountText}
                label="Create Your Account"
              />
              <UploadPhoto
                handleChange={(res) => setImage(res)}
                iconColor={"black"}
                imageContainer={styles.logoContainer}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <InputField
                  label="First name"
                  inputStyle={[styles.inputStyle, { width: 165 }]}
                  refer={firstNameRef}
                  value={firstName}
                  onChangeText={(newVal) => setFirstName(newVal)}
                  onSubmitEditing={() => lastNameRef.current.focus()}
                  returnKeyType="next"
                  errorText={error.firstName}
                />
                <InputField
                  label="Second name"
                  inputStyle={[styles.inputStyle, { width: 165 }]}
                  refer={lastNameRef}
                  value={lastName}
                  onChangeText={(newVal) => setLastName(newVal)}
                  onSubmitEditing={() => genderRef.current.focus()}
                  returnKeyType="next"
                  errorText={error.lastName}
                />
              </View>
              <DropDownPicker
                open={open}
                value={gender}
                items={items}
                setOpen={setOpen}
                setValue={setGender}
                setItems={setItems}
                placeholder="Gender"
                onChangeValue={() => emailRef.current.focus()}
                dropDownContainerStyle={{
                  borderColor: "#dbdbdb",
                }}
                style={{
                  borderColor: "#dbdbdb",
                  marginVertical: 10,
                }}
              />
              {/* <InputField label="Gender" inputStyle={styles.inputStyle} /> */}
              <InputField  keyboardType="email-address"
                  refer={emailRef}
                  value={email}
                  onChangeText={(newVal) => setEmail(newVal)}
                  onSubmitEditing={() => passwordRef.current.focus()}
                  errorText={error.email} label="Email" inputStyle={styles.inputStyle} />
              <InputField  refer={passwordRef}
                  value={password}
                  onChangeText={(newVal) => setPassword(newVal)}
                  secureTextEntry
                  returnKeyType="done"
                  errorText={error.password}
                  blurOnSubmit={true} label="Password" inputStyle={styles.inputStyle} />
              {/* <InputField
                label="Date of birth"
                inputStyle={styles.inputStyle}
              /> */}
                <Pressable onPress={showDatePicker}>
                  <CustomText label="Select Date of birth" />
                    {/* <MyText text="Select Date of birth" color="#FF8112" /> */}
                  </Pressable>
               {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={dob ? new Date(dob) : new Date()}
                    mode={mode}
                    display="default"
                    onChange={onStartChange}
                  />
                )}
              <LogoButton imgPath={images.faceBook} label="Facebook link" />
              <LogoButton imgPath={images.linkedin} label="Linkedin link" />
              <LogoButton imgPath={images.twitter} label="Twitter link" />

              <CustomButton
                btnContainer={{ marginBottom: 23 }}
                label="Sign up"
                disabled={
                  !firstName ||
                  !lastName ||
                  !gender ||
                  !email ||
                  !password ||
                  !location ||
                  !image?.uri
                }
                loading={loading}
                onPress={handleSubmit}
              />
              <View style={styles.signUpTextContainer}>
                <CustomText
                  textStyle={styles.dontHaveText}
                  label="Already have an account? "
                />
                <Pressable onPress={()=>navigation.navigate("Signin")}>
                  <CustomText
                    textStyle={styles.signUpHereText}
                    label="Sign in here"
                  />
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = ScaledSheet.create({
  createYourAccountText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: "20@ms",
    alignSelf: "center",
    marginBottom: "30@vs",
  },
  logo: {
    width: "126@s",
    height: "32@vs",
    alignSelf: "center",
    marginTop: "34@vs",
    marginBottom: "20@vs",
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: "25@s",
    justifyContent: "center",
  },
  inputStyle: {
    height: "45@s",
    borderWidth: 2,
    marginBottom: "8@s",
  },
  signUpTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "47@vs",
    alignSelf: "center",
  },
  dontHaveText: {
    color: "#878787",
    fontSize: "16@ms",
  },
  signUpHereText: {
    color: "#C71F1E",
    fontSize: "16@ms",
  },
  outerContainer: {
    backgroundColor: "#fff",
    flex: 1,
  },
  logoContainer: {
    width: "100@s",
    height: "100@s",
    borderRadius: "130@s",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
    marginVertical: "5@vs",
    marginBottom: "10@vs",
    justifyContent: "center",
    alignItems: "center",
  },
});
