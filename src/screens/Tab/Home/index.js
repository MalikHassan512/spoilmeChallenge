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
import { ScaledSheet, verticalScale } from "react-native-size-matters";
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
import moment from "moment";
import ImageView from "react-native-image-viewing";
import auth from "@react-native-firebase/auth";
import CustomModal from "../../../components/CustomModal";
import colors from "../../../util/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import UploadPhoto from "components/UploadPhoto";
import {
  uploadProfilePic,
} from "../../../firebase/storage/profilPic";
import {
  createPost,
} from "../../../firebase/firestore/posts";
import RadioButtonRN from 'radio-buttons-react-native'
const Home = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const userId = useSelector((state) => state.user.userId);
  const [loading, setLoading] = useState(false)
  const onSubmit = async()=>{
    try {
      setLoading(true)
      const data={
        userId,
        type,
        title,
      }
      data.image = await uploadProfilePic(image, userId,"posts");
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
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    const users = await getAllOfCollection("users");
    const postData = await getAllOfCollection("posts");
    console.log("postsData",postData)
    let posts = [];
    let stories = [];
    postData.map(post=>{
      if(post.type=="Post"){
     posts.push({
       id:post.id,
       description:post.title,
       postType:post.type,
       image:post.image,
     })
    }else{
      stories.push({
        id:post.id,
        description:post.title,
        postType:post.type,
        image:post.image,

      })
    }
    })
    setStories(stories)
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
          });
        }
        if (user?.isHired) {
          posts.push({
            id: user?.id + "HIRED",
            postType: "HIRED",
            description: `${user?.firstName} ${user?.lastName} has been hired recently! Spoil him!`,
            name: `${user?.firstName} ${user?.lastName}`,
          });
        }
        if (user?.isEngaged) {
          posts.push({
            id: user?.id + "ENGAGED",
            postType: "ENGAGED",
            description: `${user?.firstName} ${user?.lastName} has been engaged recently! Spoil him!`,
            name: `${user?.firstName} ${user?.lastName}`,
          });
        }
      }
    });
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
        <Text style={styles.name}>{item?.title}</Text>
      </View>
    );
  };
  const renderPost = ({ item }) => {
    console.log("item",item)
    if (item?.postType == "MAP") {
      return (
        <Post
          description={item.description}
          name={item?.name}
          postType={"MAP"}
        />
      );
    } else {
      return <Post postType={item?.postType} image={item.image} description={item.description} name={item?.name} />;
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
        <View style={styles.headerContainer}>
          <Logo />
          <View style={styles.headerIconContainer}>
            <AntDesign
              color={Colors.darkGrey}
              name="heart"
              style={styles.icon}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setVisible(!visible)}
            >
              <AntDesign
                color={Colors.darkGrey}
                name="pluscircle"
                style={styles.icon}
              />
            </TouchableOpacity>

            <FontAwesome
              color={Colors.darkGrey}
              name="comment"
              style={styles.icon}
            />
          </View>
        </View>

        <FlatList
          horizontal
          data={stories}
          style={styles.flatlist}
          renderItem={renderStoryAvatar}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
        <FlatList
          data={posts}
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
              <Image source={image} style={styles.image} />
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
              label="Upload image"
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
         {!loading ?<CustomText
           label="Create"
           container={styles.uploadImageContainer}
           textStyle={styles.uploadimageText}
        />:
        <ActivityIndicator color={'white'} size="small" />
        }
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
    height: "250@s",
    alignSelf: "center",
    resizeMode: "cover",
  },
});
