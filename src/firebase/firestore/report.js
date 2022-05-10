import firestore from "@react-native-firebase/firestore";

export const reportPost = async (
    postBy,
    reportBy,
    postId,
    reportStatus = 0,
  ) => {
    const id = reportBy+"__"+postId;
    await firestore().doc(`reports/${id}`).set(
      {
        id,
        postBy,
        reportBy,
        reportStatus,
        postId,
        date: firestore.Timestamp.now(),
      },
      { merge: true }
    );
  };

export const checkReportedPost = async(reportBy,postId)=>{
    const result = await firestore()
    .collection(`reports`)
    .doc(reportBy+"__"+postId).get()
    return result.data();
}