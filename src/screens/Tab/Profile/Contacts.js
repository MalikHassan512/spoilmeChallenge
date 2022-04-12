import { View, FlatList, ScrollView, Image } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import React, { useState, useEffect } from "react";
import Header from "./Molecules/Header";
import LogoButton from "../../../components/Common/LogoButton";
import images from "../../../assets/images";
import colors from "../../../util/colors";
import RelationPeopleWithBtn from "./Molecules/RelationPeopleWithBtn";
import { useSelector } from "react-redux";
import ContactModal from "../../../components/ContactModal";
import { selectUser } from "../../../redux/features/userSlice";
const Contacts = () => {
  const people = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const [searchText, setSearchText] = useState("");
  const [relationships, setRelationships] = useState([]);
  const contacts = useSelector((state) => state.user.contactList);
  const userId = useSelector(selectUser);
  useEffect(() => {
    if (searchText) {
      setRelationships(
        contacts.filter((otherUser) => {
          const re = new RegExp(searchText.replace(".", ""));
          return !!otherUser?.givenName?.match(re);
        })
      );
    } else {
      setRelationships(contacts);
    }
  }, [searchText]);
  return (
    <View style={styles.container}>
      <Header label="Contacts" />
      
      <LogoButton
        imgPath={images.search}
        imgStyle={styles.searchIcon}
        container={styles.logoButton}
        label="Search"
        onChangeText={(value) => setSearchText(value)}
      />
      <View style={styles.socialIconContainer}>
        <Image style={styles.socialIcon} source={images.faceBook} />
        <Image style={styles.socialIcon} source={images.twitterIcon} />
        <Image style={styles.socialIcon} source={images.linkedinIcon} />
        <Image style={styles.socialIcon} source={images.phonIcon} />
      </View>
      <FlatList
        data={relationships}
        keyExtractor={(item, index) => item + index.toString()}
        renderItem={({ item }) => <RelationPeopleWithBtn item={item} />}
      />
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
