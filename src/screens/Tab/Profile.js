import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {MyHeading} from '../../components/Common/MyHeading';
import {MyText} from '../../components/Common/MyText';
import {AuthSubmitButton} from '../../components/Common/AuthSubmitButton';
import {MyTextField} from '../../components/Common/MyTextField';
import {changeUserData, getUser} from '../../firebase/firestore/users';
import {useSelector} from 'react-redux';
import {selectUser} from '../../redux/features/userSlice';
import {Loading} from '../../components/Common/Loading';
import {LoadingImage} from '../../components/Common/LoadingImage';
import {signout} from '../../firebase/auth/signout'
export const Profile = () => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [initialFirstName, initialSetFirstName] = useState('');
  const [showDate, setShowDate] = useState(false);
  const [initialLastName, initialSetLastName] = useState('');
  const [initialDob, initialSetDob] = useState('');
  const [onSubmitLoading, setOnSubmitLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const userId = useSelector(selectUser);

  useEffect(() => {
    getUser(userId)
      .then(user => {
        setFirstName(user?.firstName);
        setLastName(user?.lastName);
        setDob(user?.dob?.toDate());
        initialSetFirstName(user?.firstName);
        initialSetLastName(user?.lastName);
        initialSetDob(user?.dob);
        setInitialLoading(false);
      })
      .catch(e => {
        // alert('An error occured.Try again');
        console.log(e);
      });
  }, [userId]);

  const onSubmit = async () => {
    try {
      setOnSubmitLoading(true);
      await changeUserData(userId, firstName, lastName, dob);
      alert('Info Changed Successfully');
      setOnSubmitLoading(false);
    } catch (e) {
      setOnSubmitLoading(false);
      alert('Error occured. Try again');
    }
  };

  return initialLoading ? (
    <Loading />
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <SafeAreaView style={styles.outerContainer}>
        <Pressable onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.inner}>
              <LoadingImage
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
              />
              <View style={styles.innerContainer}>
                <View style={{marginBottom: 20}}>
                  <MyHeading text="Profile" fontSize={25} />
                </View>
                <MyTextField
                  label="First Name"
                  refer={firstNameRef}
                  value={firstName}
                  onChangeText={newVal => setFirstName(newVal)}
                  onSubmitEditing={() => lastNameRef.current.focus()}
                  autoCapitalize="none"
                />
                <MyTextField
                  label="Last Name"
                  refer={lastNameRef}
                  value={lastName}
                  onChangeText={newVal => setLastName(newVal)}
                  autoCapitalize="none"
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Pressable onPress={() => setShowDate(true)}>
                    <MyText text="Change Date of birth" color="#FF8112" />
                  </Pressable>
                  <MyText text={dob?.toLocaleDateString()} />
                </View>

                {showDate && (
                  <DateTimePicker
                    value={dob}
                    mode="data"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDate(false);
                      if (selectedDate) setDob(selectedDate);
                    }}
                  />
                )}
                <View style={{marginTop: 30}}>
                  <TouchableOpacity style={{backgroundColor:'red',padding:15,alignItems:"center",borderRadius:5,
                marginBottom:10,}} onPress={signout} >
                    <MyText  color={'white'} text="Logout" />
                  </TouchableOpacity>
                  <AuthSubmitButton
                    text="Change Info"
                    disabled={
                      initialDob === dob &&
                      firstName === initialFirstName &&
                      lastName === initialLastName
                    }
                    loading={onSubmitLoading}
                    onPress={onSubmit}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: '#fff',
    width: '101%',
  },
  inner: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  innerContainer: {
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 30,
    marginTop: 40,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  textField: {
    width: '100%',
    backgroundColor: 'white',
  },
  logo: {
    maxWidth: 200,
    marginTop: 40,
    maxHeight: 40,
    resizeMode: 'contain',
  },
});
