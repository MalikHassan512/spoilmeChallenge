import { View, FlatList, ScrollView, Image } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import React from "react";
import Header from "./Molecules/Header";
import LogoButton from "../../../components/Common/LogoButton";
import images from "../../../assets/images";
import colors from "../../../util/colors";
import RelationPeopleWithBtn from "./Molecules/RelationPeopleWithBtn";
const Contacts = () => {
  const people = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11];
  return (
    <View style={styles.container}>
      <Header label="Contacts" />
      <LogoButton
        imgPath={images.search}
        imgStyle={styles.searchIcon}
        container={styles.logoButton}
        label="Search"
      />
      <View style={styles.socialIconContainer}>
        <Image style={styles.socialIcon} source={images.faceBook} />
        <Image style={styles.socialIcon} source={images.twitterIcon} />
        <Image style={styles.socialIcon} source={images.linkedinIcon} />
        <Image style={styles.socialIcon} source={images.phonIcon} />
      </View>
      <FlatList
        data={people}
        renderItem={(element) => {
          return <RelationPeopleWithBtn />;
        }}
      ></FlatList>
    </View>
  );
};

export default Contacts;

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: "20@s",
  },
  logoButton: {
    paddingHorizontal: "10@s",
    paddingVertical: "4@vs",
    marginBottom: "30@vs",
    borderRadius: "5@ms",
    borderWidth: 0,
    backgroundColor: colors.inputBg,
  },
  searchIcon: {
    width: "20@ms",
    height: "20@ms",
    marginRight: "10@s",
  },
  socialIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "25@vs",
  },
  socialIcon: {
    width: "22@ms",
    height: "21@ms",
    resizeMode: "contain",
  },
});
