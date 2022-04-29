import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";

export const createRelationship = async (
  from,
  to,
  lastMessage,
  relationStatus = 0,
  spoilStatus
) => {
  const id = from > to ? (from+"__"+to) : (to+"__"+from);
  await firestore().doc(`relationships/${id}`).set({
    id,
    from,
    to,
    relationStatus,
    lastMessage,
    date: firestore.Timestamp.now(),
    spoilStatus
    },{merge:true});
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

export const checkUserRelationships = async (from, to) => {
  const id = from > to ? (from+"__"+to) : (to+"__"+from);
  const result = await firestore().collection(`relationships`).doc(id).get();
 
  return result.data();
};
export const updateRelationStatus =async(from,to,lastMessage)=>{
  const id = from > to ? (from+"__"+to) : (to+"__"+from);

  try {
    await firestore().doc(`relationships/${id}`).set({
      date: firestore.Timestamp.now(),
      lastMessage:lastMessage,
    },{merge:true});
  } catch (error) {
    console.log("updateRelationStatus",error)
  }
}
