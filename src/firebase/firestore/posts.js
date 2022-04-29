import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";

export const createPost = async (post) => {
  const id = uuid.v4();
  
  await firestore().collection('posts')
  .doc(id)
  .set({
    id,
    createdAt: firestore.Timestamp.now(),
    ...post
  }, { merge: true })
};

export async function getPosts() {
  let data = [];
  let querySnapshot = await firestore().collection("posts")
  .orderBy('createdAt', 'desc')
  .get();
  
  querySnapshot.forEach(function (doc) {
      if (doc.exists) {
          data.push(doc.data());
      } else {
          console.log('No document found!');
      }
  });
  return data;
}

export async function getProfilePosts(userId) {
  let data = [];
  let querySnapshot = await firestore().collection("posts")
  .orderBy('createdAt', 'desc')
  .get();
  querySnapshot.forEach(function (doc) {
      if (doc.exists) {
          post =doc.data()
          if(post.type=="Post" && post.userId == userId){
            data.push({
             id:post.id,
             description:post.title,
             postType:post.type,
             image:post.image,
             userData:post.userData,
             createdAt:post.createdAt,
              dataType:post.dataType,
           })
          }

      } else {
          console.log('No document found!');
      }
  });
  return data;
}
