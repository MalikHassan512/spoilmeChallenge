/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, View, ScrollView} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import React from 'react';
//components
import Logo from 'components/Logo';
//icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//Molecules
import {Heading, NotificationBox, ImagesContainer} from './Molecules';
import Images from 'assets/images';
import Colors from 'util/colors';

const Home = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Logo />
        <View style={styles.headerIconContainer}>
          <AntDesign name="heart" style={styles.icon} />
          <FontAwesome name="star" style={styles.icon} />
          <MaterialCommunityIcons name="bell" style={styles.icon} />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading
          containerStyle={styles.opportunityContainer}
          label="Spoil Opportunities"
        />
        <NotificationBox
          containerStyle={styles.opportunityBox}
          label={
            'It’s David’s birthday today. You can make his day better. You can surprise him. You'
          }
        />
        <Heading containerStyle={styles.opportunityBox} label="Map" />
        <ImagesContainer
          containerStyle={styles.opportunityBox}
          imageStyle={styles.mapImages}
          gutter={7}
          images={[Images.mapIstanbul, Images.mapIstanbul, Images.mapIstanbul]}
        />
        <Heading containerStyle={styles.opportunityBox} label="Spoils" />
        <ImagesContainer
          containerStyle={styles.spoilBox}
          imageStyle={styles.spoilImages}
          gutter={7}
          images={[
            Images.soda,
            Images.burger,
            Images.mysteryBox,
            Images.yoga,
            Images.coin,
          ]}
        />
        <Heading containerStyle={styles.opportunityBox} label="Contacts" />
        <ImagesContainer
          imageContainer={styles.contactBoxContainer}
          containerStyle={styles.spoilBox}
          imageStyle={styles.spoilImages}
          gutter={7}
          images={[
            Images.soda,
            Images.burger,
            Images.mysteryBox,
            Images.yoga,
            Images.coin,
          ]}
        />
        <Heading containerStyle={styles.opportunityBox} label="Wallet" />
        <View style={[styles.opportunityBox, {flexDirection: 'row'}]}>
          <NotificationBox
            containerStyle={{paddingVertical: 20}}
            labelStyle2={{color: Colors.primary}}
            label2={'200$'}
            label={'FIAT: '}
          />
          <NotificationBox
            labelStyle2={{color: Colors.primary}}
            containerStyle={{marginHorizontal: 7, paddingVertical: 21}}
            label2={'200$'}
            label={'Crypto: '}
          />
          <NotificationBox
            containerStyle={{paddingVertical: 20}}
            labelStyle2={{color: Colors.primary}}
            label2={'10'}
            label={'Spoils: '}
          />
        </View>
        <Heading containerStyle={styles.opportunityBox} label="Key Stats" />
        <NotificationBox
          containerStyle={styles.opportunityBox}
          label={
            'You last spoiled X with Y on Z. You have been last spoiled X with Y on Z. Your most intense relationship is with X.  The most'
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = ScaledSheet.create({
  mainContainer: {
    flex: 1,
    paddingVertical: '16@vs',
    backgroundColor: 'white',
  },
  headerContainer: {
    marginTop: '12@vs',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: '26@ms',
  },
  opportunityContainer: {
    marginTop: '21@vs',
    marginStart: '23@vs',
    marginEnd: '27@vs',
  },
  spoilBox: {
    marginStart: '22@vs',
    marginEnd: '25@vs',
  },
  opportunityBox: {
    marginStart: '25@vs',
    marginEnd: '27@vs',
  },
  headerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: '22@ms',
    marginStart: '23@ms',
  },
  mapImages: {
    width: '97@s',
    height: '54@vs',
  },
  spoilImages: {
    width: '55@s',
    height: '55@vs',
    resizeMode: 'contain',
    overflow: 'hidden',
  },
});
