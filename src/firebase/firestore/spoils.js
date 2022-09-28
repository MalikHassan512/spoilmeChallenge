import firestore from "@react-native-firebase/firestore";
import { isEqualIcon } from "react-native-paper/lib/typescript/components/Icon";
import uuid from "react-native-uuid";

export const addSpoilData = async (name, image, from, to, relationId) => {
  const id = uuid.v4();
  await firestore().doc(`spoils/${id}`).set(
    {
      id,
      name,
      from,
      image,
      to,
      date: firestore.Timestamp.now(),
      relationId,
    },
    { merge: true }
  );

  // // adding a spoil to the users spoil collection if sent through chat
  // await firestore()
  //   .collection("users")
  //   .doc(to)
  //   .collection("spoilsOwned")
  //   .doc(id)
  //   .set({
  //     spoilID: id,
  //     date: firestore.Timestamp.now(),
  //   });
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
    .collection("spoils")
    .orderBy("date", "desc")
    .onSnapshot((spoilsSnapshot) => {
      const tempSpoils = [];
      let tempDate = new Date();
      let tempSpoilDateGroup = [];
      spoilsSnapshot?.forEach((spoilSnapshot, i) => {
        const tempSpoil = spoilSnapshot.data();
        const spoilDate = tempSpoil.date.toDate();
        tempSpoil.date = spoilDate;
        if (tempSpoil.from === userId) {
          if (i !== 0 && !isDateEqual(tempDate, spoilDate)) {
            tempSpoils.push(tempSpoilDateGroup);
            tempSpoilDateGroup = [];
            tempDate = spoilDate;
          }
          tempSpoilDateGroup.push(tempSpoil);
        }
      });
      tempSpoils.push(tempSpoilDateGroup);

      setSpoils(tempSpoils);
    });
};

// export const getUserSpoilsOwned = async (userId, setSpoils) => {
//   console.log("My user id is: ", userId);

//   const tempSpoils = [];
//   var spoilsData = [];

//   var getIDs = firestore()
//     .collection("users")
//     .doc(userId)
//     .collection("spoilsOwned")
//     .onSnapshot((spoilsSnapshot) => {
//       spoilsSnapshot?.forEach(async (spoilSnapshot, i) => {
//         var data = spoilSnapshot.data();
//         var temporarySpoil = await firestore()
//           .collection("spoils")
//           .doc(data.spoilID)
//           .get();

//         var tempSpoilDateGroup = [];

//         if (i !== 0) {
//           tempSpoils.push(tempSpoilDateGroup);
//           tempSpoilDateGroup.push((tempDate = temporarySpoil.data().date));
//         }

//         tempSpoils.push(temporarySpoil);
//         console.log("Temporary spoil isss: ", temporarySpoil.data().id);
//       });
//       setSpoils(tempSpoils);
//     });
// };

export const getUserSpoils = (userId, setSpoils) => {
  const isDateEqual = (date1, date2) => {
    return (
      date1.getDay() === date2.getDay() &&
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth()
    );
  };

  return firestore()
    .collection("spoils")
    .orderBy("date", "desc")
    .onSnapshot((spoilsSnapshot) => {
      const tempSpoils = [];
      let tempDate = new Date();
      let tempSpoilDateGroup = [];
      spoilsSnapshot?.forEach((spoilSnapshot, i) => {
        const tempSpoil = spoilSnapshot.data();
        const spoilDate = tempSpoil.date.toDate();
        tempSpoil.date = spoilDate;
        if (tempSpoil.to === userId) {
          if (i !== 0) {
            tempSpoils.push(tempSpoilDateGroup);
            tempSpoilDateGroup = [];
            tempDate = spoilDate;
          }
          tempSpoilDateGroup.push(tempSpoil);
        }
      });
      tempSpoils.push(tempSpoilDateGroup);

      setSpoils(tempSpoils);
    });
};

export const getSpoilType = async (name) => {
  const spoilType = await firestore().doc(`spoilTypes/${name}`).get();
  return spoilType.data();
};

export const getAllSpoilTypes = async () => {
  const rawSpoilTypes = await firestore().collection(`spoilTypes`).get();
  let spoilTypes = [];
  rawSpoilTypes.forEach((rawSpoilType) => spoilTypes.push(rawSpoilType.data()));
  return spoilTypes;
};
