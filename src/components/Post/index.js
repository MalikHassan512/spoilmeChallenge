import React, { useState,useRef,useEffect } from 'react';
import { Image, Text, TouchableOpacity, View, FlatList } from 'react-native';
import SimpleToast from "react-native-simple-toast";
import styles from './styles';
import { height, width } from 'react-native-dimension'
import defualtImage from '../../assets/images/defaultImage.jpg'
import { LoadingImage } from "../Common/LoadingImage";
import mapDummy from '../../assets/images/mapDummy.png'
import * as Progress from "react-native-progress";
import colors from "../../util/colors";
import {fromNow} from "../../util/helper";
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import { getUser } from "../../firebase/firestore/users";
import Entypo from 'react-native-vector-icons/Entypo'
import VideoPlayer from 'react-native-video-player';
import moment from 'moment';
import {
    createRelationship,
    checkUserRelationships,
    updateLastMessage,
  } from "../../firebase/firestore/relationships";
import { sendMessage } from "../../firebase/firestore/chats";
import { useSelector } from 'react-redux';
import CustomText from '../CustomText';
import { moderateScale } from 'react-native-size-matters';
import PostOptionModal from '../Common/PostOptionModal'
import { useNavigation } from '@react-navigation/native';
const Post = ({
    description = `Its Maria's birthday today! Spoil her!`,
    postType = 'SPOIL',
    image,
    userDetail,
    dataType,
    createdAt,
    spoilTypes,
    postUserId,
    isMyPosts,
    postId
}) => {
  const navigation=useNavigation()
  const videoRef = useRef(null)
  const [loadingId, setLoadingId] = useState(-1);
  const [visible, setVisible] = useState(false)
  const userId= useSelector(state=>state.user.userId)
  const [userData, setUserData] = useState(userDetail || {})

  useEffect(() => {
    (async function() {
      if(postUserId){
        const response= await getUser(postUserId)
        setUserData(response)
      }
    })()
  }, [])
  
  const handleSpoilPress = async (spoilType) => {
    setLoadingId(spoilType.name)
    const relationStatus = await checkUserRelationships(userId, userData.id);
    let messages = {};
    if (!relationStatus) {
      messages = await sendMessage(
        userId,
        userData.id,
        spoilType,
        `Here’s a ${spoilType.name}, enjoy!`,
        0
      );
      // console.log("messages", messages);
      await createRelationship(
        userId,
        userData.id,
        `Here’s a ${spoilType.name}, enjoy!`,
        0,
        messages
      );
      // console.log("relation created");
    } else {
      messages = await sendMessage(
        userId,
        userData.id,
        spoilType,
        `Here’s a ${spoilType.name}, enjoy!`,
        0
      );
      await updateLastMessage(userId,userData.id, messages);
      // console.log("relation already exist");
    }
    setLoadingId("")
    SimpleToast.show("Spoil sent")
    // alert("Spoil sent");
  };
    const renderItems = ({ item:spoilType,index:i }) => {
        return (
            <TouchableOpacity
                  onPress={() => handleSpoilPress(spoilType)}
                  key={i}
                  style={styles.spoilTypes}
                >
                  {spoilType.name == loadingId ? (
                    <Progress.Circle
                      indeterminate
                      size={65}
                      color={colors.primary}
                      style={{ alignSelf: "center",  }}
                    />
                  ) : (
                    <LoadingImage
                      source={{ uri: spoilType.image }}
                      style={[styles.profilePic, { marginRight: 0 }]}
                    />
                  )}
                </TouchableOpacity>
        )
    }
    return (
        <View styles={styles.container}>
          <PostOptionModal postBy={userData.id} reportBy={userId} postId={postId} visible={visible} setVisible={setVisible} />
            <View style={styles.userInfo}>
              <TouchableOpacity activeOpacity={1} onPress={()=>navigation.navigate('ProfileStack',{screen:'Profile',params:{userId:userData?.id}})} style={{flexDirection:'row',alignItems:'center'}}>
                <Image source={userData?.profilePic?{uri:userData?.profilePic}:defualtImage} style={styles.avatar} />
                <View style={styles.info}>
                    <Text style={styles.name}>{(userData?.firstName || "Name")+" "+(userData?.lastName|| "")}</Text>
                    <Text style={styles.time}>{createdAt ? fromNow(createdAt):moment().fromNow()}</Text>
                </View>
                </TouchableOpacity>
                {userId !=userData?.id &&<TouchableOpacity onPress={()=>setVisible(true)} style={{padding:'2%'}} >
                <Entypo color={'#000'} size={moderateScale(15)} name='dots-three-vertical' />
                </TouchableOpacity>}
            </View>
            <View style={styles.post}>
              <CustomText textStyle={styles.description} label={description}  />
                   {postType == 'Post' ?
                        dataType== 'video' ?
                        <InViewPort onChange={(visible)=>visible?videoRef?.current?.resume(true):videoRef?.current?.pause(true) }>
                        <VideoPlayer ref={videoRef} disableSeek pauseOnPress fullScreenOnLongPress hideControlsOnStart autoplay={true} video={{uri:image}} videoWidth={width(30)} videoHeight={height(10)} />
                        </InViewPort>
                        :<Image source={{uri:image}} style={styles.mapImage} />
                   : 
                    <View>
                        <Image source={mapDummy} style={styles.mapImage} />
                    </View>}
                       {userId !=userData?.id ?
                       <>
                       <FlatList
                            horizontal
                            data={spoilTypes}
                            style={[styles.flatlist,{alignSelf:'center',marginTop:20}]}
                            renderItem={renderItems}
                            keyExtractor={item => item.name}
                        />
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.postBtn}>
                            <Text style={styles.btnText}>Find a Spoil</Text>
                        </TouchableOpacity>
                        </>:null}
            </View>
        </View>
    );
};

export default Post;
