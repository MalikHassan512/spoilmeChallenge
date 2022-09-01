import {StyleSheet, View, Image,TouchableOpacity} from 'react-native';
import {LoadingImage} from '../Common/LoadingImage';
import {MyHeading} from '../Common/MyHeading';
import React from 'react';
import colors from '../../util/colors';

export const ChatHeader = ({relatedUser, navigation,userIdProps}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={{width:40,height:40}} activeOpacity={0.7} onPress={() =>{
         userIdProps ?
        navigation.navigate('ProfileStack',{screen:'Profile',params:{userId:userIdProps}})
         :navigation.goBack()
        
      }}>
        <Image source={require('../../assets/images/back.png')} />
      </TouchableOpacity>
      <View>
        <MyHeading text="Relationship with" fontSize={15} textAlign="center" />
        <MyHeading
          text={`${relatedUser.firstName} ${relatedUser.lastName[0]}.`}
          textAlign="center"
        />
      </View>
      <LoadingImage
        source={{uri: relatedUser.profilePic}}
        style={[styles.profilePic,relatedUser?.isActive && {borderColor:colors.photoBorder}]}

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
