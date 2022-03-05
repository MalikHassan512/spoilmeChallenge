import auth from '@react-native-firebase/auth';
import {addUserData} from '../firestore/users';
import {deleteProfilePic, uploadProfilePic} from '../storage/profilPic';
import {deleteAccount} from './deleteAccount';

export const signupWithEmail = async user => {
  const userCredentials = await auth().createUserWithEmailAndPassword(
    user.email,
    user.password,
  );
  let profilePicUrl;
  try {
    profilePicUrl = await uploadProfilePic(user.profilePic);
    await addUserData(
      userCredentials.user.uid,
      user.firstName,
      user.lastName,
      user.gender,
      user.dob,
      user.email,
      profilePicUrl,
      user.location,
    );
    return userCredentials.user.uid;
  } catch (e) {
    //if profilePicUrl is not undefined then error
    //came before it so profilePice is not saved in firebase
    if (profilePicUrl) deleteProfilePic(profilePicUrl);
    await deleteAccount();
    throw Error(e);
  }
};
