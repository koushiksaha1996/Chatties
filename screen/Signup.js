import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  StatusBar,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {Avatar, Header} from 'react-native-elements';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/AntDesign';

export default function Signup(props) {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [error, seterror] = useState(null);
  const isfocused = useIsFocused();
  const [secviewpass, setsecviewpass] = useState(true);

  const handleSignup = () => {
    if (name != '' && email != '' && password != '') {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(usercredential => {
          // storeData(usercredential)
          //usercredential.sendEmailVerification();
          props.navigation.navigate('ProfileImageUpload', {
            user: JSON.stringify(usercredential),
            name: name,
            email: email,
            password: password,
          });
        })
        .catch(error => {
          seterror(error.message);
        });
    } else {
      alert('mandatory provided details');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backbtn}>
        <Icon2
          name="arrowleft"
          color="#0276f1"
          size={30}
          onPress={() => props.navigation.goBack()}
        />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <Image source={require('./assets/logo.jpg')} style={styles.logo} />
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 30,
          color: 'black',
          fontWeight: 'bold',
          marginBottom: 20,
        }}>
        Create Account !
      </Text>

      <View style={styles.innerview}>
        <View style={styles.textinputview}>
          <View style={styles.texticon}>
            <Icon name="account-circle" color="#0276f1" size={20} />
          </View>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Full name"
            onChangeText={name => setname(name)}
            value={name}
            textAlign="left"
          />
        </View>
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
          />
        </View>
        <View style={styles.textinputview}>
          <View style={styles.texticon}>
            <Icon name="lock-open" color="#0276f1" size={20} />
          </View>
          <TextInput
            secureTextEntry={secviewpass}
            style={styles.textInputpass}
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={password => setpassword(password)}
            value={password}
            textAlign="left"
          />
          <View style={styles.texticon}>
            {secviewpass ? (
              <Icon1
                name="eye-closed"
                color="#0276f1"
                size={20}
                onPress={() => setsecviewpass(!secviewpass)}
              />
            ) : (
              <Icon1
                name="eye"
                color="#0276f1"
                size={20}
                onPress={() => setsecviewpass(!secviewpass)}
              />
            )}
          </View>
        </View>

        <View style={styles.loginbtncontainer}>
          <TouchableOpacity
            style={styles.loginbtn}
            activeOpacity={1}
            onPress={() => handleSignup()}>
            <Text style={styles.loginbtntext}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.forgetpass}>Already have an account? </Text>
          <Text
            style={styles.signup}
            onPress={() => props.navigation.navigate('Signin')}>
            Sign In
          </Text>
        </View>
      </View>
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
  loginbtntext: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
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
