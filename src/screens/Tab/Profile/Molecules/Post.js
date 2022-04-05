import { View, Image, FlatList } from "react-native";
import React from "react";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "../../../../components/CustomText";
import images from "../../../../assets/images";
import colors from "../../../../util/colors";

const Post = () => {
  const post = [
    {
      img: images.people1,
      name: "Harry Styles",
      time: "4 hrs ago",
      post: "Beach day! Time to take put on my sunglasses and open up a book :)",
      photo: images.people1,
    },
  ];
  return (
    <FlatList
      data={post}
      renderItem={(element) => {
        return (
          <View style={styles.mainContainer}>
            <View style={styles.postContainer}>
              <View style={styles.container}>
                <View style={styles.imgContainer}>
                  <Image style={styles.img} source={element.item.img} />
                </View>
                <View>
                  <CustomText
                    textStyle={styles.name}
                    label={element.item.name}
                  />
                  <CustomText
                    textStyle={styles.time}
                    label={element.item.time}
                  />
                </View>
              </View>
              <CustomText
                textStyle={styles.postText}
                label={element.item.post}
              />
            </View>
            <View style={styles.photoContainer}>
              <Image style={styles.photo} source={element.item.photo} />
            </View>
          </View>
        );
      }}
    ></FlatList>
  );
};

export default Post;

const styles = ScaledSheet.create({
  mainContainer: {
    marginTop: "15@vs",
    backgroundColor: "#F2F2F2",
    borderRadius: "5@ms",
    marginBottom: "25@vs",
  },
  postContainer: {
    padding: "15@ms",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "10@vs",
  },
  imgContainer: {
    width: "34@ms",
    height: "34@ms",
    borderRadius: "100@ms",
    borderWidth: "2@ms",
    borderColor: colors.white,
    marginRight: "10@s",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  name: {
    fontSize: "14@ms",
    fontWeight: "bold",
    color: colors.black,
  },
  time: {
    fontSize: "12@ms",
    color: colors.black,
  },
  postText: {
    fontSize: "14@ms",
    fontWeight: "400",
    color: colors.black,
    // marginBottom: "10@vs",
  },
  photoContainer: {
    width: "100%",
    height: "320@vs",
    backgroundColor: colors.postBg,
    marginBottom: "30@vs",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
