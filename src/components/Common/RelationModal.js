import { View, TouchableOpacity} from "react-native";
import React,{useState,useEffect} from "react";
import CustomText from "../CustomText";
import colors from "../../util/colors";
import { moderateScale, ScaledSheet } from "react-native-size-matters";
import AntDesign from 'react-native-vector-icons/AntDesign'

import Modal from 'react-native-modal'
const RelationModal = ({ visible, setVisible,isRelation,changeRelationStatus}) => {
const [isRelationFlag, setIsRelationFlag] = useState(isRelation? true :false)
 useEffect(() => {
  setIsRelationFlag(isRelation? true :false)
 }, [])
 
  return (
    <Modal 
    style={{margin: 0}}
    onBackdropPress={setVisible} onBackButtonPress={setVisible} visible={visible}>
      <View style={styles.firstContainer}>
      <TouchableOpacity
          onPress={()=>setVisible(false)}
          style={{ flex: 1 }}
        ></TouchableOpacity>
        <View style={styles.secondContainer}>
          <View style={styles.emptyView} />
          <TouchableOpacity
            onPress={()=>{
              setIsRelationFlag(!isRelationFlag)
              changeRelationStatus(isRelationFlag ? 2 : 1)
              setVisible(false)

            }}
            style={styles.settingContainer}
          >
            <AntDesign color={isRelationFlag ?colors.primary  : "#000"} name={isRelationFlag ? "deleteuser" : "adduser"} size={moderateScale(18)} />
            <CustomText color={isRelationFlag ?colors.primary  : "#000"} marginLeft={10} fontWeight={'700'} label={isRelationFlag ?"Remove relation" : "Add relation"} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RelationModal;

const styles = ScaledSheet.create({
  firstContainer: {
    flex: 1,
    backgroundColor: "#C4C4C4aa",
  },
  secondContainer: {
    backgroundColor: "#ffffff",
    height: "14%",
    borderRadius: "30@ms",
    alignSelf: "flex-end",
    width: "100%",
    paddingHorizontal: "25@s",
    position: "absolute",
    bottom: -10,
    paddingVertical: "15@vs",
    paddingTop:'10@vs'
  },
  emptyView: {
    width: "45@s",
    alignSelf: "center",
    backgroundColor: colors.primary,
    height: "4@vs",
    borderRadius: "4@ms",
    marginBottom: "30@vs",
  },
  logoButton: {
    paddingHorizontal: "10@s",
    paddingVertical: "6@vs",
    marginBottom: "15@vs",
  },
  settingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "20@vs",
  },
  settingIcon: {
    width: "23@ms",
    height: "22@ms",
    resizeMode: "contain",
    marginRight: "12@s",
    marginLeft: "15@s",
  },
 
});
