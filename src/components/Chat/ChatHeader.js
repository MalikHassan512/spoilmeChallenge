import {StyleSheet, Pressable, View, Image} from 'react-native';
import {LoadingImage} from '../Common/LoadingImage';
import {MyHeading} from '../Common/MyHeading';
import React from 'react';

export const ChatHeader = ({relatedUser, navigation}) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/back.png')} />
      </Pressable>
      <View>
        <MyHeading text="Relationship with" fontSize={15} textAlign="center" />
        <MyHeading
          text={`${relatedUser.firstName} ${relatedUser.lastName[0]}.`}
          textAlign="center"
        />
      </View>
      <LoadingImage
        source={{uri: relatedUser.profilePic}}
        style={styles.profilePic}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 15,
    borderBottomColor: 'rgba(200,200,200,0.5)',
    borderBottomWidth: 2,
  },
  profilePic: {
    borderRadius: 100,
    backgroundColor: '#F1F1F1',
    height: 50,
    width: 50,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
  },
});
