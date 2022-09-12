import firestore from "@react-native-firebase/firestore";
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
};

export const getSpoils = (userId, setSpoils) => {
  const isDateEqual = (date1, date2) => {
    return (
      date1.getDay() === date2.getDay() && date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth()
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
        if (tempSpoil.to === userId || tempSpoil.from === userId) {
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

//quick fix, a really compute intensive way to do things. should find a better way later
export const getUserTotalSpoils = async (userId, setUserSpoils) => {
  let userSpoilCount = 0;

  const spoilref = firestore()
    .collection("spoils")
    .onSnapshot((spoils) => {
      let userSpoilCount = 0;
      spoils?.forEach((spoil) => {
        const tempspoil = spoil.data();
        if (tempspoil.to === userId) {
          userSpoilCount++;
        }
      });

      return setUserSpoils(userSpoilCount);
    });
};
