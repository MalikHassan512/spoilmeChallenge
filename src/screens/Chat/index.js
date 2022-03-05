import {View, StyleSheet, Pressable, ScrollView, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ChatHeader} from '../../components/Chat/ChatHeader';
import {ChatBody} from '../../components/Chat/ChatBody';
import {Loading} from '../../components/Common/Loading';
import {getUser} from '../../firebase/firestore/users';
import {ChatFooter} from '../../components/Chat/ChatFooter';

export const Chat = ({navigation, route}) => {
  
  const {userId, relatedUserId} = route?.params
  const [relatedUser, setRelatedUser] = useState(null);

  useEffect(() => {
    getUser(relatedUserId)
      .then(user => setRelatedUser(user))
      .catch(e => {
        console.log(e);
        alert('Error occured. Try again');
      });
  }, [relatedUserId]);
  return !relatedUser ? (
    <Loading />
  ) : (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <ChatHeader relatedUser={relatedUser} navigation={navigation} />
        <ChatBody userId={userId} relatedUserId={relatedUserId} />
        <ChatFooter userId={userId} relatedUserId={relatedUserId} />
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
