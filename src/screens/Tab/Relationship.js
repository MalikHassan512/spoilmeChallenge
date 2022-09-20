import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getUserRelationships } from "../../firebase/firestore/relationships";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { getUsersById } from "../../firebase/firestore/users";
import { LoadingImage } from "../../components/Common/LoadingImage";
import { MyHeading } from "../../components/Common/MyHeading";
import { MyText } from "../../components/Common/MyText";
import { Loading } from "../../components/Common/Loading";
import { getLastMessages } from "../../firebase/firestore/chats";
import { FloatingAction } from "react-native-floating-action";
import { RelationshipHeader } from "../../components/Relationship/RelationshipHeader";
import { UserList } from "../../components/Relationship/UserList";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

export const Relationship = ({ navigation }) => {
  const [relationships, setRelationships] = useState([]);
  const [relatedUsers, setRelatedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const userId = useSelector(selectUser);
  const isFocused = useIsFocused();

  const getRelations = () =>
    getUserRelationships(userId)
      .then((res) => {
        if (isFocused) {
          console.log(
            "Is focused is true hence setting relationships and related users"
          );
          setRelationships(res);
          setRelatedUsers(res);
        } else {
          console.log(
            "Went out of focus hence not setting relationships and related users"
          );
        }
      })
      .catch((e) => {
        console.log(e);
        alert("Error occured. Please Try again");
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    let isCancelled = false;

    if (isFocused) {
      getRelations();
      if (!isCancelled) {
        setLoading(true);
      }
    } else {
      console.log("Focusing on relation screen is false");
    }
    return () => {
      isCancelled = true;
    };
  }, [isFocused]);

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

  return false ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container}>
      {/* <RelationshipHeader
        searchText={searchText}
        setSearchText={setSearchText}
      /> */}
      <View style={styles.logoContainer}>
        <Image
          style={{ width: 125, height: 31 }}
          source={require("../../assets/images/logo.png")}
        />
      </View>
      <UserList
        loading={loading}
        userId={userId}
        getRelations={getRelations}
        otherUsers={relationships}
        navigation={navigation}
      />
      {/* <FloatingAction
        color="black"
        onPressMain={() => navigation.navigate('CreateRelationship')}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logoContainer: {
    marginVertical: 20,
    alignSelf: "center",
  },
});
