import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";

export const createRelationship = async (
  from,
  to,
  lastMessage,
  relationStatus = 0,
  messages
) => {
  const id = uuid.v4();
  await firestore().doc(`relationships/${id}`).set({
    id,
    from,
    to,
    relationStatus,
    lastMessage,
    date: firestore.Timestamp.now(),
    LastMessage:messages
  });
};

export const getUserRelationships = async (userId) => {
  
  // return firestore()
  //   .collection(`relationships`)
  //   .orderBy('date', 'asc')
  //   .onSnapshot(result => {
  //     const relationships = [];
  //     result.forEach((item, index) => {
  //       if (item?.data()?.from?.id == userId || item?.data()?.to?.id == userId) {
  //         relationships.push(item.data());
  //       }
  //   })
  //   setRelationShips(relationships)
  // })
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
  let flag = null;
  result.forEach((item, index) => {
    if (
      (item?.data()?.from?.id == userId &&
        item?.data()?.to?.id == otherUserId) ||
      (item?.data()?.from?.id == otherUserId && item?.data()?.to?.id == userId)
    ) {
      flag = item?.data();
    }
  });
  return flag;
};
export const updateRelationStatus =async(message,LastMessage)=>{
  try {
    await firestore().doc(`relationships/${message.id}`).update({...message,LastMessage});
  } catch (error) {
    
  }
}
