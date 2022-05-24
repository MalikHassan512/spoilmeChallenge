import { View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import CustomText from "../CustomText";
import colors from "../../util/colors";
import { moderateScale, ScaledSheet } from "react-native-size-matters";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { deletePost } from "../../firebase/firestore/posts";
import Modal from "react-native-modal";
import { Loading } from "components/Common/Loading";

const PopupModal = ({
  visible,
  setVisible,
  postId,
  showDelete,
  setNestedReportModal,
  loadData,
  setPostData
}) => {
  const onClickReport = ()=>{
    setVisible(false)
    setNestedReportModal(true)
  }
  const [loader, setLoader] = useState(false);
  const onClickDelete = async () => {
    try {
      setLoader(true);
      await deletePost(postId);
      await loadData?.();
      setPostData?.(prev=>prev.filter(item=>item.id!=postId))
      setLoader(false);
      setVisible(false);
    } catch (error) {
      console.log("onClickDelete error", error);
      setLoader(false);
      setVisible(false);
    }
  };
  return (
    <Modal
      style={{ margin: 0 }}
      onBackdropPress={setVisible}
      onBackButtonPress={setVisible}
      visible={visible}
    >
      <View style={styles.firstContainer}>
        <TouchableOpacity onPress={() => setVisible(false)} style={{ flex: 1 }}>
          {loader && <Loading color={colors.primary} />}
        </TouchableOpacity>
        <View style={styles.secondContainer}>
          <View style={styles.emptyView} />
          {/* <TouchableOpacity
            onPress={() => navigation.navigate("Setting")}
            style={styles.settingContainer}
          >
            <AntDesign name="sharealt" size={moderateScale(16)} />
            <CustomText marginLeft={10} fontWeight={'700'} label="Share" />
          </TouchableOpacity> */}
          {showDelete ? (
            <TouchableOpacity
              onPress={(onClickDelete)}
              style={styles.settingContainer}
            >
              <MaterialIcons
                color={colors.primary}
                name="delete"
                size={moderateScale(19)}
              />
              <CustomText
                marginLeft={10}
                fontWeight={"700"}
                color={colors.primary}
                label="Delete"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onClickReport}
              style={styles.settingContainer}
            >
              <MaterialIcons
                color={colors.primary}
                name="report"
                size={moderateScale(19)}
              />
              <CustomText
                marginLeft={10}
                fontWeight={"700"}
                color={colors.primary}
                label="Report"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PopupModal;

const styles = ScaledSheet.create({
  firstContainer: {
    flex: 1,
    backgroundColor: "#C4C4C4aa",
  },
  secondContainer: {
    backgroundColor: "#ffffff",
    height: "14%",
    borderRadius: "30@ms",
    alignSelf: "flex-end",
    width: "100%",
    paddingHorizontal: "25@s",
    position: "absolute",
    bottom: -10,
    paddingVertical: "15@vs",
    paddingTop: "10@vs",
  },
  emptyView: {
    width: "45@s",
    alignSelf: "center",
    backgroundColor: colors.primary,
    height: "4@vs",
    borderRadius: "4@ms",
    marginBottom: "30@vs",
  },
  logoButton: {
    paddingHorizontal: "10@s",
    paddingVertical: "6@vs",
    marginBottom: "15@vs",
  },
  settingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "20@vs",
  },
  settingIcon: {
    width: "23@ms",
    height: "22@ms",
    resizeMode: "contain",
    marginRight: "12@s",
    marginLeft: "15@s",
  },
});
