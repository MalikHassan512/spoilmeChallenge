import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export const addSpoilData = async (name, image, from, to) => {
  const id = uuid.v4();
  await firestore().doc(`spoils/${id}`).set({
    id,
    name,
    from,
    image,
    to,
    date: firestore.Timestamp.now(),
  });
};

export const getSpoils = (userId, setSpoils) => {
  const isDateEqual = (date1, date2) => {
    return (
      date1.getDay() === date2.getDay() &&
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth()
    );
  };

  return firestore()
    .collection('spoils')
    // .where('to', '==', `${userId}`)
    .orderBy('date', 'desc')
    .onSnapshot(spoilsSnapshot => {
      const tempSpoils = [];
      let tempDate = new Date();
      let tempSpoilDateGroup = [];
      spoilsSnapshot.forEach((spoilSnapshot, i) => {
        const tempSpoil = spoilSnapshot.data();
        const spoilDate = tempSpoil.date.toDate();
        tempSpoil.date = spoilDate;
        if( (tempSpoil.to.id === userId || tempSpoil.from.id === userId)){
        if (i !== 0 && !isDateEqual(tempDate, spoilDate)) {
          console.log('here');
          tempSpoils.push(tempSpoilDateGroup);
          tempSpoilDateGroup = [];
          tempDate = spoilDate;
        }
        tempSpoilDateGroup.push(tempSpoil);
      }
      });
      tempSpoils.push(tempSpoilDateGroup);

      setSpoils(tempSpoils);
      // const spoilData=[]
      // spoilsSnapshot.forEach((item,index)=>{
      //   let spoil=item.data();
      //   console.log(index,spoilData)
      //   let spoilDate=spoil.date.toDate();
      //   if(spoilsSnapshot.length==1){
      //     spoilData.push({
      //       date:spoilDate,
      //       data:[spoil],
      //     })
      //   }
      //   if(index+1!==spoilsSnapshot.length){
      //   let nextSpoil=spoilsSnapshot[index+1].data();
      //   let nextSpoilDate=nextSpoil.date.toDate();

      

      //   if(isDateEqual(spoilDate, nextSpoilDate)){
      //       spoilData.push({
      //         date:spoilDate,
      //         data:[...spoilData.data,[spoil,nextSpoil]]
      //       })
      //   }else{

      //     spoilData.push({
      //       date:spoilDate,
      //       data:[spoil]
      //     },
      //     {
      //       date:nextSpoilDate,
      //       data:[nextSpoil]
      //     }
      //     )
           
      //   }
      // }

      // })
    
      
    });
};

export const getSpoilType = async name => {
  const spoilType = await firestore().doc(`spoilTypes/${name}`).get();
  return spoilType.data();
};

export const getAllSpoilTypes = async () => {
  const rawSpoilTypes = await firestore().collection(`spoilTypes`).get();
  let spoilTypes = [];
  rawSpoilTypes.forEach(rawSpoilType => spoilTypes.push(rawSpoilType.data()));
  return spoilTypes;
};
