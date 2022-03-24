import { Image, StyleSheet, Keyboard, View,TouchableOpacity } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import images from "../assets/images";
import React,{useState} from "react";
import InputField from '../components/Common/InputField'
const Header = ({ fImgPath, sImgPath, fImgStyle, sImgStyle,searchText,setSearchText,containerStyle,sImgContainerStyle,searchedUser }) => {
  const [isSearched, setIsSearched] = useState(false)
  const onSubmitEditing=()=>{
    searchedUser();
    Keyboard.dismiss();
    setSearchText("")
    setIsSearched(false)
  }
  return (
    <View style={[styles.mainContainer,containerStyle]}>
      {!isSearched ? 
      <>
      <Image source={fImgPath} style={[styles.fImg, fImgStyle]} />
      <Image style={styles.logo} source={images.logo} />
      <TouchableOpacity activeOpacity={0.8} style={sImgContainerStyle} onPress={()=>setIsSearched(true)}>
        <Image source={sImgPath} style={[styles.sImg, sImgStyle]} />
      </TouchableOpacity>
      </>:
      <InputField onSubmitEditing={onSubmitEditing} value={searchText} onChangeText={setSearchText} inputStyle={{marginTop:-20}} right={()=>setIsSearched(false)} label={"Search Here"} />
      }
      
    </View>
  );
};

export default Header;

const styles = ScaledSheet.create({
  mainContainer: {
    alignItems: "center",
    paddingVertical: "20@vs",
    paddingHorizontal: "25@s",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  logo: {
    width: "120@s",
    height: "30@vs",
    resizeMode: "contain",
  },
  fImg: {
    width: "25@ms",
    height: "25@ms",
    resizeMode: "contain",
  },
  sImg: {
    width: "25@ms",
    height: "25@ms",
    resizeMode: "contain",
  },
});
