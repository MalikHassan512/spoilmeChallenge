import { View, FlatList, ScrollView } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import React, { useState, useEffect } from "react";
import Header from "./Molecules/Header";
import LogoButton from "../../../components/Common/LogoButton";
import images from "../../../assets/images";
import colors from "../../../util/colors";
import RelationPeople from "./Molecules/RelationPeople";
import { getUserRelationships } from "../../../firebase/firestore/relationships";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/userSlice";
import { Loading } from "../../../components/Common/Loading";
const Relations = ({ navigation }) => {
  const people = [0, 1, 2, 3, 4, 5];
  const [relationships, setRelationships] = useState([]);
  const [relatedUsers, setRelatedUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const userId = useSelector(selectUser);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      "focus",
      () => {
        setLoading(true);
        getRelations();
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      },
      [navigation]
    );
  });
  const getRelations = () =>
    getUserRelationships(userId)
      .then((res) => {
        setRelationships(res);
        setRelatedUsers(res);
      })
      .catch((e) => {
        console.log(e);
        alert("Error occured. Please Try again");
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    if (searchText) {
      setRelationships(
        relatedUsers.filter((otherUser, index) => {
          const user =
            otherUser.from.id !== userId ? otherUser.from : otherUser.to;
          const re = new RegExp(searchText.replace(".", ""));
          return !!user.firstName.match(re) || !!user.lastName.match(re);
        })
      );
    } else {
      setRelationships(relatedUsers);
    }
  }, [searchText]);
  return loading ? (
    <Loading />
  ) : (
    <ScrollView style={styles.container}>
      <Header label="Relationships" />
      {console.log('---------Response', relationships)}
    
      <LogoButton
        imgPath={images.search}
        imgStyle={styles.searchIcon}
        container={styles.logoButton}
        label="Search"
      />
      <FlatList
        nestedScrollEnabled={true}
        columnWrapperStyle={{
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
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
