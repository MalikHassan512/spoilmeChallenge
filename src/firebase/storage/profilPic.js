import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native'

export const uploadProfilePic = async (profilePic,id,folder="profilePics") => {
  const uploadUri = Platform.OS === 'ios' ? profilePic.uri.replace('file://', '') : profilePic.uri;
  const storageRef = storage().ref().child(`${folder}/${id}`);
  await storageRef.putFile(uploadUri);
  return await storageRef.getDownloadURL();
};
export const deleteProfilePic = async profilePicId => {
  const storageRef = storage().ref().child(`profilePics/${profilePicId}`);
  await storageRef.delete();
};
