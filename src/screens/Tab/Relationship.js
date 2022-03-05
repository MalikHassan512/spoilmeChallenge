import {
  View,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {getUserRelationships} from '../../firebase/firestore/relationships';
import {useSelector} from 'react-redux';
import {selectUser} from '../../redux/features/userSlice';
import {getUsersById} from '../../firebase/firestore/users';
import {LoadingImage} from '../../components/Common/LoadingImage';
import {MyHeading} from '../../components/Common/MyHeading';
import {MyText} from '../../components/Common/MyText';
import {Loading} from '../../components/Common/Loading';
import {getLastMessages} from '../../firebase/firestore/chats';
import {FloatingAction} from 'react-native-floating-action';
import {RelationshipHeader} from '../../components/Relationship/RelationshipHeader';
import {UserList} from '../../components/Relationship/UserList';

export const Relationship = ({navigation}) => {
  const [relationships, setRelationships] = useState([]);
  const [relatedUsers, setRelatedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastMessages, setLastMessages] = useState([]);
  const [lastMessageSubscribers, setLastMessageSubscribers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const userId = useSelector(selectUser);

  useEffect(() => {
    setLoading(true);
    getUserRelationships(userId)
      .then(res => {
        setRelationships(res);
      })
      .catch(e => {
        console.log(e);
        alert('Error occured. Please Try again');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    const getRelatedUsers = async () => {
      const tempRelatedUsersId = [];
      for (let relationship of relationships) {
        tempRelatedUsersId.push(
          userId === relationship.user1
            ? relationship.user2
            : relationship.user1,
        );
      }
      if (tempRelatedUsersId.length === 0) return;
      const tempRelatedUsers = await getUsersById(tempRelatedUsersId);
      tempRelatedUsers.filter(relatedUser => {
        if (relatedUser) return relatedUser;
      });
      setRelatedUsers(tempRelatedUsers);
      setFilteredUsers(tempRelatedUsers);
      setLoading(false);
    };
    getRelatedUsers().catch(e => {
      console.log(e);
      setLoading(false);
      alert('Error occured. Please Try again');
    });
  }, [relationships]);

  useEffect(() => {
    if (relatedUsers.length > 0) {
      const subscribers = [];
      relatedUsers.forEach((relatedUser, i) => {
        subscribers.push(
          getLastMessages(
            userId,
            relatedUser.id,
            i,
            lastMessages,
            setLastMessages,
          ),
        );
      });
      setLastMessageSubscribers(subscribers);
      return () => {
        lastMessageSubscribers.forEach(lastMessageSubscriber =>
          lastMessageSubscriber(),
        );
      };
    }
  }, [relatedUsers]);

  useEffect(() => {
    if (searchText) {
      setFilteredUsers(
        relatedUsers.filter(user => {
          const re = new RegExp(searchText.replace('.', ''));
          return !!user.firstName.match(re) || !!user.lastName.match(re);
        }),
      );
    } else setFilteredUsers(relatedUsers);
  }, [searchText]);

  return loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container}>
      <RelationshipHeader
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <UserList
        loading={loading}
        userId={userId}
        lastMessages={lastMessages}
        otherUsers={filteredUsers}
        navigation={navigation}
      />
      {/* <FloatingAction
        color="black"
        onPressMain={() => navigation.navigate('CreateRelationship')}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
