/* eslint-disable react-native/no-inline-styles */
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { scale, ScaledSheet, verticalScale } from "react-native-size-matters";
import React, { useEffect, useState } from "react";
import Colors from "util/colors";
import CustomText from "../../../components/CustomText";
import defualtImage from "../../../assets/images/defaultImage.jpg";
import { height, width } from "react-native-dimension";
import Post from "../../../components/Post";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { getAllOfCollection } from "../../../firebase/HelperFunctions/HelperFunctions";
import moment from "moment";
import ImageView from "react-native-image-viewing";
import auth from "@react-native-firebase/auth";
import colors from "../../../util/colors";
import { useSelector } from "react-redux";
import {fromNow} from '../../../util/helper'
import {
  getPosts
} from "../../../firebase/firestore/posts";
import { getAllSpoilTypes } from "../../../firebase/firestore/spoils";
import CreatePostModal from '../Molecules/CreatePostModal'
import HomeHeader from 'components/HomeHeader';
const Home = () => {
  
  const userId = useSelector((state) => state.user.userId);
  const [pageLoading, setPageLoading] = useState(false)
  

  const [stories,setStories] = useState([]);
  const [storyImages, setStoryImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [visible, setVisible] = useState(false);
  const [spoilTypes, setSpoilTypes] = useState([]);

  useEffect(() => {
    loadData();
    getSpoilType()

  }, []);
  const getSpoilType=() => {
    getAllSpoilTypes()
      .then((res) => setSpoilTypes(res))
      .catch((e) => {
        console.log(e);
        alert("Error occured");
      });
  }
  const loadData = async () => {
    setPageLoading(true)
    const users = await getAllOfCollection("users");
    const postData = await getPosts();
    let posts = [];
    let stories = [];
    postData.map(post=>{
      if(post.type=="Post"){
     posts.push({
       id:post.id,
       description:post.title,
       postType:post.type,
       image:post.image,
       userData:post.userData,
       createdAt:post.createdAt,
       dataType:post.dataType,
     })
    }
    if(post.type!="Post"){
      if(!fromNow(post.createdAt).includes('day')){
      stories.push({
        id:post.id,
        description:post.title,
        postType:post.type,
        image:post.image,
        name:post.userId == userId ? "Your Story" : post.userData?.firstName

      })
    }
    }
    })
    setStories(stories)
    // posts.push({
    //   id:893234,
    //   description:'My Videos',
    //   postType:'Post',
    //   image:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    //   dataType:'video',


    // })
    users.map((user) => {
      let dob = new Date(user?.dob?.seconds * 1000);
      let formatedDate = moment(dob).format("DD-MM-YYYY");
      let todaysDate = moment().format("DD-MM-YYYY");
      if (user?.id !== auth().currentUser.uid) {
        if (formatedDate == todaysDate) {
          posts.push({
            id: user?.id + "BIRTHDAY",
            postType: "BIRTHDAY",
            description: `${user?.firstName} ${user?.lastName} has their birthday today! Spoil him!`,
            name: `${user?.firstName} ${user?.lastName}`,
            userData:user,
          });
        }
        if (user?.isHired) {
          posts.push({
            id: user?.id + "HIRED",
            postType: "HIRED",
            description: `${user?.firstName} ${user?.lastName} has been hired recently! Spoil him!`,
            name: `${user?.firstName} ${user?.lastName}`,
            userData:user,

          });
        }
        if (user?.isEngaged) {
          posts.push({
            id: user?.id + "ENGAGED",
            postType: "ENGAGED",
            description: `${user?.firstName} ${user?.lastName} has been engaged recently! Spoil him!`,
            name: `${user?.firstName} ${user?.lastName}`,
            userData:user,
          });
        }
      }
    });
   
    setPosts(posts);
    setRefreshing(false);
    setPageLoading(false)

  };
  const renderStoryAvatar = ({ item }) => {
    return (
      <View style={styles.storyContainer}>
        <CreatePostModal visible={visible} setVisible={setVisible} loadData={loadData} />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>{setStoryImages([{uri:item.image}]); setShowStory(true)}}
          style={styles.avatarContainer}
        >
          <Image
            source={{uri:item.image}}
            style={styles.avatar}
            resizeMode={"cover"}
          />
        </TouchableOpacity>
        <Text style={styles.name}>{item?.name}</Text>
      </View>
    );
  };
  const renderPost = ({ item }) => {
    if (item?.postType == "MAP") {
      return (
        <Post
          description={item.description}
          name={item?.name}
          postType={"MAP"}
          spoilTypes={spoilTypes}
        />
      );
    } else {
      return <Post spoilTypes={spoilTypes} createdAt={item?.createdAt} userData={item?.userData} dataType={item?.dataType} postType={item?.postType} image={item.image} description={item.description} name={item?.name} />;
    }
  };
  const renderEmpty = ({ item }) => {
    return (
      <View style={styles.empty}>
        {pageLoading ?
        
      <ActivityIndicator color={'black'}  />:
      <Text style={styles.emptyText}>No posts available</Text>

      }
      </View>
    );
  };
  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <HomeHeader onPlusCircle={() => setVisible(!visible)}  />
        {stories.length>0 ?<FlatList
          horizontal
          data={stories}
          style={styles.flatlist}
          renderItem={renderStoryAvatar}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />:null
        }
        <FlatList
          data={posts.sort((a,b)=>new Date(a.createdAt) - new Date(b.createdAt))}
          style={styles.flatlist2}
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

      <ImageView
        images={storyImages}
        imageIndex={0}
        visible={showStory}
        onRequestClose={() => setShowStory(false)}
      />
      
    </ScreenWrapper>
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
    borderColor: Colors.green,
    height: height(7),
    width: height(7),
    borderRadius: height(3.5),
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    height: height(6),
    width: height(6),
    borderRadius: height(3.5),
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
