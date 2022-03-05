import auth from '@react-native-firebase/auth';

export const forgotPassword = async email => {
  await auth().sendPasswordResetEmail(email);
};
