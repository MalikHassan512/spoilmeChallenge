import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";
import {fromNow} from 'util/helper'

export const createPost = async (post) => {
  const id = post.userId + "__" + uuid.v4();
  await firestore()
    .collection("posts")
    .doc(id)
    .set(
      {
        id,
        createdAt: firestore.Timestamp.now(),
        ...post,
      },
      { merge: true }
    );
};

export async function getHomeData(userId) {
  let posts = [];
  let stories = [];
  let querySnapshot = await firestore()
    .collection("posts")
    .orderBy("createdAt", "desc")
    .get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      post = doc.data();
      if (post.type == "Post") {
        posts.push({
          userId:post.userId,
          id: post.id,
          description: post.title,
          postType: post.type,
          image: post.image,
          userData: post.userData,
          createdAt: post.createdAt,
          dataType: post.dataType,
        });
      } else {
        if (!fromNow(post.createdAt).includes("day")) {
          stories.push({
            userId:post.userId,
            id: post.id,
            description: post.title,
            postType: post.type,
            image: post.image,
          });
        }
      }
    } else {
      console.log("No document found!");
    }
  });
  return {posts,stories};
}

export async function getPosts(userId) {
  try {
    let data = [];
    let querySnapshot = await firestore()
      .collection("posts")
      .orderBy("id")
      .startAt(userId)
      .endAt(userId + "~")
      .get();
    querySnapshot.forEach(function (doc) {
      if (doc.exists) {
        post = doc.data();
          if (post.type == "Post" && post.userId == userId) {
            data.push({
              id: post.id,
              description: post.title,
              postType: post.type,
              image: post.image,
              userData: post.userData,
              createdAt: post.createdAt,
              dataType: post.dataType,
            });
          }
      } else {
        console.log("No document found!");
      }
    });
    return data.sort((a, b) => a?.createdAt?.seconds - b?.date?.seconds || 0);
  } catch (error) {
    console.log("getPosts line 37",error)
    throw error
  }
 
}
