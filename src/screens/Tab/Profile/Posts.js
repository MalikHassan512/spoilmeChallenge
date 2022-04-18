import { StyleSheet, Text, View,FlatList } from 'react-native'
import React from 'react'
import Header from "./Molecules/Header";
import {height} from 'react-native-dimension'
import Post from "components/Post";

const Posts = ({route}) => {
    const {posts,itemIndex}=route?.params
    const renderEmpty = ({ item }) => {
        return (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No posts available</Text>
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
          return <Post  createdAt={item?.createdAt} userData={item?.userData} dataType={item?.dataType} postType={item?.postType} image={item.image} description={item.description} name={item?.name} />;
        }
      };
  return (
    <View style={styles.container}>
        <Header label={"Posts"} />
        <FlatList
          data={posts || []}
          initialScrollIndex={itemIndex}
          style={styles.flatlist2}
          contentContainerStyle={{ paddingBottom: height(2) }}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
    </View>
  )
}

export default Posts

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:10
    }
})