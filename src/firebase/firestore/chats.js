import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {addSpoilData} from './spoils';

export const sendMessage = async (from, to, spoil, text,spoilStatus=0) => {
  const id = from > to ? (from+"__"+to+"__" +uuid.v4()) : (to+"__"+from+"__" +uuid.v4());
  const message={
    id,
    from,
    to,
    spoil,
    text,
    spoilStatus,
    date: firestore.Timestamp.now(),
  }
  await firestore().doc(`chats/${id}`).set(message,{merge:true});
  addSpoilData(spoil.name, spoil.image, from, to,id);
  return {id,spoilStatus,text,from,to}
};

export const getMessages = (user1, user2, setMessages) => {
  const id = user1 > user2 ? (user1+"__"+user2+"__") : (user2+"__"+user1+"__");
  return firestore()
    .collection(`chats`)
    .orderBy('id')
    .startAt(id)
    .endAt(id + '~')
    .onSnapshot(chatsSnapshot => {
      const messages = [];
      chatsSnapshot?.forEach(chatSnapshot => {
        const message = chatSnapshot.data();
        console.log("message",message)
        // if ( (message.to.id == user1 && message.from.id == user2) || (message.to.id === user2 && message.from.id === user1) )
          messages.push(message);
      });
      setMessages(messages.sort((a,b)=>a?.date?.seconds-b?.date?.seconds || 0));
    });
};
export const updateSpoilStatus =async(id,status)=>{
  try {
    await firestore().doc(`chats/${id}`).set({spoilStatus:status},{merge:true});
  } catch (error) {
    console.log("updateSpoilStatus", error)
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
