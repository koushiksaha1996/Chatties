import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  BackHandler,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
  Linking,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import {useIsFocused} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {setLoader} from '../redux/actions/Loader/Loader';
import axios from 'axios';
import {baseUrl} from '../apiUrl/Url';
import Icon1 from 'react-native-vector-icons/AntDesign';

export default function ForgotPassword(props) {
  const [email, setemail] = useState('');
  const [response, setResponse] = useState(false);
  const [emailNotSend, setEmailNotSend] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const isfocused = useIsFocused();
  const [loginbtn, setLoginbtn] = useState(false);
  const dispatch = useDispatch();
  const param = new URLSearchParams();
  const confirm = async () => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType} = resultObject;

      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        console.log('TouchID is supported');
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.log('FaceID is supported');
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        console.log('Biometrics is supported', available, biometryType);
      } else {
        console.log('Biometrics not supported');
      }
    });

    ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
      .then(resultObject => {
        const {success} = resultObject;

        if (success) {
          console.log('successful biometrics provided', resultObject);

          Linking.openURL(resetUrl);
        } else {
          console.log('user cancelled biometric prompt');
        }
      })
      .catch(() => {
        console.log('biometrics failed');
      });
  };
  const handleLogin = () => {
    // auth.sendPasswordResetEmail(email).then(res => {
    //   props.navigation.navigate('Signin');
    // });
    dispatch(setLoader(true));
    param.append('email', email);
    axios
      .post(baseUrl + '/resetpassword', param, {
        headers: {
          'content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(res => {
        dispatch(setLoader(false));
        if (res.data.errorCode == 500) {
          setResponse(true);
          setResetUrl(res.data.resetUrl);
        } else if (res.data.errorCode == 501) {
          setEmailNotSend(true);
          setResetUrl(res.data.resetUrl);
        }
      });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <View style={styles.backbtn}>
        <Icon1
          name="arrowleft"
          color="#0276f1"
          size={30}
          onPress={() => props.navigation.goBack()}
        />
      </View>
      <Image source={require('./assets/logo.jpg')} style={styles.logo} />
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 30,
          color: 'black',
          fontWeight: 'bold',
          marginBottom: 20,
        }}>
        Reset Password
      </Text>
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 15,
          fontWeight: '400',
          marginBottom: 20,
        }}>
        Reset Your Password by Entering Your Existing Email
      </Text>
      <View style={styles.innerview}>
        <View style={styles.textinputview}>
          <View style={styles.texticon}>
            <Icon name="email" color="#0276f1" size={20} />
          </View>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={email => setemail(email)}
            value={email}
            textAlign="left"
            autoCompleteType="off"
          />
        </View>

        <View style={styles.loginbtncontainer}>
          <TouchableOpacity
            style={!loginbtn ? styles.loginbtn : styles.loginbtndis}
            disabled={loginbtn}
            activeOpacity={1}
            onPress={() => handleLogin()}>
            <Text style={styles.loginbtntext}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
      {response ? (
        <View style={styles.resposnsecontainer}>
          <View style={styles.success}>
            <Text style={styles.successText}>
              Sent Reset Link to your registered Email
            </Text>
          </View>
          <View style={styles.query}>
            <Text style={styles.queryText}>
              If you didn't get Email, just click the Button below
            </Text>
          </View>
          <View style={styles.loginbtncontainer}>
            <TouchableOpacity
              onPress={() => confirm()}
              activeOpacity={0.7}
              style={styles.loginbtn}>
              <Text style={styles.loginbtntext}>Reset Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : emailNotSend ? (
        <View style={styles.resposnsecontainer}>
          <View style={styles.error}>
            <Text style={styles.errorText}>
              Unfortunatly We cannot send Reset email right now, but you can get
              your link by clicking button below
            </Text>
          </View>
          <View style={styles.loginbtncontainer}>
            <TouchableOpacity
              onPress={() => confirm()}
              activeOpacity={0.7}
              style={styles.loginbtn}>
              <Text style={styles.loginbtntext}>Reset Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  innerview: {
    width: '100%',
    alignItems: 'center',
    paddingStart: 40,
    paddingEnd: 40,
  },
  textInput: {
    width: '90%',
    padding: 10,
    color: '#0276f1',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  textInputpass: {
    width: '80%',
    padding: 10,
    color: '#0276f1',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: '28%',
    height: '28%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textinputview: {
    width: '100%',
    borderColor: '#0276f1',
    borderWidth: 2,
    marginBottom: 20,
    borderRadius: 20,
    flexDirection: 'row',
  },
  texticon: {
    width: '10%',
    paddingStart: 1,
    paddingBottom: 1,
    paddingTop: 1,
    paddingEnd: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgetpass: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 20,
  },
  signup: {
    alignSelf: 'flex-end',
    fontSize: 15,
    fontWeight: '500',
    color: '#3a8cfd',
    marginBottom: 20,
  },
  loginbtncontainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 35,
  },
  loginbtn: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0148a4',
    borderRadius: 25,
    padding: 10,
  },
  loginbtndis: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 25,
    padding: 10,
  },
  loginbtntext: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
  },
  resposnsecontainer: {
    paddingStart: 4,
    paddingEnd: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#6ed87e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  successText: {
    fontSize: 15,
    color: '#6ed87e',
  },
  query: {
    borderRadius: 15,
    borderColor: '#9faebe',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  queryText: {
    fontSize: 15,
    color: '#9faebe',
  },
  error: {
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#eb7660',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 15,
    color: '#eb7660',
  },
  backbtn: {
    padding: 8,
    position: 'absolute',
    top: 10,
    left: 20,
    borderRadius: 50,
    backgroundColor: 'white',
  },
});
