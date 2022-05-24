import { TouchableOpacity, TextInput, View } from "react-native";
import React, { useState } from "react";
import CustomModal from "components/CustomModal";
import { ScaledSheet } from "react-native-size-matters";
import colors from "../../util/colors";
import { reportPost, checkReportedPost } from "../../firebase/firestore/report";
import CustomText from "../CustomText";
import SimpleToast from "react-native-simple-toast";

const ReportModal = ({ visible, setVisible,setParentVisible,postBy,reportBy,postId,postImage,postTitle, userEmail }) => {
  const [title, setTitle] = useState("");
  const onClickReport = async () => {
    try {
      const isReported = await checkReportedPost(reportBy, postId);
      if (!isReported) {
        reportPost(postBy, reportBy, postId,title,postImage,postTitle,userEmail);
        SimpleToast.show("Post reported");
      } else {
        SimpleToast.show("Already reported!");
      }
      setVisible(false)
      setTitle("")
    } catch (error) {
      console.log("errror onClickReport", error);
      setVisible(false);
      setParentVisible(false)
    }
  };
  return (
    <CustomModal
      isModalVisible={visible}
      setModalVisible={() => {
        setVisible(false);
      }}
    >
      <View style={styles.modalContainer}>
        <CustomText label="Report Post" textStyle={styles.CreatePostTitle} />

        <TextInput
          value={title}
          onChangeText={(newVal) => setTitle(newVal)}
          placeholder="What is the reason?"
          multiline={true}
          style={styles.inputStyle}
        />
      </View>
      <TouchableOpacity activeOpacity={0.6} onPress={onClickReport}>
        <CustomText
          label={"Report Post"}
          container={styles.uploadImageContainer}
          textStyle={styles.uploadimageText}
        />
      </TouchableOpacity>
    </CustomModal>
  );
};

export default ReportModal;

const styles = ScaledSheet.create({
  modalContainer: {
    backgroundColor: colors.white,
    width: "100%",
    height: '250@vs',
    alignSelf: "center",
    borderRadius: "10@s",
    alignItems: "center",
    padding: "10@s",
  },
  CreatePostTitle: {
    fontSize: "18@ms",
    fontWeight: "700",
    color: colors.black,
    alignSelf: "center",
    marginTop: "10@s",
  },
  inputStyle: {
    marginVertical: 20,
    textAlignVertical: "top",
    borderColor: "grey",
    padding: 20,
    borderWidth: 1.5,
    marginHorizontal: 15,
    borderRadius: 10,
    width: "90%",
    height: "100@s",
  },
  uploadImageContainer: {
    alignSelf: "center",
    padding: "10@s",
    backgroundColor: colors.primary,
    borderRadius: "25@s",
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: "10@s",
    position: "absolute",
    bottom: 0,
  },
  uploadimageText: {
    color: colors.white,
    fontSize: "12@ms",
    alignSelf: "center",
  },
});
