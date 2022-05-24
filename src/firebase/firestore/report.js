import firestore from "@react-native-firebase/firestore";

export const reportPost = async (
    postBy,
    reportBy,
    postId,
    title,
    postImage,
    postTitle,
    userEmail    
  ) => {
    const id = reportBy+"__"+postId;
    await firestore().doc(`reports/${id}`).set(
      {
        id,
        postBy,
        reportBy,
        reportStatus:0, //reportStatus
        postId,
        postImage,
        postTitle,
        title,
        userEmail,
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