import {StyleSheet, Image, Pressable, View, TextInput} from 'react-native';
import React, {useState} from 'react';

export const RelationshipHeader = ({searchText, setSearchText}) => {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <View>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/bar_left.png')} />
        <Image style={{width:125,height:31}} source={require('../../assets/images/logo.png')} />
        <Pressable
          style={styles.searchButton}
          onPress={() => setShowSearch(!showSearch)}>
          <Image source={require('../../assets/images/search.png')} />
        </Pressable>
      </View>
      {showSearch && (
        <TextInput
          placeholder="Search for Relations"
          value={searchText}
          onChangeText={text => setSearchText(text)}
          style={styles.searchBar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 45,
  },
  searchButton: {
    elevation: 15,
    shadowColor: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 2,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: 30,
    width: '90%',
    marginLeft: '5%',
    padding: 15,
    marginBottom: 10,
  },
});
