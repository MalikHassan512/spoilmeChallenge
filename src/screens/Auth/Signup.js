import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  PermissionsAndroid,
} from "react-native";
import { moderateScale, scale, ScaledSheet } from "react-native-size-matters";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import InputField from "../../components/Common/InputField";
import CustomButton from "../../components/Common/CustomButton";
import CustomText from "../../components/Common/CustomText";
import LogoButton from "../../components/Common/LogoButton";
import images from "../../assets/images";
import { useDispatch } from "react-redux";
import { signupWithEmail } from "../../firebase/auth/signup";
import UploadPhoto from "components/UploadPhoto";
import DropDownPicker from "react-native-dropdown-picker";
import colors from "util/colors";
import moment from "moment";
import ScreenWrapper from "../../components/ScreenWrapper";
import requestLocationPermission from "../../util/getLocation";
export const Signup = ({ navigation }) => {
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
  const [fb, setFb] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDob(date);
    hideDatePicker();
  };
  const [items, setItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    requestLocationPermission(setLocation);
  }, []);

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
        email: email.trim(),
        password,
        dob,
        profilePic: image,
        location,
        fb,
        twitter,
        linkedin,
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
          setLoading(false);
          alert("Some error occured. Please try again");
      }
    }
  };

  return (
    <ScreenWrapper scrollEnabled>
      <View style={styles.mainContainer}>
        <Image style={styles.logo} source={images.logo} />
        <CustomText
          textStyle={styles.createYourAccountText}
          label="Create Your Account"
        />
        <UploadPhoto
          handleChange={(res) => setImage(res)}
          iconColor={"white"}
          imageContainer={styles.logoContainer}
          placeholder={images.placeholder}
          iconStyle={{ backgroundColor: colors.primary }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: scale(15),
          }}
        >
          <InputField
            label="First name"
            inputStyle={[styles.inputStyle, { width: scale(145),marginBottom:0}]}
            refer={firstNameRef}
            value={firstName}
            onChangeText={(newVal) => setFirstName(newVal)}
            onSubmitEditing={() => lastNameRef.current.focus()}
            returnKeyType="next"
            errorText={error.firstName}
          />
          <InputField
            label="Second name"
            inputStyle={[styles.inputStyle, { width: scale(145),marginBottom:0}]}
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
          placeholderStyle={{ color: "grey" }}
          onChangeValue={() => emailRef.current.focus()}
          dropDownContainerStyle={{
            borderColor: "#dbdbdb",
          }}
          style={{
            borderColor: "#dbdbdb",
            marginBottom: scale(10),
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 1,
          }}
        />
        {/* <InputField label="Gender" inputStyle={styles.inputStyle} /> */}
        <InputField
          keyboardType="email-address"
          refer={emailRef}
          value={email}
          onChangeText={(newVal) => setEmail(newVal)}
          onSubmitEditing={() => passwordRef.current.focus()}
          errorText={error.email}
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
        <TouchableOpacity
          style={styles.dropDownContainer}
          onPress={showDatePicker}
        >
          <CustomText
            color={dob ? "black" : "grey"}
            label={dob ? moment(dob).format("YYYY-MM-DD") : "Date of birth *"}
          />
          <EvilIcons name="chevron-down" size={moderateScale(32)} />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        {/* <LogoButton
          onChangeText={setFb}
          value={fb}
          imgPath={images.faceBook}
          label="Facebook link"
        />
        <LogoButton
          onChangeText={setLinkedin}
          value={linkedin}
          imgPath={images.linkedin}
          label="Linkedin link"
          container={{marginTop:scale(4),marginBottom:scale(14)}}
        />
        <LogoButton
          onChangeText={setTwitter}
          value={twitter}
          imgPath={images.twitter}
          label="Twitter link"
        /> */}

        <CustomButton
          btnContainer={{ marginBottom: 23,marginTop:scale(5) }}
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
          <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
            <CustomText
              textStyle={styles.signUpHereText}
              label="Sign in here"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
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
    // borderWidth: 2,
    marginBottom: "12@s",
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
  dropDownContainer: {
    // paddingVertical: "10@vs",
    height: "45@vs",
    paddingStart: "15@s",
    paddingEnd: 5,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: "10@ms",
    marginBottom: "14@s",
    borderWidth: 2,
    borderColor: "#ebebeb",
    marginTop: "3@s",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 1,
  },
});
