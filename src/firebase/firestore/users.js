import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import uuid from 'react-native-uuid';

export const addUserData = async (
  id,
  firstName,
  lastName,
  gender,
  dob,
  email,
  profilePic,
  location,
  fb,
  twitter,
  linkedin,

) => {
  const user={
    id,
    firstName,
    lastName,
    gender,
    dob,
    email: email.toLowerCase(),
    profilePic,
    location,
    fb,
    twitter,
    linkedin,
    isHired: false,
    isEngaged: false,
    lastUpdated: moment().valueOf(),
    lastActive:firestore.Timestamp.now(),
    isActive:true,
    isScrapedfb: false,
    isScrapedli: false,
  }
  
   await firestore().collection('users')
   .doc(id)
   .set(user, { merge: true })
   return user;
};

export const getUser = async userId => {
  try {
    const user = await firestore().doc(`users/${userId}`).get();
  return user.data();
  } catch (error) {
    console.log("getUser line 51",error)
    throw error
  }
  
};

export const getUsersById = async usersId => {
  const rawUsers = await firestore()
    .collection(`users`)
    .where('id', 'in', usersId)
    .get();
  const users = [];
  rawUsers.forEach(rawUser => users.push(rawUser.data()));
  return users;
};

export const getAllUsers = async () => {
  const rawUsers = await firestore()
    .collection(`users`)
    .get();
  const users = [];
  rawUsers.forEach(rawUser => users.push(rawUser.data()));
  return users;
};

export const getUsersByName = async name => {
  const rawUsers1 = await firestore()
    .collection(`users`)
    .where('firstName', '>=', name)
    .where('firstName', '<=', name)
    .get();
  const rawUsers2 = await firestore()
    .collection(`users`)
    .where('lastName', '>=', name)
    .where('lastName', '<=', name)
    .get();
  const users = [];
  rawUsers1.forEach(rawUser => users.push(rawUser.data()));
  rawUsers2.forEach(rawUser => users.push(rawUser.data()));
  return users;
};

export const getUsersByLocation = async (latitude, longitude, setUsers) => {
  const tempUsers = [];
  const user = await firestore()
    .collection(`users`)
    .where('location.coords.latitude', '>=', latitude - 30)
    .where('location.coords.latitude', '<=', latitude + 30)
    .where('location.coords.longitude', '>=', longitude - 60)
    .where('location.coords.longitude', '<=', longitude + 60)
    .get();
  user.forEach(user => {
    tempUsers.push(user.data());
  });
  setUsers(tempUsers);
};

export const changeUserData = async (user) => {
  // console.log(user);
  try {
  await firestore()
  .collection('users')
        .doc(user.id)
        .set(user, { merge: true })
  } catch (error) {
   console.log('changeUserData error',error) 
  }
};

export const deleteUserData = async id => {
  await firestore().doc(`users/${id}`).delete();
};
