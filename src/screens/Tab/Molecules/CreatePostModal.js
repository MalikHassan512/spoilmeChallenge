import { Image, TextInput, View,TouchableOpacity,ActivityIndicator } from 'react-native'
import React,{useState} from 'react'
import { getUser } from "../../../firebase/firestore/users";
import {uploadImage} from '../../../firebase/HelperFunctions/HelperFunctions'
import {
    createPost,
  } from "../../../firebase/firestore/posts";
import CustomText from '../../../components/CustomText';
import VideoPlayer from 'react-native-video-player'
import UploadPhoto from "components/UploadPhoto";
import CustomModal from "components/CustomModal";
import {useSelector} from 'react-redux';
import colors from '../../../util/colors';
import {scale, ScaledSheet, verticalScale} from 'react-native-size-matters'

const CreatePostModal = ({visible,setVisible,loadData}) => {
  const userId = useSelector((state) => state.user.userId);

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false)
  const onSubmit = async()=>{
    try {
      setLoading(true)
      const data={
        userId,
        type:'Post',
        title,
        dataType: image.type.includes('video') ?'video' : 'image',
      }
      data.image=await uploadImage(image.uri,userId)
        await createPost(data)
        loadData()
      setLoading(false)
      setTitle("")
      setImage("")
      setVisible(false)

    } catch (error) {
      console.log("error line 30 onSubmit",error)
      setLoading(false)
      setVisible(false)
    }
  
  }
 
  return (
    <CustomModal isModalVisible={visible} setModalVisible={()=>{
        setVisible(false)
        setTitle("")
        setImage("")
      }}>
        <View style={styles.modalContainer}>
          <CustomText label="Create Post" textStyle={styles.CreatePostTitle} />
            
          <TextInput
          value={title}
          onChangeText={(newVal) => setTitle(newVal)}
          placeholder="What’s on your mind?"
          multiline={true}
          style={styles.inputStyle}
           />
          <View style={{ flex: 1 }} />
          {image ? (
            <View>
              {image.type.includes('video') ?
              <VideoPlayer source={image}   style={styles.image} />:
              <Image source={image} style={styles.image} />}
            </View>
          ) : (
            <View />
          )}

          
          <View>
           {!image ?<UploadPhoto
          handleChange={(res) => setImage(res)}
          options={{mediaType:'mixed'
       
        }}
          renderButton={(handleChange)=><TouchableOpacity
            activeOpacity={0.6}
            onPress={handleChange}
          >
            <CustomText
              label="Upload"
              container={styles.uploadImageContainer}
              textStyle={styles.uploadimageText}
            />
          </TouchableOpacity>}
          />
         :
         <TouchableOpacity
         activeOpacity={0.6}
         onPress={onSubmit}
       >
        <CustomText
           label={loading ? <ActivityIndicator color={'white'} size="small" /> :"Create"}
           container={styles.uploadImageContainer}
           textStyle={styles.uploadimageText}
        />
       
        
       </TouchableOpacity>
        }
        
        </View>
        </View>
      </CustomModal>
  )
}

export default CreatePostModal

const styles = ScaledSheet.create({
    modalContainer: {
        backgroundColor: colors.white,
        width: "100%",
        height: "95%",
        alignSelf: "center",
        borderRadius: "10@s",
      },
      CreatePostTitle: {
        fontSize: "18@ms",
        fontWeight: "700",
        color: colors.black,
        alignSelf: "center",
        marginTop: "10@s",
      },
      
      textInput: {
        fontSize: "12@ms",
        color: colors.darkGrey,
        fontWeight: "600",
        borderColor: colors.primary,
        borderWidth: "1@s",
        margin: "10@s",
        paddingStart:10,
        borderRadius: "5@s",
        height:50
        
      },
      uploadImageContainer: {
        alignSelf: "center",
        padding: "10@s",
        backgroundColor: colors.primary,
        borderRadius: "25@s",
        width: "45%",
        alignItems: "center",
        justifyContent:'center',
        marginVertical: "10@s",
      },
      uploadimageText: {
        color: colors.white,
        fontSize: "12@ms",
        alignSelf:'center'
      },
      image: {
        width: "312@s",
      alignSelf: 'center',
      height: "240@vs",
      borderRadius: 10
      },
      inputStyle:{
        height:'140@vs',
        marginVertical:20,
        textAlignVertical:'top',
        borderColor: 'grey',
        padding:20,
        borderWidth:1.5,
        marginHorizontal:15,
        borderRadius:10
      }
})