import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {addUserData} from '../firestore/users';
import {deleteProfilePic, uploadProfilePic} from '../storage/profilPic';
import {deleteAccount} from './deleteAccount';

export const signupWithEmail = async user => {
  console.log('user',user)
  const userCredentials = await auth().createUserWithEmailAndPassword(
    user.email,
    user.password,
  );
  let profilePicUrl;
  try {
    profilePicUrl = await uploadProfilePic(user.profilePic,userCredentials.user.uid);
    await addUserData(
      userCredentials.user.uid,
      user.firstName,
      user.lastName,
      user.gender,
      user.dob,
      user.email,
      profilePicUrl,
      user.location,
      user.fb,
      user.twitter,
      user.linkedin,

    );
    return userCredentials.user.uid;
  } catch (e) {
    //if profilePicUrl is not undefined then error
    //came before it so profilePice is not saved in firebase
    if (profilePicUrl) deleteProfilePic(userCredentials.user.uid);
    await deleteAccount();
    throw Error(e);
  }
};
