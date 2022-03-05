import auth from '@react-native-firebase/auth';

export const checkAuth = handleAuthStateChange => {
  return auth().onAuthStateChanged(handleAuthStateChange);
};
