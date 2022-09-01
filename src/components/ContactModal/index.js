import { StyleSheet, TouchableOpacity, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import CustomText from "../CustomText";
import Entypo from "react-native-vector-icons/AntDesign";
import { scale } from "react-native-size-matters";
import colors from "../../util/colors";

const ContactModal = ({ modalVisible, closeModal, contactList }) => {
  return (
    <Modal
      isVisible={modalVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
    >
      <View style={styles.modal}>
        <TouchableOpacity
          onPress={closeModal}
          style={{ alignSelf: "flex-end" }}
        >
          <Entypo color={colors.primary} name="closecircle" size={scale(20)} />
        </TouchableOpacity>
        <CustomText textStyle={styles.heading} label="Contacts" fontSize={23} />
       
        <FlatList
          data={contactList}
          keyExtractor={(item, index) => item.recordID + index.toString()}
          renderItem={({item,index})=>(
              <View style={styles.contactContainer}>
              <CustomText textStyle={styles.displayName} label={item.displayName} />
                <View>
                    {item?.phoneNumbers?.map(subItem=>(
                      <TouchableOpacity onPress={()=>alert("Message Sent")}>
                     <CustomText color={'blue'} key={subItem.id} textStyle={styles.displayName} label={subItem.number} />
                     </TouchableOpacity>

                    ))}
                </View>
              </View>
          )}
        />
      </View>
    </Modal>
  );
};

export default ContactModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 10,
    marginVertical: "10%",
    padding: "4%",
  },
  displayName:{
      fontSize:16,
  },
  heading:{fontWeight:"bold",alignSelf:"center",marginBottom:10},
  contactContainer:{
      flexDirection:"row",
      justifyContent:"space-between",
      borderBottomWidth:1,
      padding:"4%",
      alignItems:"center"

  }
});
