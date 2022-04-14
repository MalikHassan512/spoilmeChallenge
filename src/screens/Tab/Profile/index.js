import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from "react-native";
import React, { useState,useEffect } from "react";
import CustomText from "../../../components/CustomText";
import { ScaledSheet, verticalScale } from "react-native-size-matters";
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

import moment from 'moment'
import { getAllOfCollection } from "../../../firebase/HelperFunctions/HelperFunctions";
export const Profile = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({})
  const [relation, setRelation] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([])
  const userId = useSelector(state=>state.user.userId);
  const contacts = useSelector((state) => state.user.contactList);
 
  
  const [image, setImage] = useState("")
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUser(userId)
        .then((user) => {
          setUser(user)
          setImage(user.profilePic)
        })
        .catch((e) => {
          // alert('An error occured.Try again');
          console.log(e);
        });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    loadData()
    getUserRelationships(userId).then((res) => {
      setRelation(res)
    })
    .catch((e) => {
      console.log("relation eorror line 54",e);
    })
  }, [])
  
  const loadData = async () => {
    const postData = await getAllOfCollection("posts")
    let posts = [];
    postData.map(post=>{
      if(post.type=="Post" && post.userId == userId){
     posts.push({
       id:post.id,
       description:post.title,
       postType:post.type,
       image:post.image,
       userData:post.userData,
       createdAt:post.createdAt

     })
    }
    })
    setRefreshing(false);
    setPosts(posts);
  };
  return (
    <ScrollView  refreshControl={
      <RefreshControl refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        loadData();
      }} />
    } style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.headTextCont}
        >
          <CustomText label={user.email} textStyle={styles.headerText} />
          <View>
            <Entypo name="chevron-down" style={styles.headerTextIcon} />
          </View>
        </TouchableOpacity>
        {/* <Image source={images.menu} style={styles.headerIcon} /> */}
      </View>
      <UploadPhoto
          image={image}
          handleChange={(res) => setImage(res)}
          iconColor={"white"}
          imageContainer={styles.logoContainer}
          placeholder={images.placeholder}
          iconStyle={{ backgroundColor: colors.primary }}
        />
      <CustomText label={user.firstName + " " + moment().diff(moment(user.dob), 'years')} textStyle={styles.harryText} />
      {/* <CustomText
        label="Marketing and PR specialist"
        textStyle={styles.marketingText}
      /> */}
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
      </View>
      {showModal ? null : (
        <>
        
          <FlatList
          data={posts}
          nestedScrollEnabled
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          
            renderItem={({item}) => {
              return <Post  createdAt={item?.createdAt} userData={item?.userData} dataType={item?.dataType} postType={item?.postType} image={item.image} description={item.description} name={item?.name} />;
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
    padding: "25@ms",
    backgroundColor: colors.white,
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
    width: "100@s",
    height: "100@s",
    borderRadius: "130@s",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
    marginVertical: "5@vs",
    marginBottom: "10@vs",
    justifyContent: "center",
    alignItems: "center",
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
});
