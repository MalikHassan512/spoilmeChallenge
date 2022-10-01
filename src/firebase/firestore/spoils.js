import firestore from "@react-native-firebase/firestore";
import { isEqualIcon } from "react-native-paper/lib/typescript/components/Icon";
import uuid from "react-native-uuid";

var isAsyncDone = false;

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

  // adding a spoil to the users spoil collection if sent through chat
  await firestore()
    .collection("users")
    .doc(to)
    .collection("spoilsOwned")
    .doc(id)
    .set({
      spoilID: id,
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

const fetchSpoilDoc = async (spoilId) => {
  var spoil = await firestore().collection("spoils").doc(spoilId).get();
  return spoil;
};

const fetchAllSpoilsWithID = async (spoilsID) => {
  var tempSpoils = [];

  for (const spoilID of spoilsID) {
    var spoil = await firestore().collection("spoils").doc(spoilID).get();
    tempSpoils.push(spoil.data());
  }
  return tempSpoils;
};

export const getUserSpoilsOwned = async (userId, setUserOwnedSpoils) => {
  let tempUserOwnedSpoilsIDs = [];

  console.log("My user id is: ", userId);

  firestore()
    .collection("users")
    .doc(userId)
    .collection("spoilsOwned")
    .onSnapshot(
      (spoilsSnapshot) => {
        // TODO value only updates when wallet is tapped, hence

        spoilsSnapshot?.forEach((spoilSnapshot, i) => {
          var data = spoilSnapshot.data();
          tempUserOwnedSpoilsIDs.push(data.spoilID);
        });

        // console.log("Spoils Owned IDs are: ", tempUserOwnedSpoilsIDs);

        fetchAllSpoilsWithID(tempUserOwnedSpoilsIDs).then((spoils) => {
          // console.log(
          //   "After fetching spoils notw setting these spoils: ",
          //   spoils
          // );
          setUserOwnedSpoils(spoils);
        });
      },
      (error) => {
        console.log(error);
      }
    );
};

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

      console.log("temp spoils is: ", tempSpoils);
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
