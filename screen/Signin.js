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
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Octicons';
import {baseUrl} from '../apiUrl/Url';
import {useDispatch} from 'react-redux';
import {authentication} from '../redux/actions/auth/Auth';
import {getFormData} from './Function';
import { adduser } from '../redux/actions/profiledata/Userdata';

export default function Signin(props) {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [error, seterror] = useState(null);
  const isfocused = useIsFocused();
  const [secviewpass, setsecviewpass] = useState(true);
  const [newapp,setnewapp] = useState("yes")
  const param = new URLSearchParams();

  const dispatch = useDispatch();
  useEffect(()=>{
    AsyncStorage.getItem("new_install").then(res=>{
      //console.log(res)
      if(res){
        setnewapp(res)
      }
      else{
        AsyncStorage.setItem("new_install","no")
      }
    })
  },[])
  // const Check = () => {
  //   const payload = getFormData({
  //     user_id: userid,
  //     fcm_token:
  //       'cH3b1c7WRQaqJ5k6RyAztn:APA91bGlnI4IOoQPM6Iiq-T2rTTSYqy6yODp_fMgHZYf1PMEHVE2sYPRE6cDFCtFanQDdD7DJwAPGVA3Jsx3lqahiODS67HIG_in_nWqij1dBu4z9D7ef0ubzWuBSsJalg4YB4o53Njo',
  //   });
  //   console.log('ALL PAYLOAD________________', payload);
  //   axios
  //     .post(
  //       'http://testmymobileapp.com/noonadminpanel/api/storeFcmToken',
  //       payload,
  //       {
  //         headers: {
  //           'content-Type': 'application/x-www-form-urlencoded',
  //         },
  //       },
  //     )
  //     .then(res => {
  //       console.log('outer axois', res.data);

  //       axios
  //         .get(
  //           `http://testmymobileapp.com/noonadminpanel/api/sendPushNotification/${userid}`,
  //           {
  //             headers: {
  //               'content-Type': 'application/x-www-form-urlencoded',
  //             },
  //           },
  //         )
  //         .then(response => {
  //           console.log('inner axios', response.data);
  //         })
  //         .catch(error => {
  //           console.log('<-----------error token------------>', error);
  //         });
  //     })
  //     .catch(err => {
  //       console.log('<-----------error token------------>', err);
  //     });
  // };

  const handleLogin = props => {
    
    if(email && password){
      auth()
      .signInWithEmailAndPassword(email, password)
      .then(userdata => {
        //console.log('existing user', userdata);
        getData();
      })
      .catch(error => {
        seterror(error.message);
      });
    }
    else{
      alert("enter cradential")
    }
  };
  const getData = () => {
    param.append('email', email);
    param.append('isActive', true);
    param.append('lastSeen', new Date().getTime().toString());
    axios
      .post(baseUrl + '/login', param, {
        headers: {
          'content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(res => {
        //console.log('login user', res.data);
        if (res.data.errorMessage == 200) {
          AsyncStorage.setItem('userData', res.data.user.tokenid);
          dispatch(authentication(true));
          dispatch(adduser(res.data.user))
        }
      });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor={"white"}/>
      <Image source={require('./assets/logo.jpg')} style={styles.logo} />
      <Text style={{alignSelf:"center",fontSize:30,color:'black',fontWeight:"bold",marginBottom:20}}>{newapp=="yes" ?  "Welcome to our app!" : "Welcome back!"}</Text>
      <Text style={{alignSelf:"center",fontSize:15,fontWeight:"400",marginBottom:20}}>Login to your existing account</Text>
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
            autoCompleteType='off'
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
        <Text style={styles.forgetpass}>Forget Password?</Text>
        <View style={styles.loginbtncontainer}>
          <TouchableOpacity style={styles.loginbtn} activeOpacity={1} onPress={() => handleLogin()}>
            <Text style={styles.loginbtntext}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:"row"}}>
        <Text style={styles.forgetpass}>Dont't have an account? </Text>
        <Text style={styles.signup} onPress={() => props.navigation.navigate('Signup')}>Sign Up</Text>
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
  forgetpass:{
    alignSelf:"center",
    fontSize:15,
    fontWeight:"400",
    marginBottom:20
  },
  signup:{
    alignSelf:"flex-end",
    fontSize:15,
    fontWeight:"500",
    color:"#3a8cfd",
    marginBottom:20
  },
  loginbtncontainer:{
    width:"100%",
    alignItems:"center",
    marginBottom:35
  },
  loginbtn:{
    width:"50%",
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#0148a4",
    borderRadius:25,
    padding:10
  },
  loginbtntext:{
    color:"white",
    fontWeight:"600",
    fontSize:20
  }
});
