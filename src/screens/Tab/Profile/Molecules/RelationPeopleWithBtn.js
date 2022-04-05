import { View, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "../../../../components/CustomText";
import colors from "../../../../util/colors";
import images from "../../../../assets/images";

const RelationPeopleWithBtn = ({ isOnline }) => {
  const [spoil, setSpoil] = useState(true);
  const peoples = [
    {
      img: images.people1,
      name: "Name",
    },
  ];
  return (
    <FlatList
      data={peoples}
      renderItem={(element) => {
        return (
          <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.imgContainer}>
                <Image style={styles.img} source={element.item.img} />
              </View>
              <CustomText label={element.item.name} textStyle={styles.text} />
            </View>
            <TouchableOpacity
              onPress={() => setSpoil(!spoil)}
              style={styles.btn}
            >
              <CustomText
                label={spoil ? "Spoil" : "Spoil Send"}
                textStyle={styles.btnText}
              />
            </TouchableOpacity>
          </View>
        );
      }}
    ></FlatList>
  );
};

export default RelationPeopleWithBtn;

const styles = ScaledSheet.create({
  container: {
    marginBottom: "8@vs",
    alignItems: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imgContainer: {
    width: "55@ms",
    height: "55@ms",
    overflow: "hidden",
    borderRadius: "100@ms",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10@vs",
    marginRight: "15@s",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    fontSize: "16@ms",
    color: colors.black,
    fontWeight: "bold",
  },
  btn: {
    paddingHorizontal: "20@s",
    paddingVertical: "6@vs",
    borderRadius: "50@ms",
    backgroundColor: colors.primary,
  },
  btnText: {
    fontSize: "16@ms",
    fontWeight: "bold",
    color: colors.white,
  },
});
