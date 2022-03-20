/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View, ScrollView, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import React, { useEffect, useState } from 'react';
//components
import Logo from "components/Logo";
import Map from "../../../components/Common/Map";
import TextWithIcon from "../../../components/Common/TextWithIcon";
//icons
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//Molecules
import { Heading, Box, ImagesContainer, OpportunityBox } from './Molecules';
import Images from 'assets/images';
import Colors from 'util/colors';
import CustomText from 'components/CustomText'
import defualtImage from '../../../assets/images/defaultImage.jpg'
import { height, width } from 'react-native-dimension'
import Post from '../../../components/Post';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { getAllOfCollection } from '../../../firebase/HelperFunctions/HelperFunctions'
import moment from 'moment';
import ImageView from "react-native-image-viewing";
import auth from '@react-native-firebase/auth'
const Home = () => {

  const [stories, setStories] = useState([
    {
      id: '1',
      title: 'Your story',
      image: defualtImage
    },
    {
      id: '2',
      title: 'Carla',
      image: defualtImage
    },
    {
      id: '3',
      title: 'Steven',
      image: defualtImage
    },
    {
      id: '4',
      title: 'Terry',
      image: defualtImage
    },
    {
      id: '5',
      title: 'Steven',
      image: defualtImage
    },
    {
      id: '6',
      title: 'Terry',
      image: defualtImage
    },
  ])
  const [storyImages, setStoryImages] = useState([
    {
      uri: "https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      uri: "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      uri: "https://wallpaperaccess.com/full/3678503.png",
    },
  ])
  const [posts, setPosts] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [showStory, setShowStory] = useState(false)
  useEffect(() => {
    loadData()
  }, [])
  const loadData = async () => {
    const users = await getAllOfCollection('users')
    let posts = []
    users.map(user => {
      let dob = new Date(user?.dob?.seconds * 1000)
      let formatedDate = moment(dob).format('DD-MM-YYYY')
      let todaysDate = moment().format('DD-MM-YYYY')
      console.log(user?.id)
      if (user?.id !== auth().currentUser.uid) {
        if (formatedDate == todaysDate) {
          posts.push({
            id: user?.id + 'BIRTHDAY',
            postType: 'BIRTHDAY',
            description: `${user?.firstName} ${user?.lastName} has their birthday today! Spoil him!`,
            name: `${user?.firstName} ${user?.lastName}`
          })
        }
        if (user?.isHired) {
          posts.push({
            id: user?.id + 'HIRED',
            postType: 'HIRED',
            description: `${user?.firstName} ${user?.lastName} has been hired recently! Spoil him!`,
            name: `${user?.firstName} ${user?.lastName}`
          })
        }
        if (user?.isEngaged) {
          console.log(user?.isEngaged, '=======>>>>>>');
          posts.push({
            id: user?.id + 'ENGAGED',
            postType: 'ENGAGED',
            description: `${user?.firstName} ${user?.lastName} has been engaged recently! Spoil him!`,
            name: `${user?.firstName} ${user?.lastName}`
          })
        }
      }
    })
    posts.push({ postType: 'MAP' })
    setPosts(posts)
    setRefreshing(false)
  }
  const renderStoryAvatar = ({ item }) => {
    return (
      <View style={styles.storyContainer}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowStory(true)} style={styles.avatarContainer}>
          <Image source={defualtImage} style={styles.avatar} resizeMode={'cover'} />
        </TouchableOpacity>
        <Text style={styles.name}>{item?.title}</Text>
      </View >
    )
  }
  const renderPost = ({ item }) => {
    if (item?.postType == 'MAP') {
      return (
        <Post description={item.description} name={item?.name} postType={'MAP'} />
      )
    } else {
      return (
        <Post description={item.description} name={item?.name} />
      )
    }
  }
  const renderEmpty = ({ item }) => {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No posts available</Text>
      </View>
    )
  }
  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Logo />
          <View style={styles.headerIconContainer}>
            <AntDesign color={Colors.darkGrey} name="heart" style={styles.icon} />
            <AntDesign color={Colors.darkGrey} name="pluscircle" style={styles.icon} />
            <FontAwesome color={Colors.darkGrey} name="comment" style={styles.icon} />
          </View>
        </View>
        <FlatList
          horizontal
          data={stories}
          style={styles.flatlist}
          renderItem={renderStoryAvatar}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />
        <FlatList
          data={posts}
          style={styles.flatlist2}
          contentContainerStyle={{ paddingBottom: height(2) }}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            setRefreshing(true)
            loadData()
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
    marginStart: '25@vs',
    marginEnd: '27@vs',
    flexDirection: 'column'
  },
  empty: {
    height: height(20),
    width: width(100),
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'baseline'
  },
  icon: {
    fontSize: '23@ms',
    marginStart: '23@ms',
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
    fontWeight: 'bold',
    fontSize: width(4)
  },
  avatarContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.green,
    height: height(7),
    width: height(7),
    borderRadius: height(3.5),
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    height: height(6),
    width: height(6),
    borderRadius: height(3.5),
  },
  name: {
    fontSize: width(2.8),
    color: Colors.black,
    alignSelf: 'center',
    marginTop: height(0.5)
  },
  storyContainer: {
    paddingHorizontal: width(2),
    marginRight: width(1)
  },
  flatlist: {
    marginLeft: width(2),
    marginTop: height(1),
    height: height(14),
    flexGrow: 0

    // backgroundColor: 'yellow'
  },
  flatlist2: {
    // backgroundColor: 'red',
  }
});
