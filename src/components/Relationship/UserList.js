import {StyleSheet, FlatList, Pressable, View} from 'react-native';
import {LoadingImage} from '../Common/LoadingImage';
import {MyText} from '../Common/MyText';
import {MyHeading} from '../Common/MyHeading';
import React from 'react';
import {createRelationship} from '../../firebase/firestore/relationships'
export const UserList = ({otherUsers, userId, lastMessages, navigation,loading}) => {
  const renderRelations = ({index, item: otherUser}) => {
    return (
      <Pressable
        key={index}
        style={[
          styles.userContainer,
          lastMessages &&
            lastMessages[index] && {
              backgroundColor: lastMessages[index].read ? '#E7F8FF' : 'white',
            },
        ]}
        onPress={async() => {
          if (lastMessages)
            navigation.navigate('Chat', {
              userId,
              relatedUserId: otherUser.id,
            });
          else {
             await createRelationship(userId,otherUser.id)
             navigation.navigate('Chat', {
              userId,
              relatedUserId: otherUser.id,
            });
          }
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <LoadingImage
            style={styles.profilePic}
            source={{uri: otherUser.profilePic}}
          />
          <View>
            <MyHeading
              marginBottom={15}
              text={`${otherUser.firstName} ${otherUser.lastName[0]}.`}
            />
            {/* {lastMessages && lastMessages[index] && (
              <MyText
                text={`Sent you a ${lastMessages[index].spoil.name}!`}
                color="#C4C4C4"
              />
            )} */}
          </View>
        </View>
        {lastMessages && lastMessages[index] && lastMessages[index].read && (
          <View style={styles.new}>
            <MyText text="New" color="white" />
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <FlatList
      style={{paddingHorizontal: 20}}
      data={otherUsers}
   
      ListEmptyComponent={()=>!loading? (
        <View style={{marginTop:'30%',}}>
        <MyHeading textAlign='center' text={"You don't have any relation yet"} />
        <MyText marginTop={5} textAlign='center' text={"Send a spoil to create a new relation"} />
        </View>
      ):<></>}
      renderItem={renderRelations}
    />
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
  },
  profilePic: {
    borderRadius: 100,
    backgroundColor: '#F1F1F1',
    height: 70,
    width: 70,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
  },
  new: {
    backgroundColor: '#38B5EB',
    borderRadius: 100,
    padding: 10,
  },
});
