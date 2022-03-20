import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";

export const createRelationship = async (
  from,
  to,
  lastMessage,
  relationStatus = 0
) => {
  const id = uuid.v4();
  await firestore().doc(`relationships/${id}`).set({
    id,
    from,
    to,
    relationStatus,
    lastMessage,
    date: firestore.Timestamp.now(),
  });
};

export const getUserRelationships = async (userId) => {
  const result = await firestore().collection(`relationships`).get();
  const relationships = [];
  // result.forEach(item=>console.log(item.data()))
  // result1.forEach(res =>res.data().from.id==userId || relationships.push(res.data()));
  result.forEach((item, index) => {
    if (item?.data()?.from?.id == userId || item?.data()?.to?.id == userId) {
      relationships.push(item.data());
    }
  });
  return relationships;
};

export const checkUserRelationships = async (userId, otherUserId) => {
  console.log("userId", userId, "otherUserId", otherUserId);
  const result = await firestore().collection(`relationships`).get();
  let flag = false;
  result.forEach((item, index) => {
    if (
      (item?.data()?.from?.id == userId &&
        item?.data()?.to?.id == otherUserId) ||
      (item?.data()?.from?.id == otherUserId && item?.data()?.to?.id == userId)
    ) {
      flag = true;
    }
  });
  return flag;
};
export const updateRelationStatus =async(message,status)=>{
  try {
    console.log(message,status)
    await firestore().doc(`relationships/${message.id}`).update({...message,relationStatus:status});
  } catch (error) {
    
  }
}
