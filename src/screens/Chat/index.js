import {View, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ChatHeader} from '../../components/Chat/ChatHeader';
import {ChatBody} from '../../components/Chat/ChatBody';
import {Loading} from '../../components/Common/Loading';
import {getUser} from '../../firebase/firestore/users';
import {ChatFooter} from '../../components/Chat/ChatFooter';

export const Chat = ({navigation, route}) => {
  
  const {user, relatedUser,relationId} = route?.params
  const userIdProps=route?.params?.userId;

  
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <ChatHeader userIdProps={userIdProps} relatedUser={relatedUser} navigation={navigation} />
        <ChatBody relationId={relationId} userId={user.id} relatedUserId={relatedUser.id} />
        <ChatFooter userId={user} relatedUserId={relatedUser} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
