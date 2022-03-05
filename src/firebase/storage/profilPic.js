import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';

export const uploadProfilePic = async profilePic => {
  const storageRef = storage().ref().child(`profilePics/${uuid.v4()}`);
  await storageRef.putFile(profilePic);
  return await storageRef.getDownloadURL();
};
export const deleteProfilePic = async profilePicId => {
  const storageRef = storage().ref().child(`profilePics/${profilePicId}`);
  await storageRef.delete();
};
