import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';



export const signinWithEmail = async (email, password) => {
  const userCredential = await auth().signInWithEmailAndPassword(
    email,
    password,
  );
  return userCredential.user.uid;
};

export const signinWithGoogle = async () => {
  await GoogleSignin.configure({
    webClientId:
      '402944316207-35kid85mrn6lg9pd98sap8ou4h3hu3sv.apps.googleusercontent.com',
  });
  const data = await GoogleSignin.signIn();
  // console.log("data",data)
  // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  // const userCredential = await auth().signInWithCredential(googleCredential);
  return userCredential.user.uid;
};
