import React, { useState,useRef } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View, FlatList } from 'react-native';
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

import VideoPlayer from 'react-native-video-player';
import moment from 'moment';
import {
    createRelationship,
    checkUserRelationships,
    updateRelationStatus,
  } from "../../firebase/firestore/relationships";
import { sendMessage } from "../../firebase/firestore/chats";
import { useSelector } from 'react-redux';
import CustomText from '../CustomText';

const Post = ({
    description = `Its Maria's birthday today! Spoil her!`,
    postType = 'SPOIL',
    name = 'Maria Pablos',
    image,
    userData,
    dataType,
    createdAt,
    spoilTypes
}) => {
    const videoRef = useRef(null)
  const [loadingId, setLoadingId] = useState(-1);
  const userId= useSelector(state=>state.user.userId)
  const handleSpoilPress = async (spoilType) => {
    setLoadingId(spoilType.name)
    const user= await getUser(userId)
    const relationStatus = await checkUserRelationships(userId, userData.id);
    let messages = {};
    if (!relationStatus) {
      messages = await sendMessage(
        user,
        userData,
        spoilType,
        `Here’s a ${spoilType.name}, enjoy!`,
        0
      );
      // console.log("messages", messages);
      await createRelationship(
        user,
        userData,
        `Here’s a ${spoilType.name}, enjoy!`,
        0,
        messages
      );
      // console.log("relation created");
    } else {
      messages = await sendMessage(
        user,
        userData,
        spoilType,
        `Here’s a ${spoilType.name}, enjoy!`,
        0
      );
      await updateRelationStatus(relationStatus, messages);
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
            <View style={styles.userInfo}>
                <Image source={userData?.profilePic?{uri:userData?.profilePic}:defualtImage} style={styles.avatar} />
                <View style={styles.info}>
                    <Text style={styles.name}>{(userData?.firstName || "Name")+" "+(userData?.lastName|| "")}</Text>
                    <Text style={styles.time}>{createdAt ? fromNow(createdAt):moment().fromNow()}</Text>
                </View>
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
