import firestore from "@react-native-firebase/firestore";

export const createRelationship = async (
  from,
  to,
  relationStatus = 0,
  lastMessage
) => {
  const id = from > to ? from + "__" + to : to + "__" + from;
  await firestore().doc(`relationships/${id}`).set(
    {
      id,
      from,
      to,
      relationStatus,
      lastMessage,
      date: firestore.Timestamp.now(),
    },
    { merge: true }
  );
};

export const getUserRelationships = async (userId) => {
  try {
    console.log("Fetching relationships from firestore");
    const result = await firestore()
      .collection(`relationships`)
      .orderBy("date", "desc")
      .get();
    const relationships = [];
    result.forEach((item, index) => {
      if (item?.data()?.from == userId || item?.data()?.to == userId) {
        relationships.push(item.data());
      }
    });
    return relationships;
  } catch (error) {
    console.log("getUserRelationships line 37", error);
    throw error;
  }
};

export const checkUserRelationships = async (from, to) => {
  const id = from > to ? from + "__" + to : to + "__" + from;
  const result = await firestore().collection(`relationships`).doc(id).get();
  return result.data();
};
export const updateRelationStatus = async (from, to, relationStatus) => {
  const id = from > to ? from + "__" + to : to + "__" + from;

  try {
    await firestore().doc(`relationships/${id}`).set(
      {
        from,
        to,
        date: firestore.Timestamp.now(),
        relationStatus,
      },
      { merge: true }
    );
  } catch (error) {
    console.log("updateRelationStatus", error);
  }
};

export const updateLastMessage = async (from, to, lastMessage) => {
  const id = from > to ? from + "__" + to : to + "__" + from;

  try {
    await firestore().doc(`relationships/${id}`).set(
      {
        date: firestore.Timestamp.now(),
        lastMessage,
      },
      { merge: true }
    );
  } catch (error) {
    console.log("updateRelationStatus", error);
  }
};
