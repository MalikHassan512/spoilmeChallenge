import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export const createRelationship = async (from, to) => {
  const id = uuid.v4();
  await firestore().doc(`relationships/${id}`).set({
    id,
    from,
    to,
    relationStatus:0,
  });
};

export const getUserRelationships = async userId => {
  const result = await firestore()
    .collection(`relationships`)
    .get();
  const relationships = [];
  // result.forEach(item=>console.log(item.data()))
  // result1.forEach(res =>res.data().from.id==userId || relationships.push(res.data()));
  result.forEach((item,index)=>{

    if(item?.data()?.from?.id==userId || item?.data()?.to?.id==userId){
      relationships.push(item.data()) 
    }

  });
  return relationships
};
