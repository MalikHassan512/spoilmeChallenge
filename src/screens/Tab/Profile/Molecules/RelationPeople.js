import { View, Image, FlatList } from "react-native";
import React from "react";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "../../../../components/CustomText";
import colors from "../../../../util/colors";
import images from "../../../../assets/images";

const RelationPeople = ({ isOnline, item }) => {
  console.log("------Item", item);
  const peoples = [
    {
      img: images.people1,
      name: "Chandler B.",
      online: isOnline,
    },
  ];
  return (
    <FlatList
      data={peoples}
      renderItem={(element) => {
        return (
          <View style={styles.container}>
            <View
              style={[
                styles.imgContainer,
                isOnline && { borderColor: colors.photoBorder, borderWidth: 2 },
              ]}
            >
              <Image style={styles.img} source={{uri:item?.to?.profilePic}} />
            </View>
            <CustomText
              label={item?.to?.firstName + " " + item?.to?.lastName}
              textStyle={styles.text}
            />
          </View>
        );
      }}
    ></FlatList>
  );
};

export default RelationPeople;

const styles = ScaledSheet.create({
  container: {
    marginBottom: "30@vs",
    alignItems: "center",
  },
  imgContainer: {
    width: "90@ms",
    height: "90@ms",
    overflow: "hidden",
    borderRadius: "100@ms",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10@vs",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    fontSize: "14@ms",
    color: colors.black,
    fontWeight: "500",
  },
});
