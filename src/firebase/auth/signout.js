import auth from '@react-native-firebase/auth';

export const signout = async () => {
  await auth().signOut();
};
