import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Image, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {Header} from 'react-native-elements';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {authentication} from '../../redux/actions/auth/Auth';
import storage from '@react-native-firebase/storage';
import axios from 'axios';
import {baseUrl} from '../../apiUrl/Url';
import {adduser} from '../../redux/actions/profiledata/Userdata';
import Camera from '../camera/Camera';
import {RNCamera} from 'react-native-camera';

export default function Daskboard(props) {
  const {UserData} = useSelector(state => state);
  const [barcode, setBarcode] = useState(null);
  const [gbarcode, setgBarcode] = useState(null);
  const [dpic, setdpic] = useState('');
  const dispatch = useDispatch();
  const param = new URLSearchParams();
  useEffect(() => {
    AsyncStorage.getItem('userData').then(data => {
      //console.log(data);
    });
    downloadprofilepic();
  },);
  const gbardata=(e)=>{
    if(e.barcodes.length!=0){
      console.log("google bar code data",e)
    }
  }
  const bardata=(e)=>{
    console.log("normal bar code data",e)
  }
  const downloadprofilepic = async () => {
    const url = await storage().ref(UserData.display_pic).getDownloadURL();
    setdpic(url);
    //console.log('url data dashboard-----------------', url);
  };
  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        resetdata();
        dispatch(authentication(false));
      })
      .catch(error => {
        // An error happened.
      });
    AsyncStorage.removeItem('userData');
  };
  const resetdata = () => {
    param.append('email', UserData.email);
    param.append('isActive', false);
    param.append('lastSeen', new Date().getTime().toString());
    axios
      .post(baseUrl + '/logout', param, {
        headers: {
          'content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(res => {
        //console.log('logout user', res.data);
        dispatch(adduser(res.data.user));
      });
  };
  
  return (
    <View>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      {dpic ? (
        <Image source={{uri: dpic}} style={{width: 200, height: 200}} />
      ) : (
        <Image
          source={require('../assets/avater.jpg')}
          style={{width: 200, height: 200}}
        />
      )}
      <TouchableOpacity onPress={() => logout()}>
        <Text>logout</Text>
      </TouchableOpacity>

      <RNCamera
        style={{width: 300, height: 300}}
        onGoogleVisionBarcodesDetected={gbardata}
        onBarCodeRead={bardata}
      />
    </View>
  );
}
