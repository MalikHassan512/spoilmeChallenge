import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
const CustomModal = (props) => {
  return (
    <View>
      {props.isModalVisible && (
        <Modal
          transparent={true}
          onBackdropPress={() => props.setModalVisible(false)}
          isVisible={props.isModalVisible}
          style={[styles.modalWrapper, props.modalWrapperStyle]}
        >
          <View style={[styles.modalContainer, props.modalContainerStyle]}>
            {props.children}
          </View>
        </Modal>
      )}
    </View>
  )
}

export default CustomModal

const styles = StyleSheet.create({})