import uuid from "react-native-uuid";
import storage from "@react-native-firebase/storage";
import { Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

export const uploadProfilePic = async (
  profilePic,
  id,
  folder = "profilePics"
) => {
  const uploadUri =
    Platform.OS === "ios"
      ? profilePic.uri.replace("file://", "")
      : profilePic.uri;
  const storageRef = storage().ref().child(`${folder}/${id}`);
  await storageRef.putFile(uploadUri);
  return await storageRef.getDownloadURL();
};
export const deleteProfilePic = async (profilePicId) => {
  const storageRef = storage().ref().child(`profilePics/${profilePicId}`);
  await storageRef.delete();
};

export const uploadVideo = async (image, id) => {
  let uploadUri = "";
  if (Platform.OS === "ios") {
    uploadUri = image.uri.replace("file://", "");
  } else {
    const stat = await RNFetchBlob.fs.stat(image.uri);
    uploadUri = stat.path;
  }

  const storageRef = storage().ref().child(`${"posts"}/${id}`);
  await storageRef.putFile(uploadUri);
  return await storageRef.getDownloadURL();
};
