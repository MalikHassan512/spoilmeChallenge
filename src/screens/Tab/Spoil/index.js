import {SafeAreaView, View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {MyHeading} from '../../../components/Common/MyHeading';
import {MyText} from '../../../components/Common/MyText';
import {getSpoils} from '../../../firebase/firestore/spoils';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/features/userSlice';
import {LoadingImage} from '../../../components/Common/LoadingImage';
import {Loading} from '../../../components/Common/Loading';
import SpoilItem from './molecules/Item';
export const Spoil = ({navigation}) => {
  const userId = useSelector(selectUser);
  const [spoils, setSpoils] = useState([]);
  useEffect(() => {
    const spoilSubscriber = getSpoils(userId, setSpoils);
    return () => {
      spoilSubscriber();
    };
  }, [userId]);
  return (
    <SafeAreaView style={styles.outerContainer}>
      <View>
        <MyHeading text="Your Spoils" fontSize={23} />
        <View style={styles.infosContainer}>
          <LinearGradient
            style={styles.infoContainer}
            colors={['#FFE37E', '#FFBC08']}>
            <MyHeading text="$14" fontSize={25} />
            <MyHeading text="Your balance" fontSize={15} />
          </LinearGradient>
          <View style={[styles.infoContainer, {backgroundColor: 'red'}]}>
            <MyHeading text="25" color="white" fontSize={25} />
            <MyHeading text="Spoils available" color="white" fontSize={15} />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {spoils.map((spoilGroup, i) => {
            return (
              <View key={i} style={{marginVertical: 5}}>
                {spoilGroup.length > 0 && (
                  <MyHeading marginBottom={10} text={spoilGroup[0].date.toDateString()} />
                )}
                {spoilGroup.map((spoil, j) => {
                  return (
                   <SpoilItem userId={userId} key={j} spoil={spoil} />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    marginTop: 30,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infosContainer: {
    width: '100%',
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoContainer: {
    padding: 20,
    paddingLeft: 10,
    width: '45%',
    borderWidth: 3,
    borderRadius: 10,
  },
});
