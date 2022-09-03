/* eslint-disable react-native/no-inline-styles */
import { View, FlatList, Image, Text, TouchableOpacity } from "react-native";
import { ScaledSheet, verticalScale } from "react-native-size-matters";
import React, { useEffect, useState } from "react";
import Colors from "util/colors";
import { height, width } from "react-native-dimension";
import Post from "../../../components/Post";
import ScreenWrapper from "../../../components/ScreenWrapper";
import ImageView from "react-native-image-viewing";
import { Loading } from "components/Common/Loading";
import { fromNow } from "util/helper";
import { useIsFocused } from "@react-navigation/native";
import Stories from "react-native-stories-media";

import { useSelector } from "react-redux";
import { getHomeData } from "../../../firebase/firestore/posts";

import { getAllSpoilTypes } from "../../../firebase/firestore/spoils";
import { getAllUsers } from "../../../firebase/firestore/users";
import CreatePostModal from "../Molecules/CreatePostModal";
import HomeHeader from "components/HomeHeader";
import { useSwipe } from "../../../util/useSwipe";
import colors from "../../../util/colors";

const Home = ({ navigation, route }) => {
  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);
  const isFocused = useIsFocused();

  function onSwipeLeft() {
    console.log("SWIPE_LEFT");
  }

  function onSwipeRight() {
    // navigation.navigate("CameraScreen");
  }
  
  const userId = useSelector((state) => state.user.userId);
  const [pageLoading, setPageLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [spoilTypes, setSpoilTypes] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isFocused) {
      loadData();
      getSpoilType();
    }
  }, [isFocused]);
  useEffect(() => {
    getStories();
  }, [route?.params?.updateStory]);
  const getStories = async () => {
    const storiesSnapShot = await getAllUsers();
    let tempData = [];
    storiesSnapShot?.forEach((item) => {
      if (item?.stories) {
        let data = {
          user_id: item?.id,
          profile: item?.profilePic,
          username:
            // userId == item?.id
            //   ? "Your Story"
            //   :
               item?.firstName + " " + item?.lastName,
          stories: item?.stories
            ?.filter((post) => !fromNow(post.createdAt).includes("day"))
            ?.map((post) => ({
              url: post.story_image,
              id: post.story_id,
              duration: 2,
              type: "image",
            }))
            .sort((a, b) => a?.createdAt?.seconds - b?.date?.seconds || 0),
        };
        if (data.stories.length > 0) {
          tempData.push(data);
        }
      }
    });
    setData(tempData);
  };

  const getSpoilType = () => {
    getAllSpoilTypes()
      .then((res) => setSpoilTypes(res))
      .catch((e) => {
        console.log("getSpoilType line 62", e);
      });
  };
  const loadData = async () => {
    setPageLoading(true);
    const { posts } = await getHomeData(userId);
    setPosts(posts);
    setRefreshing(false);
    setPageLoading(false);
  };
  const renderPost = ({ item }) => {
    if (item?.postType == "MAP") {
      return (
        <Post
          loadData={loadData}
          description={item.description}
          name={item?.name}
          postType={"MAP"}
          spoilTypes={spoilTypes}
        />
      );
    } else {
      return (
        <Post
          loadData={loadData}
          postId={item?.id}
          spoilTypes={spoilTypes}
          createdAt={item?.createdAt}
          postUserId={item?.userId}
          dataType={item?.dataType}
          postType={item?.postType}
          image={item.image}
          description={item.description}
        />
      );
    }
  };
  const renderEmpty = ({ item }) => {
    return (
      <View style={styles.empty}>
        {pageLoading ? (
          <Loading />
        ) : (
          <Text style={styles.emptyText}>No posts available</Text>
        )}
      </View>
    );
  };
  return (
    <>
      <View
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ flex: 1, }}
      >
        <HomeHeader onPlusCircle={() => setVisible(!visible)} />

        <CreatePostModal
          visible={visible}
          setVisible={setVisible}
          loadData={loadData}
        />
        <FlatList
          ListHeaderComponent={() => 
          <View style={{marginTop:verticalScale(10),marginHorizontal:10}}>
          <Stories avatarStyle={{width:verticalScale(55),height:verticalScale(55)}} containerAvatarStyle={{borderColor:colors.primary}} key={"storykey"} data={data} />
          </View>
          }
          data={posts}
          contentContainerStyle={{ paddingBottom: height(2) }}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            setRefreshing(true);
            loadData();
          }}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </>
  );
};

export default Home;

const styles = ScaledSheet.create({
  mainViewContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingVertical: "16@vs",
    backgroundColor: "white",
  },

  headerContainer: {
    marginTop: "12@vs",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: "26@ms",
  },
  opportunityContainer: {
    marginTop: "21@vs",
    marginStart: "23@vs",
    marginEnd: "27@vs",
  },
  spoilBox: {
    marginStart: "22@vs",
    marginEnd: "25@vs",
  },
  opportunityBox: {
    marginStart: "25@vs",
    marginEnd: "27@vs",
    flexDirection: "column",
  },
  empty: {
    height: height(20),
    width: width(100),
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "baseline",
  },
  icon: {
    fontSize: "23@ms",
    marginStart: "23@ms",
  },
  mapImages: {
    width: "97@s",
    height: "54@vs",
  },
  spoilImages: {
    width: "55@s",
    height: "55@vs",
    resizeMode: "contain",
    overflow: "hidden",
  },
  text200: {
    fontSize: "14@ms",
    fontWeight: "bold",
    marginLeft: "5@s",
  },
  emptyText: {
    color: Colors.black,
    fontWeight: "bold",
    fontSize: width(4),
  },
  avatarContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    height: "60@vs",
    width: "60@vs",
    borderRadius: "75@vs",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    height: "55@vs",
    width: "55@vs",
    borderRadius: "70@vs",
  },
  name: {
    fontSize: width(2.8),
    color: Colors.black,
    alignSelf: "center",
    marginTop: height(0.5),
  },
  storyContainer: {
    paddingHorizontal: width(2),
    marginRight: width(1),
  },
  flatlist: {
    marginLeft: width(2),
    marginTop: height(1),
    height: height(14),
    flexGrow: 0,

    // backgroundColor: 'yellow'
  },
  flatlist2: {
    // backgroundColor: 'red',
  },
});
