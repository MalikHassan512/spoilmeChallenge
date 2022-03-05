import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import {MyHeading} from '../../components/Common/MyHeading';
import {MyText} from '../../components/Common/MyText';
import {AuthSubmitButton} from '../../components/Common/AuthSubmitButton';
import {MyTextField} from '../../components/Common/MyTextField';
import {forgotPassword} from '../../firebase/auth/forgotPassword';

export const ForgotPassword = ({navigation}) => {
  const emailRef = useRef();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => navigation.goBack()}>
          <MyText text="Back" color="gray" />
        </Pressable>
        <View style={{marginBottom: 25, marginTop: 20}}>
          <MyHeading text="Forgot Password" textAlign="center" />
          <MyText
            text="Enter the email you signed up with"
            color="gray"
            textAlign="center"
          />
        </View>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <MyTextField
            label="Email"
            keyboardType="email-address"
            refer={emailRef}
            value={email}
            onChangeText={newVal => setEmail(newVal)}
            returnKeyType="done"
            blurOnSubmit={true}
          />

          <View style={{marginTop: 20}}>
            <AuthSubmitButton
              text="Send reset password link"
              disabled={!email}
              loading={loading}
              onPress={async () => {
                try {
                  setLoading(true);
                  await forgotPassword(email);
                } catch (e) {
                } finally {
                  alert(
                    `An email has been sent to ${email}. If you don't find it try looking in your spam folder or try again`,
                  );
                  navigation.navigate('Signin');
                }
              }}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    backgroundColor: '#fff',
    flex: 1,
    width: '101%',
  },
  innerContainer: {
    height: '100%',
    width: '80%',
    marginTop: '17%',
    marginBottom: '5%',
  },
  textField: {
    width: '100%',
    backgroundColor: 'white',
  },
});
