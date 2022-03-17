import {StyleSheet, ScrollView, View, Pressable,Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {LoadingImage} from '../Common/LoadingImage';
import {MyHeading} from '../Common/MyHeading';
import {getAllSpoilTypes} from '../../firebase/firestore/spoils';
import {MyText} from '../Common/MyText';
import {sendMessage} from '../../firebase/firestore/chats';
import {createRelationship} from '../../firebase/firestore/relationships';

export default function MapModal({
  userId,
  user,
  relatedUser,
  modalVisible,
  closeModal,
}) {
  const [spoilTypes, setSpoilTypes] = useState([]);
  useEffect(() => {
    getAllSpoilTypes()
      .then(res => setSpoilTypes(res))
      .catch(e => {
        console.log(e);
        alert('Error occured');
      });
  }, []);

  const handleSpoilPress = async spoilType => {
    await sendMessage(user, relatedUser, spoilType, `Here’s a ${spoilType.name}, enjoy!`,0);
    await createRelationship(user,relatedUser)
    alert('Spoil sent');
  };

  return (
    <Modal
      isVisible={modalVisible}
      onBackButtonPress={closeModal}
      style={styles.modal}
      onBackdropPress={closeModal}>
      <View>
        <View style={styles.top}>
          <View style={styles.user}>
            <LoadingImage
              source={{uri: relatedUser.profilePic}}
              style={styles.profilePic}
            />
            <MyHeading
              text={`${relatedUser.firstName} ${relatedUser.lastName}`}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {spoilTypes.map((spoilType, i) => {
              return (
                <Pressable
                  onPress={() => handleSpoilPress(spoilType)}
                  key={i}
                  style={styles.spoilTypes}>
                  <LoadingImage
                    source={{uri: spoilType.image}}
                    style={styles.profilePic}
                  />
                  <Text style={{marginStart:-20,marginTop:5}}>{`\$${10 + 5 * i}`}</Text>
                  {/* <MyText  text=  /> */}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        <Pressable style={styles.btn} onPress={closeModal}>
          <MyHeading text="Cancel" textAlign="center" color="red" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {justifyContent: 'flex-end'},
  top: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#EAEAEA',
  },
  profilePic: {
    marginRight: 20,
    width: 70,
    height: 70,
    borderWidth: 2,
    borderRadius: 50,
  },
  spoilTypes: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  
  },
  btn: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 20,
  },
});
