import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";
import { fromNow } from "util/helper";
import { getAllUsers, getUser } from "./users";

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

export const createStory = async (post) => {
  const id = post.userId + "__" + uuid.v4();
  await firestore()
    .collection("users")
    .doc(post.userId)
    .update({
      stories: firestore.FieldValue.arrayUnion({
        story_id: id,
        createdAt: firestore.Timestamp.now(),
        ...post,
      }),
    });
};
export const deletePost = async (id) => {
  try {
    return await firestore()
      .collection("posts")
      .doc(id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.ref.delete();
      });
  } catch (error) {
    console.log("deletePost", error);
    throw error;
  }
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
      let post = doc.data();
      if (post.type == "Post") {
        posts.push({
          userId: post.userId,
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
            userId: post.userId,
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
  return { posts, stories };
}

export async function getPosts(userId) {
  try {
    console.log("Getting posts");
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
    console.log("getPosts line 37", error);
    throw error;
  }
}
