import { View, FlatList, ScrollView } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import React from "react";
import Header from "./Molecules/Header";
import LogoButton from "../../../components/Common/LogoButton";
import images from "../../../assets/images";
import colors from "../../../util/colors";
import RelationPeople from "./Molecules/RelationPeople";
const Relations = () => {
  const people = [0, 1, 2, 3, 4, 5];
  return (
    <ScrollView style={styles.container}>
      <Header label="Relationships" />
      <LogoButton
        imgPath={images.search}
        imgStyle={styles.searchIcon}
        container={styles.logoButton}
        label="Search"
      />
      <FlatList
        data={people}
        numColumns={3}
        renderItem={(element) => {
          return <RelationPeople />;
        }}
      ></FlatList>
    </ScrollView>
  );
};

export default Relations;

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: "20@s",
  },
  logoButton: {
    paddingHorizontal: "10@s",
    paddingVertical: "4@vs",
    marginBottom: "40@vs",
    borderRadius: "5@ms",
    borderWidth: 0,
    backgroundColor: colors.inputBg,
  },
  searchIcon: {
    width: "20@ms",
    height: "20@ms",
    marginRight: "10@s",
  },
});
