import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  View,
  StyleSheet,
  
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
import ScreenWrapper from "../../components/ScreenWrapper";
import { width } from "react-native-dimension";
import {deleteProfilePic, uploadProfilePic} from '../../firebase/storage/profilPic';
import firestore from '@react-native-firebase/firestore';

export const Profile = ({navigation}) => {
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
  const [dbImage, setDbImage] = useState("")
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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUser(userId)
      .then((user) => {
        // console.log("user",user)
        setFirstName(user?.firstName);
        setLastName(user?.lastName);
        setEmail(user?.email)
        setGender(user?.gender)
        setImage(user?.profilePic)
        setDbImage(user?.profilePic)
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
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);



  const onSubmit = async () => {
    setOnSubmitLoading(true);

    const temp = {
      id: userId,
      firstName,
      lastName,
      gender,
      dob,
      fb,
      linkedin,
      twitter,
      isScrapedfb: false,
      isScrapedli: false,
    }
    if(dbImage!=image?.uri){
      try {
        await deleteProfilePic(userId)
      } catch (error) {
        console.log("error",error) 
      }
      
      temp.profilePic=await uploadProfilePic(image,userId)
    }
    try {
      await changeUserData(temp);
      setOnSubmitLoading(false);
      setDisabled(true)
    } catch (e) {
      setOnSubmitLoading(false);
      alert("Error occured. Try again");
    }
  };
const signoutUser=()=>{
  changeUserData({id:userId,isActive:false,lastActive:firestore.Timestamp.now(),})
  signout()
}
  return initialLoading ? (
    <Loading />
  ) : (

    <ScreenWrapper scrollEnabled>
      <View style={styles.inner}>
        <Header
          fImgPath={images.setting}
          sImgPress={() => setDisabled(!isDisabled)}
          sImgStyle={!isDisabled && { tintColor: colors.primary }}
          sImgPath={images.edit} />
        <UploadPhoto
          disabled={isDisabled}
          image={image}
          handleChange={(res) => setImage(res)}
          iconColor={"white"}
          imageContainer={styles.logoContainer}
          placeholder={images.placeholder}
          iconStyle={{ backgroundColor: colors.primary }}
        />
        {isDisabled && <CustomText container={{ alignSelf: 'center' }} fontSize={20} label={firstName + " " + lastName} />}
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
            placeholderStyle={{ color: 'grey' }}
            dropDownContainerStyle={{
              borderColor: "#dbdbdb",
            }}
            style={{
              borderColor: "#dbdbdb",
              marginVertical: 10,
              alignSelf: 'center',
              width: '90%'
            }}
          />
          <InputField
            withLabel="Email"
            inputStyle={styles.inputStyle}
            label="Email"
            disabled
            value={email}
          />

          <TouchableOpacity disabled={isDisabled} style={styles.dropDownContainer} onPress={showDatePicker}>
            <CustomText label={dob ? moment(dob).format("YY/MM/DD") : "Date of birth"} />
          </TouchableOpacity >
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              style={{ width: width(50), alignSelf: 'center' }}
              value={dob}
              mode={mode}
              display="default"
              onChange={onStartChange}
            />
          )}
          <LogoButton
            onChangeText={setFb}
            disabled={isDisabled}
            container={{ marginBottom: -8, marginHorizontal: width(3) }}
            withLabel="Social links"
            textContainer={{marginLeft: width(3)}}
            imgPath={images.faceBook}
            label="facebook.com"
            value={fb}
          />
          <LogoButton
            disabled={isDisabled}
            onChangeText={setLinkedin}
            imgPath={images.linkedin}
            label="LinkedIn.com"
            container={{ marginBottom: -8, marginHorizontal: width(3) }}
            value={linkedin}
          />
          <LogoButton
            onChangeText={setTwitter}
            disabled={isDisabled}
            imgPath={images.twitter}
            label="Twitter.com"
            value={twitter}
            container={{ marginBottom: 0, marginHorizontal: width(3) }}
          />
        </View>
        <View
          style={{ paddingHorizontal: 30, width: "100%", marginTop: 23 }}
        >
          <CustomButton
            label={!isDisabled ? "Save changes":"Logout"}
            loading={onSubmitLoading}
            onPress={!isDisabled ?onSubmit:()=>signoutUser()} />
          {/* <CustomButton label="Logout"
            onPress={signout} /> */}
        </View>
      </View>
    </ScreenWrapper>
    //       </ScrollView>
    //     </TouchableOpacity>
    //   </SafeAreaView>
    // </KeyboardAvoidingView>
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
    flex: 1,
    // justifyContent: "flex-end",
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
    alignSelf: 'center',
    width: '90%'
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
    width: '90%',
    alignSelf: 'center'
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
