import { SafeAreaView, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";
import { MyHeading } from "../../../components/Common/MyHeading";
import { MyText } from "../../../components/Common/MyText";
import { getSpoils, getUserTotalSpoils } from "../../../firebase/firestore/spoils";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/userSlice";
import SpoilItem from "./molecules/Item";
export const Spoil = ({ navigation }) => {
  const userId = useSelector(selectUser);
  const [spoils, setSpoils] = useState([]); //date thingy
  const [userSpoils, setUserSpoils] = useState([]); //the spoil count a user has
  useEffect(() => {
    
    getUserTotalSpoils(userId, setUserSpoils)
    // console.log(spoils)
  
    const spoilSubscriber = getSpoils(userId, setSpoils);
    
    return () => {
      spoilSubscriber();
      //recusion maybe not the best way to do this
    };
  
  }, [userId]);



  return (
    <SafeAreaView style={styles.outerContainer}>
      <View>
        <MyHeading text="Your Spoils" fontSize={23} />
        <View style={styles.infosContainer}>
          <LinearGradient style={styles.infoContainer} colors={["#FFE37E", "#FFBC08"]}>
            <MyHeading text="$0" fontSize={25} />
            <MyHeading text="Your balance" fontSize={15} />
          </LinearGradient>
          <View style={[styles.infoContainer, { backgroundColor: "#e30505" }]}>
            <MyHeading text={userSpoils} color="white" fontSize={25} />
            {

            userSpoils === 1 ? (
              <MyHeading text="Spoil available" color="white" fontSize={15} />
              
            ) : (
              <MyHeading text="Spoils available" color="white" fontSize={15} />
            )}
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            //this actually gives the date, has nothing to do with the spoils -_- 
           spoils.length > 0 ? 
          spoils.map((spoilGroup, i) => {
            return (
              <View key={i} style={{ marginVertical: 5 }}>
                {spoilGroup.length > 0 && <MyHeading marginBottom={10} text={spoilGroup[0].date.toDateString()} />}
                {spoilGroup.map((spoil, j) => {
                  return <SpoilItem key={spoil.id + j} length={spoils.length} userId={userId} spoil={spoil} />;
                })}
              </View>
            );
          })
        : <MyHeading text="You Do Not Have Any Spoils Yet." color="black" fontSize={15} />
          }
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infosContainer: {
    width: "100%",
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  infoContainer: {
    padding: 20,
    paddingLeft: 10,
    width: "45%",
    borderWidth: 3,
    borderRadius: 10,
  },
});
