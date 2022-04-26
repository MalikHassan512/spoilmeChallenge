import {View,TouchableOpacity } from 'react-native'
import {ScaledSheet} from 'react-native-size-matters'
import Logo from "components/Logo";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import React from 'react'
import Colors from "util/colors";

const HomeHeader = (props) => {
  return (
    <View style={styles.headerContainer}>
        
        {props.renderFirst ? props.renderFirst:  <Logo />
        }
          {!props.hideIcon && <View style={styles.headerIconContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={props.onPlusCircle}
            >
              <AntDesign
                color={Colors.darkGrey}
                name="pluscircle"
                style={styles.icon}
              />
            </TouchableOpacity>

            <FontAwesome
              color={Colors.darkGrey}
              name="comment"
              style={styles.icon}
            />
          </View>}
        </View>
  )
}

export default HomeHeader

const styles = ScaledSheet.create({
    headerContainer: {
        marginTop: "12@vs",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: "26@ms",
        backgroundColor:'transparent'
      },
      headerIconContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "baseline",
      },
      icon: {
        fontSize: "23@ms",
        marginStart: "23@ms",
      },
})