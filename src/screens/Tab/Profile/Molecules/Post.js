import { View, Image } from "react-native";
import React from "react";
import { ScaledSheet } from "react-native-size-matters";
import CustomText from "../../../../components/CustomText";
import images from "../../../../assets/images";
import colors from "../../../../util/colors";

const Post = () => {
  return (
    <View style={styles.mainContainer}>
      <View>
        <View>
          <Image />
        </View>
        <View></View>
      </View>
    </View>
  );
};

export default Post;

const styles = ScaledSheet.create({
  mainContainer: {
    marginTop: "15@vs",
    paddingTop: "10@vs",
    paddingBottom: "30@vs",
    backgroundColor: "#F2F2F2",
    borderRadius: "5@ms",
  },
});
