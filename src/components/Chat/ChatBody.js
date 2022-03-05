import {StyleSheet, View, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {getMessages} from '../../firebase/firestore/chats';
import {LoadingImage} from '../Common/LoadingImage';
import {MyText} from '../Common/MyText';
import Images from 'assets/images';
import moment from 'moment';
import ChatButton from './ChatButton';
export const ChatBody = ({userId, relatedUserId}) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const messageSubscriber = getMessages(userId, relatedUserId, setMessages);

    return () => messageSubscriber();
  }, [userId, relatedUserId]);

  const renderMessages = ({index, item: message}) => {
    const isUser = message.from === userId;
    return (
      <View key={index} style={{padding: 5}}>
        <View
          style={{alignSelf: isUser ? 'flex-end' : 'flex-start', width: '60%'}}>
          <View
            style={[
              styles.message,

              isUser && {
                backgroundColor: 'white',
                borderColor: '#E8E8E8',
                borderWidth: 2,
              },
            ]}>
            <MyText text={message.text} />
           {/* {!isUser && <View style={{flexDirection: 'row',}}>
              <ChatButton text="Approve" />
              <ChatButton text="Decline" />
            </View> } */}
          </View>
          <MyText
            textStyle={isUser && {alignSelf: 'flex-end'}}
            text={`${isUser ? 'Sent on' : 'Received on'}  ${moment(
              message.date,
            ).format('M.D.YY hh:MM')}`}
          />
          <LoadingImage
            source={{uri: message.spoil.image}}
            style={[
              styles.messageSpoil,
              isUser && {alignSelf: 'flex-start', left: -15},
            ]}
          />
        </View>
      </View>
    );
  };
  return (
    <FlatList
      data={messages}
      renderItem={renderMessages}
      style={styles.chat}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  chat: {
    padding: 15,
    height: '75%',
  },
  message: {
    backgroundColor: '#F3F3F3',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageSpoil: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
    top: -30,
    right: -15,
  },
});
