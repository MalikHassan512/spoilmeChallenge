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
import DropDownPicker from "react-native-dropdown-picker";
import Geolocation from "react-native-geolocation-service";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MyHeading } from "../../components/Common/MyHeading";
import { MyText } from "../../components/Common/MyText";
import { MyTextField } from "../../components/Common/MyTextField";
import { AuthSubmitButton } from "../../components/Common/AuthSubmitButton";
import { signupWithEmail } from "../../firebase/auth/signup";
import { useDispatch } from "react-redux";
import { changeUser } from "../../redux/features/userSlice";
import { LoadingImage } from "../../components/Common/LoadingImage";
import { ScaledSheet } from "react-native-size-matters";
import UploadPhoto from "components/UploadPhoto";
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
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState("");
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(null);
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
  // const getLocation = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Spoil:me',
  //         message: 'Spoil:me wants to access your location ',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       Geolocation.getCurrentPosition(
  //         position => {
  //           setLocation(position);
  //         },
  //         error => {
  //           console.log(error.code, error.message);
  //           alert('Location Permission not given');
  //         },
  //         {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //       );
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
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
            <View style={styles.inner}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
              />
              <View style={styles.innerContainer}>
                <View style={{ marginBottom: 20 }}>
                  <MyHeading textAlign={"center"} text="Create your account" />
                </View>
                <UploadPhoto
                  handleChange={(res) => setImage(res)}
                  iconColor={"black"}
                  imageContainer={styles.logoContainer}
                />
                {/* <Pressable onPress={pickImage}>
                  {image ? (
                    <LoadingImage
                      style={styles.profilePic}
                      source={{uri: image}}
                    />
                  ) : (
                    <View style={styles.profilePic}>
                      <MyText text="Select Profile Pic" />
                    </View>
                  )}
                </Pressable> */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      marginRight: 5,
                    }}
                  >
                    <MyTextField
                      label="First name"
                      refer={firstNameRef}
                      value={firstName}
                      onChangeText={(newVal) => setFirstName(newVal)}
                      onSubmitEditing={() => lastNameRef.current.focus()}
                      returnKeyType="next"
                      errorText={error.firstName}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <MyTextField
                      label="Last name"
                      refer={lastNameRef}
                      value={lastName}
                      onChangeText={(newVal) => setLastName(newVal)}
                      onSubmitEditing={() => genderRef.current.focus()}
                      returnKeyType="next"
                      errorText={error.lastName}
                    />
                  </View>
                </View>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder="Gender"
                  onChangeValue={()=>emailRef.current.focus()}
                  dropDownContainerStyle={{
                    borderColor:"#dbdbdb"
                  }}
                  style={{
                    borderColor:"#dbdbdb",
                    marginVertical:10,
                  }}
/>
                {/* <MyTextField
                  label="Gender"
                  refer={genderRef}
                  value={gender}
                  onChangeText={(newVal) => setGender(newVal)}
                  onSubmitEditing={() => }
                  errorText={error.gender}
                /> */}
                <MyTextField
                  label="Email"
                  keyboardType="email-address"
                  refer={emailRef}
                  value={email}
                  onChangeText={(newVal) => setEmail(newVal)}
                  onSubmitEditing={() => passwordRef.current.focus()}
                  errorText={error.email}
                />
                <MyTextField
                  label="Password"
                  refer={passwordRef}
                  value={password}
                  onChangeText={(newVal) => setPassword(newVal)}
                  secureTextEntry
                  returnKeyType="done"
                  errorText={error.password}
                  blurOnSubmit={true}
                />

                <View
                  style={{
                    marginVertical: "5%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Pressable onPress={showDatePicker}>
                    <MyText text="Select Date of birth" color="#FF8112" />
                  </Pressable>
                  {/* <MyText text={dob?.toLocaleDateString?.()} /> */}
                </View>
                {/* {location && (
                  <View style={{marginBottom: '5%'}}>
                    <MyText text="Location data collected" textAlign="center" />
                  </View>
                )} */}

                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={dob ? new Date(dob) : new Date()}
                    mode={mode}
                    display="default"
                    onChange={onStartChange}
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 10,
                  }}
                >
                  <MyText text="Already have an account?" color="gray" />
                  <Pressable
                    style={{ marginLeft: 5 }}
                    onPress={() => navigation.navigate("Signin")}
                  >
                    <MyText text="Sign in" color="#FF8112" />
                  </Pressable>
                </View>
                <AuthSubmitButton
                  text="Sign up"
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
    paddingBottom: 20,
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  innerContainer: {
    paddingHorizontal: 20,
    width: "101%",
    marginTop: 40,
    paddingTop: "5%",
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: "NunitoSans-Regular",
    textAlign: "center",
    color: "grey",
    display: "flex",
  },
  dropIcons: {
    maxWidth: 25,
    maxHeight: 20,
  },
  logo: {
    maxWidth: 200,
    marginTop: 40,
    maxHeight: 40,
    resizeMode: "contain",
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
  profilePic: {
    borderRadius: 100,
    backgroundColor: "#F1F1F1",
    height: 140,
    width: 140,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
