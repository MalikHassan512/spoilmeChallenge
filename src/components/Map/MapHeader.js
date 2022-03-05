import {StyleSheet, Pressable, Image, View} from 'react-native';
import React from 'react';

export default function MapHeader() {
  return (
    <View style={styles.logoContainer}>
      <Image source={require('../../assets/images/bar_left.png')} />
      <Image source={require('../../assets/images/logo.png')} />
      <Pressable style={styles.searchButton}>
        <Image source={require('../../assets/images/search.png')} />
      </Pressable>
    </View>
  );
}

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
});
