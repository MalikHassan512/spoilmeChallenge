import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAllSpoilTypes } from '../../firebase/firestore/spoils';
import { LoadingImage } from '../Common/LoadingImage';
import { MyTextField } from '../Common/MyTextField';
import { MyText } from '../Common/MyText';
import { sendMessage } from '../../firebase/firestore/chats';
import { checkUserRelationships,updateRelationStatus } from '../../firebase/firestore/relationships';
import Modal from 'react-native-modal';

export const ChatFooter = ({ userId, relatedUserId }) => {
  const [spoilTypes, setSpoilTypes] = useState([]);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpoilType, setSelectedSpoilType] = useState(null);
  useEffect(() => {
    getAllSpoilTypes()
      .then(spoilTypes => setSpoilTypes(spoilTypes))
      .catch(e => {
        console.log(e);
        alert('Error occured. Try again');
      });
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSpoilPress = spoilType => {
    setSelectedSpoilType(spoilType);
    setModalVisible(true);
  };

  const handleSend = async () => {
    try {
      setMessage('');
      closeModal();
      const messageData=await sendMessage(userId, relatedUserId, selectedSpoilType, message);
      const flag=await checkUserRelationships(userId.id,relatedUserId.id)
      updateRelationStatus(flag,messageData)
    } catch (error) {
      console.log(e);
      alert('Error occured. Please try again');
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'flex-end',
      }}
      style={styles.spoilsContainer}
      horizontal
      showsHorizontalScrollIndicator={false}>
      {spoilTypes.map((spoilType, i) => (
        <TouchableOpacity key={i} onPress={() => handleSpoilPress(spoilType)}>
          <LoadingImage source={{ uri: spoilType.image }} style={styles.spoil} />
        </TouchableOpacity>
      ))}
      <Modal
        isVisible={modalVisible}
        onBackButtonPress={closeModal}
        onBackdropPress={closeModal}>
        <View style={styles.modal}>
          <MyTextField
            label="Type a message"
            value={message}
            onChangeText={text => setMessage(text)}
          />

          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <MyText text="Send Message with" textAlign="center" />
            <LoadingImage
              style={{
                height: 50,
                width: 50,
                marginLeft: 10,
              }}
              source={{ uri: selectedSpoilType?.image }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  spoilsContainer: {
    padding: 15,
    backgroundColor: 'white',
    elevation: 15,
  },
  spoil: {
    height: 80,
    width: 80,
    marginRight: 20,
  },
  modal: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    height: 150,
  },
  sendBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
