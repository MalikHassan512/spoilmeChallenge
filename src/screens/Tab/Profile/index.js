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
import { moderateScale, scale, ScaledSheet, verticalScale } from "react-native-size-matters";
import images from "../../../assets/images";
import colors from "../../../util/colors";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";

import PopupModal from "../../../components/Common/PopupModal";
import {getUser } from "../../../firebase/firestore/users";
import {getUserRelationships} from '../../../firebase/firestore/relationships'
import {useSelector} from 'react-redux'
import { height, width } from "react-native-dimension";
import Colors from "util/colors";
import HomeHeader from 'components/HomeHeader'
import {getProfilePosts } from "../../../firebase/firestore/posts";
import { ActivityIndicator } from "react-native-paper";
import VideoPlayer from 'react-native-video-player';
import CreatePostModal from '../Molecules/CreatePostModal'
import MapModal from "components/Map/MapModal";
import { Loading } from "components/Common/Loading";

export const Profile = ({ navigation,route }) => {
  const otherUserId = route?.params?.userId;
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({})
  const [relation, setRelation] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const id = useSelector(state=>state.user.userId)
  const userId =otherUserId || id;
  const contacts =useSelector((state) => state.user.contactList);
  const [postModal, setPostModal] = useState(false)
  const [authUser, setAuthUser] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };
  const [image, setImage] = useState("")
  useEffect(() => {
    setPosts([])
    getAllData()
    
  }, [userId])
  
  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "blur",
      () => {
        setPosts([])
        setLoading(true)
        navigation.setParams({userId:undefined})    
      },
      [navigation]
    );
   return unsubscribe
  },[]);

 
  
  const getAllData =async ()=>{
    try {
      setLoading(true)
      const relation=await getUserRelationships(userId)
      setRelation(relation)
      const userData= await getUser(userId)
      setUser(userData)
      if(otherUserId && otherUserId!=id){
       const authUserData= await getUser(id)
       setAuthUser(authUserData)
       
      }else{
        setAuthUser(userData)
      }
      setImage(userData?.profilePic)
       await loadData()
    } catch (error) {
      console.log('profile error',error)
      setRefreshing(false)
      setLoading(false)
    }
   
   
  }
  const loadData = async () => {
    const postData = await getProfilePosts(userId)
    setPosts(postData);
    setLoading(false)
    setRefreshing(false)
  };
  return (
  
    loading ?
    <View style={{flex:1}}>
    <Loading  />
    </View>:
    <>
    <HomeHeader hideIcon={otherUserId ? otherUserId != id : false} onPlusCircle={()=>setPostModal(true)} renderFirst={<TouchableOpacity
        onPress={() => otherUserId ? otherUserId != id ? navigation.goBack() : setShowModal(true):setShowModal(true)}
        style={[styles.headTextCont, otherUserId ? otherUserId != id  ?  {flexDirection:'row-reverse',alignItems:'center'}:{}:{}]}
      >

        <CustomText label={user?.email?.split("@")?.[0]} textStyle={styles.headerText} />
       {otherUserId ? otherUserId != id ? <Ionicons name="arrow-back" style={{marginRight:5}} color="#000" size={moderateScale(19)} /> :
        <Entypo name={"chevron-down"} style={styles.headerTextIcon} />: <Entypo name={"chevron-down"} style={styles.headerTextIcon} />}
      </TouchableOpacity>} />
  <CreatePostModal visible={postModal} setVisible={setPostModal} loadData={loadData} />
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
          <TouchableOpacity onPress={()=>navigation.navigate("Relations",{relation:relation,userId})} activeOpacity={0.8} style={{alignItems:'center'}}>
            <CustomText  fontWeight={'bold'} label={relation?.length || 0} fontSize={18}  />
            <CustomText marginTop={2}  label={'Relations'}   />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate("Posts",{posts:posts,itemIndex:0,userId})} style={{alignItems:'center'}}>
            <CustomText  fontWeight={'bold'} label={posts?.length || 0} fontSize={18}  />
            <CustomText marginTop={2}  label={'Posts'}   />
          </TouchableOpacity>
          {otherUserId ? otherUserId != id ? <View />:<View />: <TouchableOpacity activeOpacity={0.8} onPress={()=>navigation.navigate('Contacts',{userId})}  style={{alignItems:'center'}}>
          <CustomText  fontWeight={'bold'} label={contacts?.length || 0} fontSize={18}  />
          <CustomText marginTop={2}  label={'Friends'}   />
        </TouchableOpacity>}
    </View>
    <CustomText textStyle={{textTransform:'capitalize'}} fontWeight={'bold'} fontSize={13} label={(user?.firstName || "")  + " " + (user?.lastName || "")} />
  {otherUserId ?otherUserId != id  ?<View style={{flexDirection:'row',justifyContent:'space-between'}}>
    <CustomText onPress={()=>setModalVisible(true)} color={'#fff'} alignSelf={'center'} label="Spoil" container={styles.btn} />
    <CustomText color={'#000'} alignSelf={'center'} label="Relation" container={[styles.btn,{backgroundColor:'#fff',borderColor:'grey',borderWidth:1}]} />
    <CustomText onPress={()=>navigation.navigate('Chat', {
                      user:authUser,
                      relatedUser:user,
                      relationId:-1,
                      userId
                    })}  color={'#000'} alignSelf={'center'} label="Message" container={[styles.btn,{backgroundColor:'#fff',borderColor:'grey',borderWidth:1}]} />
  </View>: null:
    <CustomText onPress={()=>navigation.navigate('Setting')} alignSelf={'center'} container={styles.editProfile} fontWeight={'bold'} label="Edit Profile" />
  }
    </View>
   
      
       {loading ? <Loading  />: <FlatList
        data={posts}
        nestedScrollEnabled
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        numColumns={3}
          renderItem={({item,index}) => {
            return(
              <>
              <TouchableOpacity onPress={()=>navigation.navigate("Posts",{posts:posts,itemIndex:index,userId})} style={styles.imageContainer}>
                {item?.dataType=='video' ?
                 <VideoPlayer video={{uri:item.image}} style={styles.image} /> :
                 <Image style={styles.image} source={{uri:item.image}} />
              }
               
               
              </TouchableOpacity>
              
              </>
            ) 
          }}
        />}
        <View style={{height:verticalScale(40)}} />
    {showModal && (
      <PopupModal
        onPress={() => setShowModal(false)}
        bgPress={() => setShowModal(false)}
        visible={true}
      />
    )}
    {authUser && (
        <MapModal
          userId={id}
          user={authUser}
          relatedUser={user}
          closeModal={closeModal}
          modalVisible={modalVisible}
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
  },
  btn:{
    backgroundColor: "#C71F1E",
    width:'32%',
    height:'30@vs',
    borderRadius: "6@ms",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20@vs",

  },
  editProfile:{
    margin:'10@s',
    padding:'7@s',
    borderColor:colors.borderColor,
    borderWidth: 1,
    borderRadius:5,
  }
});
