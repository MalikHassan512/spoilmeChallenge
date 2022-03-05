import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export const createRelationship = async (user1, user2) => {
  const id = uuid.v4();
  await firestore().doc(`relationships/${id}`).set({
    id,
    user1,
    user2,
  });
};

export const getUserRelationships = async userId => {
  const result1 = await firestore()
    .collection(`relationships`)
    .where('user1', '==', userId)
    .get();
  const result2 = await firestore()
    .collection(`relationships`)
    .where('user2', '==', userId)
    .get();
  const relationships = [];
  result1.forEach(res => relationships.push(res.data()));
  result2.forEach(res => relationships.push(res.data()));
  return relationships;
};
