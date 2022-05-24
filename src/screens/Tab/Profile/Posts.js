import { StyleSheet, Text, View, FlatList, BackHandler } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "./Molecules/Header";
import Post from "components/Post";
import { height, width } from "react-native-dimension";

const Posts = ({ route, navigation }) => {
  const { posts, itemIndex, userId, user, loadData,postLength } = route?.params;
  const [postData, setPostData] = useState(posts)
  useEffect(() => {
    console.log("posts",posts)
    setPostData(posts)
  }, [postLength])
  
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("ProfileStack", {
        screen: "Profile",
        params: { userId: userId },
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  const renderEmpty = () => {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No posts available</Text>
      </View>
    );
  };
  const renderPost = ({ item }) => {
    if (item?.postType == "MAP") {
      return (
        <Post
          description={item.description}
          name={item?.name}
          postType={"MAP"}
          spoilTypes={spoilTypes}
          loadData={getAllData}
        />
      );
    } else {
      return (
        <Post
          loadData={loadData}
          createdAt={item?.createdAt}
          userDetail={user}
          dataType={item?.dataType}
          postType={item?.postType}
          image={item.image}
          description={item.description}
          name={item?.name}
          postId={item?.id}
          postUserId={item?.userId}
        />
      );
    }
  };
  return (
    <View style={styles.container}>
      <Header
        onBackPress={() =>
          navigation.navigate("ProfileStack", {
            screen: "Profile",
            params: { userId: userId },
          })
        }
        label={"Posts"}
      />
      <FlatList
        data={postData || []}
        initialScrollIndex={itemIndex}
        style={styles.flatlist2}
        contentContainerStyle={{ paddingBottom: height(2) }}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  empty: {
    height: height(20),
    width: width(100),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: width(4),
  },
});
