import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {addSpoilData} from './spoils';

export const sendMessage = async (from, to, spoil, text,spoilStatus=0) => {
  const id = uuid.v4();
  const message={
    id,
    from,
    to,
    spoil,
    text,
    spoilStatus,
    date: firestore.Timestamp.now(),
    read: false,
  }
  await firestore().doc(`chats/${id}`).set(message,{merge:true});
  addSpoilData(spoil.name, spoil.image, from, to,id);
  return {id,spoilStatus,text,from:from.id,to:to.id}
};

export const getMessages = (user1, user2, setMessages) => {
  return firestore()
    .collection(`chats`)
    .orderBy('date', 'asc')
    .onSnapshot(chatsSnapshot => {
      const messages = [];
      chatsSnapshot.forEach(chatSnapshot => {
        const message = chatSnapshot.data();
        if ( (message.to.id == user1 && message.from.id == user2) || (message.to.id === user2 && message.from.id === user1) )
          messages.push(message);
      });
      setMessages(messages);
    });
};
export const updateSpoilStatus =async(message,status)=>{
  try {
    await firestore().doc(`chats/${message.id}`).update({...message,spoilStatus:status});
  } catch (error) {
    
  }
}
export const getMessageById=(id)=>{
  return firestore().doc(`chats/${id}`).get()
}
export const getLastMessages = (
  user1,
  user2,
  index,
  lastMessages,
  setLastMessage,
) => {
  return firestore()
    .collection(`chats`)
    // .where('from', 'in', [user1, user2])
    .orderBy('date', 'asc')
    .onSnapshot(chatsSnapshot => {
      const messages = [];
      chatsSnapshot.forEach(chatSnapshot => {
        const message = chatSnapshot.data();
        if ( (message.to === user1 || message.from === user2) ||  (message.to === user2 || message.from === user1))
          messages.push(message);
      });
      const tempLastMessages = [...lastMessages];
      tempLastMessages[index] = messages[messages.length - 1];
      setLastMessage(tempLastMessages);
    });
};
