import { StyleSheet, Dimensions, View,Image ,TouchableOpacity} from 'react-native'
import React,{useEffect,useState} from 'react'
import {launchCamera,} from 'react-native-image-picker';
import CustomText from '../components/CustomText';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {verticalScale } from 'react-native-size-matters';

import { getUser } from "../firebase/firestore/users";
import {uploadImage} from '../firebase/HelperFunctions/HelperFunctions'
import {
    createPost,
  } from "../firebase/firestore/posts";
import {useSelector} from 'react-redux'
import { ActivityIndicator } from 'react-native-paper';
const {width,height} = Dimensions.get('window')
const CameraScreen = ({navigation}) => {
    const [image, setImage] = useState('')
    const [isSelected, setIsSelected] = useState(true)
    const [loading, setLoading] = useState(false)
  const userId = useSelector((state) => state.user.userId);

    const onSubmit = async()=>{
        try {
          setLoading(true)
          const userData= await getUser(userId)
          const data={
            userId,
            userData,
            type:isSelected ? 'Post' : 'Story',
            title: '',
            dataType: image.type.includes('video') ?'video' : 'image',
          }
          data.image=await uploadImage(image.uri,userId)
          await createPost(data)
          setLoading(false)

          navigation.navigate('Tab',{screen:'Home'})
          
        } catch (error) {
          console.log("error line 38 onSubmit",error)
          setLoading(false)
        }
      
      }
useEffect(() => {
    const options = {
        // maxWidth: 300,
        // maxHeight: 300,
        mediaType:'photo',
        quality:0.8,
      };
        setTimeout(async() => {
          const {assets,didCancel} = await launchCamera(options);
          if(didCancel){
            navigation.navigate('Tab')
          }else{
              setImage(assets[0])
          }
        }, 500);
}, [])
    
  return (
    <View style={styles.container}>
        <Image source={image} style={styles.imageContainer} />
        {image?.uri && <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={()=>setIsSelected(true)} style={[styles.btnCapsule,isSelected && {backgroundColor:'#fff'}]}>
                <CustomText alignSelf={'center'} color={isSelected ? '#000' : '#fff'} fontWeight={'bold'} label="Create Post" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setIsSelected(false)} style={[styles.btnCapsule,!isSelected && {backgroundColor:'#fff'}]}>
                <CustomText alignSelf={'center'} color={!isSelected ? '#000' : '#fff'} fontWeight={'bold'} label="Create Story" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmit} disabled={loading} style={styles.btnSubmit}>
                {loading ? 
                <ActivityIndicator animating color='#000' />   : 
                <AntDesign name='right' size={verticalScale(23)} />
            }
            </TouchableOpacity>
        </View>}
        <View />
        <View />
       </View> 
  )
}

export default CameraScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#000',
        justifyContent:'space-between'
    },
    imageContainer:{
        height:height-265,
        width:width
    },
    buttonContainer:{
        flexDirection:'row',
    },
    btnCapsule:{
        borderRadius:25,
        width:'33%',
        borderWidth:2,
        borderColor:'#fff',
        marginEnd:20,
        justifyContent:'center',
        alignItems:'center'
    },
    btnSubmit:{
        backgroundColor:'#FFF',
        width:40,
        height:40,
        borderRadius:999,
        justifyContent:'center',
        alignItems:'center'
    }
})