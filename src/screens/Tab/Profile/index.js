import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image
} from "react-native";
import React, { useState,useEffect } from "react";
import CustomText from "../../../components/CustomText";
import { scale, ScaledSheet, verticalScale } from "react-native-size-matters";
import images from "../../../assets/images";
import colors from "../../../util/colors";
import Entypo from "react-native-vector-icons/Entypo";
import SocialIconWithText from "../../../components/Common/SocialIconWithText";
import PopupModal from "../../../components/Common/PopupModal";
// import Post from "./Molecules/Post";
import {getUser } from "../../../firebase/firestore/users";
import {getUserRelationships} from '../../../firebase/firestore/relationships'
import {useSelector} from 'react-redux'
import UploadPhoto from "components/UploadPhoto";
import Post from "components/Post";
import { height, width } from "react-native-dimension";
import Colors from "util/colors";
import HomeHeader from 'components/HomeHeader'
import moment from 'moment'
import { getAllOfCollection } from "../../../firebase/HelperFunctions/HelperFunctions";
import { getPosts } from "../../../firebase/firestore/posts";
import { ActivityIndicator } from "react-native-paper";
import VideoPlayer from 'react-native-video-player';

export const Profile = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({})
  const [relation, setRelation] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const userId = useSelector(state=>state.user.userId);
  const contacts = useSelector((state) => state.user.contactList);
 
  
  const [image, setImage] = useState("")
  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      "focus",
      () => {
        getAllData()
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      },
      [navigation]
    );
   
  });
 
  
  const getAllData =async ()=>{
    try {
      setLoading(true)

      loadData()
      const relation=await getUserRelationships(userId)
      setRelation(relation)
      const userData= await getUser(userId)
      setUser(userData)
      setImage(userData?.profilePic)
      setLoading(false)
      setRefreshing(false)
    } catch (error) {
      console.log('profile error',error)
      setRefreshing(false)
      setLoading(false)


    }
   
   
  }
  const loadData = async () => {
    const postData = await getPosts()
    let posts = [];
    postData.map(post=>{
      if(post.type=="Post" && post.userId == userId){
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
    })
    setPosts(posts);
  };
  if(loading){
    return <View style={{marginTop:40}}> 
    <ActivityIndicator color="black"  />

    </View>
    
  }
  return (
    <>
      <HomeHeader renderFirst={<TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.headTextCont}
        >
          <CustomText label={user?.email?.split("@")?.[0]} textStyle={styles.headerText} />
          <View>
            <Entypo name="chevron-down" style={styles.headerTextIcon} />
          </View>
        </TouchableOpacity>} />
    
    <ScrollView  refreshControl={
      <RefreshControl refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        getAllData();
      }} />
    } style={styles.mainContainer}>
      <View style={{padding:scale(20)}}>
      <View style={styles.profileContainer}>
            <Image style={styles.logoContainer} source={image ?{uri:image} : images.placeholder} />
            <View style={{alignItems:'center'}}>
              <CustomText  fontWeight={'bold'} label={relation?.length || 0} fontSize={18}  />
              <CustomText marginTop={2}  label={'Relations'}   />
            </View>
            <View style={{alignItems:'center'}}>
              <CustomText  fontWeight={'bold'} label={posts?.length || 0} fontSize={18}  />
              <CustomText marginTop={2}  label={'Posts'}   />
            </View>
            <View style={{alignItems:'center'}}>
              <CustomText  fontWeight={'bold'} label={contacts?.length || 0} fontSize={18}  />
              <CustomText marginTop={2}  label={'Friends'}   />
            </View>
      </View>
      <CustomText fontWeight={'bold'} fontSize={13} label={(user?.firstName || "")  + " " + (user?.lastName || "")} />
      <CustomText label={"Marketing and PR specialist"} />
      </View>
      {/* <UploadPhoto
          image={image}
          handleChange={(res) => setImage(res)}
          iconColor={"white"}
          imageContainer={styles.logoContainer}
          placeholder={images.placeholder}
          iconStyle={{ backgroundColor: colors.primary }}
        />
      <CustomText label={user?.firstName + " " + moment().diff(moment(user?.dob), 'years')} textStyle={styles.harryText} />
      
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Relations",{relation})}
          style={styles.relationContainer}
        >
          <CustomText textStyle={styles.text55} label={relation?.length || 0} />
          <CustomText textStyle={styles.relationText} label="Relationships" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Contacts")}
          style={styles.relationContainer}
        >
          <CustomText textStyle={styles.text55} label={contacts?.length || 0 } />
          <CustomText textStyle={styles.relationText} label="Contacts" />
        </TouchableOpacity>
      </View> */}
      {showModal ? null : (
        <>
        
          <FlatList
          data={posts}
          nestedScrollEnabled
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          numColumns={3}
            renderItem={({item,index}) => {
              // return <Post  createdAt={item?.createdAt} userData={item?.userData} dataType={item?.dataType} postType={item?.postType} image={item.image} description={item.description} name={item?.name} />;
              return(
                <>
                <TouchableOpacity onPress={()=>navigation.navigate("Posts",{posts:posts,itemIndex:index})} style={styles.imageContainer}>
                  {item?.dataType=='video' ?
                   <VideoPlayer video={{uri:item.image}} style={styles.image} /> :
                   <Image style={styles.image} source={{uri:item.image}} />
                }
                 
                 
                </TouchableOpacity>
                
                </>
              ) 
            }}
          />
          <View style={{height:verticalScale(40)}} />
        </>
      )}
      {showModal && (
        <PopupModal
          onPress={() => setShowModal(false)}
          bgPress={() => setShowModal(false)}
          visible={true}
        />
      )}
    </ScrollView>
    </>

  );
};
const renderEmpty = () => {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No posts available</Text>
    </View>
  );
};
const styles = ScaledSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
  },
  profileContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginRight:'10@s',
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "15@vs",
  },
  empty: {
    height: height(20),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Colors.black,
    fontWeight: "bold",
    fontSize: width(4),
  },
  logoContainer: {
    width: "70@s",
    height: "70@s",
    borderRadius: "130@s",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
    marginBottom: "10@vs",
   
  },
  headTextCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: "16@ms",
    color: colors.black,
    fontWeight: "500",
  },
  headerTextIcon: {
    fontSize: "16@ms",
    color: colors.primary,
    marginLeft: "5@s",
  },
  headerIcon: {
    width: "20@ms",
    height: "20@ms",
    resizeMode: "contain",
  },
  profile: {
    width: "100@ms",
    height: "100@ms",
    backgroundColor: "#E3E5E8",
    borderRadius: "100@ms",
    alignSelf: "center",
    marginTop: "10@vs",
    justifyContent: "flex-end",
    marginBottom: "15@s",
  },
  profileIconContainer: {
    width: "30@ms",
    height: "30@ms",
    borderRadius: "100@ms",
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  profileIcon: {
    width: "18@ms",
    height: "14@ms",
    resizeMode: "contain",
  },
  harryText: {
    fontSize: "24@ms",
    alignSelf: "center",
    fontWeight: "500",
    color: colors.black,
    marginBottom: "20@s",
  },
  marketingText: {
    fontSize: "16@ms",
    alignSelf: "center",
    color: colors.text,
    letterSpacing: 1,
    marginBottom: "25@vs",
  },
  relationContainer: {
    width: "47%",
    height: "65@vs",
    backgroundColor: colors.primary,
    borderRadius: "15@ms",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20@vs",
  },
  text55: {
    fontSize: "20@ms",
    color: colors.white,
    marginBottom: "5@vs",
    fontWeight: "bold",
  },
  relationText: {
    fontSize: "16@ms",
    color: colors.white,
  },
  image:{
    width:width(30),
    height:'100@s',
    borderRadius:5,
  },
  imageContainer:{
    marginTop:'5@vs',
    marginHorizontal:width(1.3)
  }
});
