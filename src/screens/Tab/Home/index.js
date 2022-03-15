/* eslint-disable react-native/no-inline-styles */
import { SafeAreaView, View, ScrollView } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import React from "react";
//components
import Logo from "components/Logo";
import Map from "../../../components/Common/Map";
import TextWithIcon from "../../../components/Common/TextWithIcon";
//icons
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//Molecules
import { Heading, Box, ImagesContainer, OpportunityBox } from "./Molecules";
import Images from "assets/images";
import Colors from "util/colors";
import CustomText from "components/CustomText";
import OtherImages from "../../../components/Common/OtherImages";

const Home = () => {
  let three = [0, 1, 2];
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
        <Box
          containerStyle={[styles.opportunityBox, { flexDirection: "column" }]}
        >
          <OpportunityBox />
          <OpportunityBox />
          <OpportunityBox />
        </Box>
        <Heading containerStyle={styles.opportunityBox} label="Map" />
        {/* <ImagesContainer
          containerStyle={styles.opportunityBox}
          imageStyle={styles.mapImages}
          gutter={7}
          images={[Images.mapIstanbul, Images.mapIstanbul, Images.mapIstanbul]}
        /> */}
        <Box
          containerStyle={{
            flexDirection: "row",
            // justifyContent: "space-between",
            padding: 12,
            marginHorizontal: 25,
          }}
        >
          <Map mainContainer={{ marginRight: 12 }} />
          <Map />
        </Box>
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
        <View
          style={[
            styles.opportunityBox,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <Box
            containerStyle={{
              paddingVertical: 15,
              paddingHorizontal: 5,
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", marginLeft: 8 }}>
              {three.map((item) => (
                <OtherImages />
              ))}
            </View>
            <View>
              <CustomText textStyle={styles.text200} label="200$" />
            </View>
          </Box>
          <Box
            containerStyle={{
              paddingVertical: 15,
              paddingHorizontal: 5,
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", marginLeft: 8 }}>
              {three.map((item) => (
                <OtherImages />
              ))}
            </View>
            <View>
              <CustomText textStyle={styles.text200} label="200$" />
            </View>
          </Box>
          <Box
            containerStyle={{
              paddingVertical: 15,
              paddingHorizontal: 5,
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", marginLeft: 8 }}>
              {three.map((item) => (
                <OtherImages />
              ))}
            </View>
            <View>
              <CustomText textStyle={styles.text200} label="200$" />
            </View>
          </Box>
        </View>
        <Heading containerStyle={styles.opportunityBox} label="Key Stats" />
        <Box
          containerStyle={{
            flexDirection: "column",
            marginHorizontal: 25,
            marginBottom: 30,
          }}
        >
          <TextWithIcon label="Trendy spoils in the platform" />
          <TextWithIcon
            container={{ marginVertical: 12 }}
            label="Most expensive spoil in the platform"
          />
          <TextWithIcon label="Last spoil I made" />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = ScaledSheet.create({
  mainContainer: {
    flex: 1,
    paddingVertical: "16@vs",
    backgroundColor: "white",
  },
  headerContainer: {
    marginTop: "12@vs",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: "26@ms",
  },
  opportunityContainer: {
    marginTop: "21@vs",
    marginStart: "23@vs",
    marginEnd: "27@vs",
  },
  spoilBox: {
    marginStart: "22@vs",
    marginEnd: "25@vs",
  },
  opportunityBox: {
    marginHorizontal: "25@s",
    flexDirection: "row",
  },
  headerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: "22@ms",
    marginStart: "23@ms",
  },
  mapImages: {
    width: "97@s",
    height: "54@vs",
  },
  spoilImages: {
    width: "55@s",
    height: "55@vs",
    resizeMode: "contain",
    overflow: "hidden",
  },
  text200: {
    fontSize: "14@ms",
    fontWeight: "bold",
    marginLeft: "5@s",
  },
});
