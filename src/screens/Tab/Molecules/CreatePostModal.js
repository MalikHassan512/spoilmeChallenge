import { Image, TextInput, View,TouchableOpacity,ActivityIndicator } from 'react-native'
import React,{useState} from 'react'
import { getUser } from "../../../firebase/firestore/users";
import {uploadImage} from '../../../firebase/HelperFunctions/HelperFunctions'
import {
    createPost,
  } from "../../../firebase/firestore/posts";
import CustomText from '../../../components/CustomText';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import VideoPlayer from 'react-native-video-player'
import UploadPhoto from "components/UploadPhoto";
import CustomModal from "components/CustomModal";
import {useSelector} from 'react-redux';
import colors from '../../../util/colors';
import {ScaledSheet} from 'react-native-size-matters'
const CreatePostModal = ({visible,setVisible,loadData}) => {
  const userId = useSelector((state) => state.user.userId);

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false)
  const onSubmit = async()=>{
    try {
      setLoading(true)
      const userData= await getUser(userId)
      const data={
        userId,
        userData,
        type,
        title,
        dataType: image.type.includes('video') ?'video' : 'image',
      }
      data.image=await uploadImage(image.uri,userId)
        await createPost(data)
        loadData()
      setLoading(false)
      setType("")
      setTitle("")
      setImage("")
      setVisible(false)

    } catch (error) {
      console.log("error line 30 onSubmit",error)
      setLoading(false)
      setVisible(false)
    }
  
  }
  const data = [
    {
      label: "Story",
    },
    {
      label: "Post",
    },
  ];
  return (
    <CustomModal isModalVisible={visible} setModalVisible={()=>{
        setVisible(false)
        setType("")
        setTitle("")
        setImage("")
      }}>
        <View style={styles.modalContainer}>
          <CustomText label="Create Post" textStyle={styles.CreatePostTitle} />
          {/* <View style={styles.textInputContainer}> */}
            <TextInput
              placeholder="What's on your mind"
              multiline={true}
              value={title}
              placeholderTextColor={colors.darkGrey}
              style={styles.textInput}
              onChangeText={(value) => setTitle(value)}
            />
          {/* </View> */}
          <View style={{ width: "90%", alignSelf: "center" }}>
            <RadioButtonRN
              data={data}
              style={{ height: 50 }}
              selectedBtn={(e) => setType(e.label)}
              icon={<Icon name="check-circle" size={25} color="#2c9dd1" />}
            />
          </View>
          <View style={{ flex: 1 }} />
          {image ? (
            <View>
              {image.type.includes('video') ?
              <VideoPlayer style={styles.image} />:
              <Image source={image} style={styles.image} />}
            </View>
          ) : (
            <View />
          )}

          
          <View>
           {!image ?<UploadPhoto
          handleChange={(res) => setImage(res)}
          options={{mediaType:'mixed'}}
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
        width: "100%",
        marginBottom:20
      },
})