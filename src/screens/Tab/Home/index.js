/* eslint-disable react-native/no-inline-styles */
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import { scale, ScaledSheet, verticalScale } from "react-native-size-matters";
import React, { useEffect, useState } from "react";
//components
import Logo from "components/Logo";
//icons
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//Molecules
import Colors from "util/colors";
import CustomText from "../../../components/CustomText";
import defualtImage from "../../../assets/images/defaultImage.jpg";
import { height, width } from "react-native-dimension";
import Post from "../../../components/Post";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { getAllOfCollection } from "../../../firebase/HelperFunctions/HelperFunctions";
import { getUser } from "../../../firebase/firestore/users";
import moment from "moment";
import ImageView from "react-native-image-viewing";
import auth from "@react-native-firebase/auth";
import CustomModal from "../../../components/CustomModal";
import VideoPlayer from 'react-native-video-player'
import colors from "../../../util/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import UploadPhoto from "components/UploadPhoto";
import {
  uploadProfilePic,
  uploadVideo
} from "../../../firebase/storage/profilPic";
import {
  createPost,
} from "../../../firebase/firestore/posts";
import { getAllSpoilTypes } from "../../../firebase/firestore/spoils";
import RadioButtonRN from 'radio-buttons-react-native'
import HomeHeader from 'components/HomeHeader';
import {uploadImage} from '../../../firebase/HelperFunctions/HelperFunctions'
const Home = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const userId = useSelector((state) => state.user.userId);
  const [loading, setLoading] = useState(false)
  const onSubmit = async()=>{
    try {
      setLoading(true)
      const userData= await getUser(userId)
      const data={
        userId,
        userData,
        type,
        title,
        dataType: image.type.includes('video') ?'video' : 'image',
      }
      data.image=await uploadImage(image.uri,userId)
      // if(!image.type.includes('video')){
      //   data.image = await uploadProfilePic(image, userId,"posts");
      // }else{
      //   data.image = await uploadVideo(image, userId,);
      // }
      
        await createPost(data)
      setLoading(false)
      setType("")
      setTitle("")
      setImage("")
      setVisible(false)

    } catch (error) {
      console.log("error line 63 onSubmit",error)
      setLoading(false)
      setVisible(false)
    }
  
  }
  const data = [
    {
      label: "Story",
    },
    {
      label: "Post",
    },
  ];

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
    const users = await getAllOfCollection("users");
    const postData = await getAllOfCollection("posts");
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
      if(!moment(post.createdAt).fromNow().includes('day')){
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
    // posts.push({
    //   id:5435435,
    //   description:'My Videos',
    //   postType:'Post',
    //   image:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    //   dataType:'video',
    // })
    posts.push({ postType: "MAP" });
    setPosts(posts);
    setRefreshing(false);
  };
  const renderStoryAvatar = ({ item }) => {
    return (
      <View style={styles.storyContainer}>
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
        <Text style={styles.emptyText}>No posts available</Text>
      </View>
    );
  };
  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <HomeHeader onPlusCircle={() => setVisible(!visible)}  />
        <FlatList
          horizontal
          data={stories}
          style={styles.flatlist}
          renderItem={renderStoryAvatar}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
        
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
      <CustomModal isModalVisible={visible} setModalVisible={()=>{
        setVisible(false)
        setType("")
        setTitle("")
        setImage("")
      }}>
        <View style={styles.modalContainer}>
          <CustomText label="Create Post" textStyle={styles.CreatePostTitle} />
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder="What's on your mind"
              multiline={true}
              value={title}
              placeholderTextColor={colors.darkGrey}
              style={[styles.textInput,{maxHeight:verticalScale(30)}]}
              onChangeText={(value) => setTitle(value)}
            />
          </View>
          <View style={{ width: "90%", alignSelf: "center" }}>
            <RadioButtonRN
              data={data}
              style={{ height: 50 }}
              selectedBtn={(e) => setType(e.label)}
              icon={<Icon name="check-circle" size={25} color="#2c9dd1" />}
            />
          </View>
          <View style={{ flex: 1 }} />
          {image ? (
            <View>
              {image.type.includes('video') ?
              <VideoPlayer videoWidth={scale(200)} videoHeight={verticalScale(200)} video={image} />:
              <Image source={image} style={styles.image} />}
            </View>
          ) : (
            <View />
          )}

          
          <View>
           {!image ?<UploadPhoto
          handleChange={(res) => setImage(res)}
          renderButton={(handleChange)=><TouchableOpacity
            activeOpacity={0.6}
            onPress={handleChange}
          >
            <CustomText
              label="Upload"
              container={styles.uploadImageContainer}
              textStyle={styles.uploadimageText}
            />
          </TouchableOpacity>}
          />
         :
         <TouchableOpacity
         activeOpacity={0.6}
         onPress={onSubmit}
       >
        <CustomText
           label={loading ? <ActivityIndicator color={'white'} size="small" /> :"Create"}
           container={styles.uploadImageContainer}
           textStyle={styles.uploadimageText}
        />
       
        
       </TouchableOpacity>
        }
        
        </View>
        </View>
      </CustomModal>
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
  CreatePostTitle: {
    fontSize: "18@ms",
    fontWeight: "700",
    color: colors.black,
    alignSelf: "center",
    marginTop: "10@s",
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
  modalContainer: {
    backgroundColor: colors.white,
    width: "90%",
    height: "90%",
    alignSelf: "center",
    borderRadius: "10@s",
  },
  textInputContainer: {
    borderColor: colors.primary,
    borderWidth: "1@s",
    width: "90%",
    alignSelf: "center",
    marginVertical: "10@s",
    borderRadius: "5@s",
  },
  textInput: {
    fontSize: "12@ms",
    color: colors.darkGrey,
    fontWeight: "600",
  },
  uploadImageContainer: {
    alignSelf: "center",
    padding: "10@s",
    backgroundColor: colors.primary,
    borderRadius: "25@s",
    width: "45%",
    alignItems: "center",
    marginVertical: "10@s",
  },
  uploadimageText: {
    color: colors.white,
    fontSize: "12@ms",
  },
  image: {
    width: "200@s",
    height: "250@vs",
    alignSelf: "center",
    resizeMode: "cover",
  },
});
