import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import UploadPhoto from "components/UploadPhoto";
import { changeUserData, getUser } from "../../firebase/firestore/users";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { Loading } from "../../components/Common/Loading";
import { LoadingImage } from "../../components/Common/LoadingImage";
import { signout } from "../../firebase/auth/signout";
import InputField from "../../components/Common/InputField";
import images from "../../assets/images";
import Header from "../../components/Header";
import { ScaledSheet } from "react-native-size-matters";
import CustomButton from "../../components/Common/CustomButton";
import CustomText from "../../components/Common/CustomText";
import colors from "../../util/colors";
import LogoButton from "../../components/Common/LogoButton";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";

export const Profile = () => {
  const [isDisabled, setDisabled] = useState(true)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("")
  const [dob, setDob] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [image, setImage] = useState("")
  const [onSubmitLoading, setOnSubmitLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [gender, setGender] = useState("");
  const [items, setItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ]);
  const [open, setOpen] = useState(false);
  const [fb, setFb] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const userId = useSelector(selectUser);
  // moment().diff(userProfile.dob, 'years')

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
    getUser(userId)
      .then((user) => {
        setFirstName(user?.firstName);
        setLastName(user?.lastName);
        setEmail(user?.email)
        setGender(user?.gender)
        setImage(user?.profilePic)
        setDob(user?.dob?.toDate() || new Date());
        setFb(user?.fb)
        setTwitter(user?.twitter)
        setLinkedin(user?.linkedin)
        setInitialLoading(false);
      })
      .catch((e) => {
        // alert('An error occured.Try again');
        console.log(e);
      });
  }, [userId]);

  const onSubmit = async () => {
    const temp={
      id:userId,
      firstName,
      lastName,
      gender,
      dob,
      fb,
      linkedin,
      twitter
    }
    try {
      setOnSubmitLoading(true);
      await changeUserData(temp);
      alert("Info Changed Successfully");
      setOnSubmitLoading(false);
    } catch (e) {
      setOnSubmitLoading(false);
      alert("Error occured. Try again");
    }
  };

  return initialLoading ? (
    <Loading />
  ) : (
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
              <Header fImgPath={images.setting} sImgPress={()=>setDisabled(!isDisabled)} sImgStyle={!isDisabled && {tintColor:colors.primary}}  sImgPath={images.edit} />
              <UploadPhoto
                image={image}
                handleChange={(res) => setImage(res)}
                iconColor={"white"}
                imageContainer={styles.logoContainer}
                placeholder={images.placeholder}
                iconStyle={{backgroundColor:colors.primary}}
              />
              {isDisabled && <CustomText fontSize={20} label={firstName +" "+ lastName + ", " + moment().diff(dob,"years")} />}
              <View>
               {!isDisabled &&
               <>
                <InputField
                  disabled={isDisabled}
                  withLabel="First Name"
                  inputStyle={styles.inputStyle}
                  label="First Name"
                  value={firstName}
                  onChangeText={(newVal) => setFirstName(newVal)}
                  autoCapitalize="none"
                />
                 <InputField
                  disabled={isDisabled}
                  withLabel="Last Name"
                  inputStyle={styles.inputStyle}
                  label="Last Name"
                  value={lastName}
                  onChangeText={(newVal) => setLastName(newVal)}
                  autoCapitalize="none"
                />
                </>
                }
                <DropDownPicker
                  disabled={isDisabled}
                open={open}
                value={gender}
                items={items}
                setOpen={setOpen}
                setValue={setGender}
                setItems={setItems}
                placeholder="Gender"
                placeholderStyle={{color:'grey'}}
                dropDownContainerStyle={{
                  borderColor: "#dbdbdb",
                }}
                style={{
                  borderColor: "#dbdbdb",
                  marginVertical: 10,
                  width:'85%'
                }}
              />
                <InputField
                  withLabel="Email"
                  inputStyle={styles.inputStyle}
                  label="Email"
                  disabled
                  value={email}
                />
                
                 <Pressable disabled={isDisabled} style={styles.dropDownContainer} onPress={showDatePicker}>
                <CustomText label={dob ? moment(dob).format("YY/MM/DD") : "Date of birth"} />
              </Pressable >
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dob}
                  mode={mode}
                  display="default"
                  onChange={onStartChange}
                />
              )}
                <LogoButton
                  onChangeText={setFb}
                  disabled={isDisabled}
                  container={{ marginBottom: -8 }}
                  withLabel="Social links"
                  imgPath={images.faceBook}
                  label="facebook.com"
                  value={fb}
                />
                <LogoButton
                disabled={isDisabled}
                onChangeText={setLinkedin}
                  imgPath={images.linkedin}
                  label="LinkedIn.com"
                  container={{ marginBottom: -8 }}
                  value={linkedin}
                />
                <LogoButton
                  onChangeText={setTwitter}
                  disabled={isDisabled}
                  imgPath={images.twitter}
                  label="Twitter.com"
                  value={twitter}
                  container={{ marginBottom: 0 }}
                />
              </View>
              <View
                style={{ paddingHorizontal: 30, width: "100%", marginTop: 23 }}
              >
                <CustomButton label="Save changes"   
                    loading={onSubmitLoading}
                    onPress={onSubmit} />
                 <CustomButton label="Logout"   
                    onPress={signout} />
              </View>
              {/* <View style={styles.innerContainer}>
                <View style={{ marginBottom: 20 }}>
                  <MyHeading text="Profile" fontSize={25} />
                </View>
                <MyTextField
                  label="First Name"
                  refer={firstNameRef}
                  value={firstName}
                  onChangeText={(newVal) => setFirstName(newVal)}
                  onSubmitEditing={() => lastNameRef.current.focus()}
                  autoCapitalize="none"
                />
                <MyTextField
                  label="Last Name"
                  refer={lastNameRef}
                  value={lastName}
                  onChangeText={(newVal) => setLastName(newVal)}
                  autoCapitalize="none"
                />



                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Pressable onPress={() => setShowDate(true)}>
                    <MyText text="Change Date of birth" color="#FF8112" />
                  </Pressable>
                  <MyText text={dob?.toLocaleDateString()} />
                </View>

                {showDate && (
                  <DateTimePicker
                    value={dob}
                    mode="data"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDate(false);
                      if (selectedDate) setDob(selectedDate);
                    }}
                  />
                )}
                <View style={{ marginTop: 30 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "red",
                      padding: 15,
                      alignItems: "center",
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                    onPress={signout}
                  >
                    <MyText color={"white"} text="Logout" />
                  </TouchableOpacity>
                  <AuthSubmitButton
                    text="Change Info"
                    disabled={
                      initialDob === dob &&
                      firstName === initialFirstName &&
                      lastName === initialLastName
                    }
                    loading={onSubmitLoading}
                    onPress={onSubmit}
                  />
                </View>
              </View> */}
            </View>
          </ScrollView>
        </Pressable>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = ScaledSheet.create({
  outerContainer: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: "#fff",
    width: "101%",
  },
  inner: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  innerContainer: {
    paddingHorizontal: 20,
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 30,
    marginTop: 40,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  imgContainer: {
    width: "100@ms",
    height: "100@ms",
    borderRadius: "100@ms",
    backgroundColor: "red",
    marginBottom: "20@vs",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  peopleImg: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  inputStyle: {
    height: "40@vs",
    marginBottom: "8@vs",
  },
  dropDownContainer: {
    paddingVertical: "10@vs",
    paddingHorizontal: "20@s",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: "10@ms",
    marginBottom: "8@vs",
    borderWidth: 2,
    borderColor: "#ebebeb",
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
