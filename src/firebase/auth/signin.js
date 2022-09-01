import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

 export const onFacebookButtonPress = async()=> {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();
  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  const userCredential = await auth().signInWithCredential(facebookCredential);
  
  return {
   userId: userCredential.user.uid,
   userData:userCredential.additionalUserInfo.profile,
  }
}


export const signinWithEmail = async (email, password) => {
  const userCredential = await auth().signInWithEmailAndPassword(
    email,
    password,
  );
  return userCredential.user.uid;
};

export const signinWithGoogle = async () => {
  GoogleSignin.configure({
    webClientId:
      '402944316207-7l9hmjdeoac3t4n5pbfgfih23p7smsop.apps.googleusercontent.com',
  });
  const {idToken,user} = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const userCredential = await auth().signInWithCredential(googleCredential);
  return {
   userId: userCredential.user.uid,
   userData: user,
  }
};
