import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { launchCamera } from "react-native-image-picker";
import CustomText from "../components/CustomText";
import AntDesign from "react-native-vector-icons/AntDesign";
import { verticalScale } from "react-native-size-matters";

import { getUser } from "../firebase/firestore/users";
import { uploadImage } from "../firebase/HelperFunctions/HelperFunctions";
import { createStory } from "../firebase/firestore/posts";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
const { width, height } = Dimensions.get("window");
const CameraScreen = ({ navigation,route }) => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.user.userId);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        userId,
        type: "Story",
        dataType: image.type.includes("video") ? "video" : "image",
      };
      data.story_image = await uploadImage(image.uri, userId);
      await createStory(data);
      setLoading(false);
      navigation.navigate("Tab", { screen: "Home", params:{updateStory:Math.random()}});
    } catch (error) {
      console.log("error line 38 onSubmit", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    openPicker();
  }, []);
  const openPicker = () => {
    const options = {
      mediaType: "photo",
      quality: 0.8,
    };
    setTimeout(async () => {
      const { assets, didCancel } = await launchCamera(options);
      if (didCancel) {
        navigation.navigate("Tab");
      } else {
        setImage(assets[0]);
      }
    }, 500);
  };
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.imageContainer} />
      {image?.uri && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={openPicker} style={styles.btnSubmit}>
            <AntDesign name="left" size={verticalScale(23)} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSubmit}
            disabled={loading}
            style={styles.btnCapsule}
          >
            {loading ? (
              <ActivityIndicator animating color={"#fff"} />
            ) : (
              <CustomText color={"#fff"} fontWeight={"bold"} label="Add Story" />
            )}
          </TouchableOpacity>
        </View>
      )}
      <View />
      <View />
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000",
    justifyContent: "space-between",
  },
  imageContainer: {
    height: height - 265,
    width: width,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  btnCapsule: {
    borderRadius: 25,
    width: "33%",
    borderWidth: 2,
    borderColor: "#fff",
    marginEnd: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  btnSubmit: {
    backgroundColor: "#FFF",
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
});
