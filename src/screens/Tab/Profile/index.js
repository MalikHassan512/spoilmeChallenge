import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import CustomText from "../../../components/CustomText";
import { ScaledSheet } from "react-native-size-matters";
import images from "../../../assets/images";
import colors from "../../../util/colors";
import Entypo from "react-native-vector-icons/Entypo";
import SocialIconWithText from "../../../components/Common/SocialIconWithText";
import PopupModal from "../../../components/Common/PopupModal";
import Post from "./Molecules/Post";
export const Profile = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const post = [0, 1, 2, 3, 4, 5];
  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.headTextCont}
        >
          <CustomText label="harrystyles10" textStyle={styles.headerText} />
          <View>
            <Entypo name="chevron-down" style={styles.headerTextIcon} />
          </View>
        </TouchableOpacity>
        <Image source={images.menu} style={styles.headerIcon} />
      </View>
      <View style={styles.profile}>
        <TouchableOpacity
          onPress={() => console.log("camera")}
          style={styles.profileIconContainer}
        >
          <Image source={images.camera} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>
      <CustomText label="Harry Styles, 22" textStyle={styles.harryText} />
      <CustomText
        label="Marketing and PR specialist"
        textStyle={styles.marketingText}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Relations")}
          style={styles.relationContainer}
        >
          <CustomText textStyle={styles.text55} label="55" />
          <CustomText textStyle={styles.relationText} label="Relationships" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Contacts")}
          style={styles.relationContainer}
        >
          <CustomText textStyle={styles.text55} label="110" />
          <CustomText textStyle={styles.relationText} label="Contacts" />
        </TouchableOpacity>
      </View>
      {showModal ? null : (
        <>
          <SocialIconWithText
            source={images.homeIcon}
            label="Lives in "
            title="Paris, France"
          />
          <SocialIconWithText source={images.phonIcon} title="+33-119568" />
          <SocialIconWithText source={images.fbIcon} label="harrystyles" />
          <SocialIconWithText source={images.twitterIcon} label="harrystyles" />
          <SocialIconWithText
            source={images.linkedinIcon}
            label="harrystyles"
          />
          <FlatList
            data={post}
            renderItem={(element) => {
              return <Post />;
            }}
          ></FlatList>
        </>
      )}
      {showModal && (
        <PopupModal
          onPress={() => setShowModal(false)}
          bgPress={() => setShowModal(false)}
          visible={true}
        />
      )}
    </ScrollView>
  );
};

const styles = ScaledSheet.create({
  mainContainer: {
    padding: "25@ms",
    backgroundColor: colors.white,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "15@vs",
  },
  headTextCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: "16@ms",
    color: colors.black,
    fontWeight: "500",
  },
  headerTextIcon: {
    fontSize: "16@ms",
    color: colors.primary,
    marginLeft: "5@s",
  },
  headerIcon: {
    width: "20@ms",
    height: "20@ms",
    resizeMode: "contain",
  },
  profile: {
    width: "100@ms",
    height: "100@ms",
    backgroundColor: "#E3E5E8",
    borderRadius: "100@ms",
    alignSelf: "center",
    marginTop: "10@vs",
    justifyContent: "flex-end",
    marginBottom: "15@s",
  },
  profileIconContainer: {
    width: "30@ms",
    height: "30@ms",
    borderRadius: "100@ms",
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  profileIcon: {
    width: "18@ms",
    height: "14@ms",
    resizeMode: "contain",
  },
  harryText: {
    fontSize: "24@ms",
    alignSelf: "center",
    fontWeight: "500",
    color: colors.black,
    marginBottom: "20@s",
  },
  marketingText: {
    fontSize: "16@ms",
    alignSelf: "center",
    color: colors.text,
    letterSpacing: 1,
    marginBottom: "25@vs",
  },
  relationContainer: {
    width: "47%",
    height: "65@vs",
    backgroundColor: colors.primary,
    borderRadius: "15@ms",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20@vs",
  },
  text55: {
    fontSize: "20@ms",
    color: colors.white,
    marginBottom: "5@vs",
    fontWeight: "bold",
  },
  relationText: {
    fontSize: "16@ms",
    color: colors.white,
  },
});
