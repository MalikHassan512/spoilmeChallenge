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

  for (const spoilId of spoilsID) {
    var spoil = await firestore().collection("spoils").doc(spoilId).get();
    tempSpoils.push(spoil.data());
  }
  return tempSpoils;
};

export const getUserSpoilsOwned = async (userId, setUserOwnedSpoils) => {
  console.log("My user id is: ", userId);

  firestore()
    .collection("users")
    .doc(userId)
    .collection("spoilsOwned")
    .onSnapshot(
      (spoilsSnapshot) => {
        // TODO value only updates when wallet is tapped, hence
        let tempUserOwnedSpoilsIDs = [];

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

export const getAllSpoilMeUsers = async (setSpoiMeUsers) => {
  firestore()
    .collection("users")
    .onSnapshot((userSnapshot) => {
      let users = [];

      userSnapshot?.forEach((userSnapshot) => {
        const userData = userSnapshot.data();
        console.log("User data is: ", userData);
        users.push(userData);
      });

      setSpoiMeUsers(users);
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

const doesUserOwnSpoil = async (ownerID, spoilID) => {
  return await firestore()
    .collection("users")
    .doc(ownerID)
    .collection("spoilsOwned")
    .doc(spoilID)
    .get();
};

const checkIfSpoilExists = async (spoilID) => {
  return await firestore().collection("spoils").doc(spoilID).get();
};
export const transferUserSpoil = async (ownerID, receiverID, spoilID) => {
  // check if the spoilID is owned by the owner

  console.log(
    "Inside transfer user spoil, ownerId is: ",
    ownerID,
    " receiverId is: ",
    receiverID,
    " spoilId is: ",
    spoilID
  );

  checkIfSpoilExists(spoilID).then((checkSpoil) => {
    let checkSpoilData = checkSpoil.data();

    if (checkSpoilData.id != null) {
      doesUserOwnSpoil(ownerID, spoilID).then((fethcedSpoil) => {
        let fethcedSpoilData = fethcedSpoil.data();

        if (fethcedSpoilData.spoilID != null) {
          console.log("User does own this spoil :)");

          // delete spoil from users spoilOwned collection

          let userOwnedSpoilDocRef = firestore()
            .collection("users")
            .doc(ownerID)
            .collection("spoilsOwned")
            .where("spoilID", "==", fethcedSpoilData.spoilID);
          userOwnedSpoilDocRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(
                "Deleitng doc reference from userOwnedSpoils collection"
              );
              doc.ref.delete().then((value) => {
                console.log("After deleting doc value is: ", value);
              });
            });
          });

          // now that the doc has been removed, add the spoil to the receivers spoilsOwned Collection

          let transferSpoil = firestore()
            .collection("users")
            .doc(receiverID)
            .collection("spoilsOwned")
            .doc(spoilID)
            .set({
              spoilID: spoilID,
              date: Date.now(),
            });

          console.log("Spoil has been transfered to: ", receiverID);
        } else {
          console.log("User doesnot own this spoil :!");
        }
      });
    }
  });
};
