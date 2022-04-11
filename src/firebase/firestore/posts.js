import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";

export const createPost = async (post) => {
  const id = uuid.v4();
  await firestore().doc(`posts/${id}`).set({
    id,
    createdAt: firestore.Timestamp.now(),
    ...post
  });
};

