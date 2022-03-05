import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '402944316207-7l9hmjdeoac3t4n5pbfgfih23p7smsop.apps.googleusercontent.com',
});

export const signinWithEmail = async (email, password) => {
  const userCredential = await auth().signInWithEmailAndPassword(
    email,
    password,
  );
  return userCredential.user.uid;
};

export const signinWithGoogle = async () => {
  const {idToken} = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const userCredential = await auth().signInWithCredential(googleCredential);
  return userCredential.user.uid;
};
