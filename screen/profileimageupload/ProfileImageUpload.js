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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import {baseUrl} from '../../apiUrl/Url';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProfileImageUpload(props) {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [useruid, setuseruid] = useState('');
  const [error, seterror] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [pUrl, setpUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploaded, setuploaded] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const isfocused = useIsFocused();
  const param = new URLSearchParams();
  const user = JSON.parse(props.route.params.user)
  const {uid} =user.user

  useEffect(() => {
    setname(props.route.params.name)
    setemail(props.route.params.email)
    setuseruid(uid)
    setpassword(props.route.params.password)
  }, [isfocused]);
  useEffect(() => {
    if (uploaded) {
      storeData();
    }
  }, [uploaded]);

  const uploadImage = async () => {
    const filename = filePath.substring(filePath.lastIndexOf('/') + 1);
    //console.log("file path------------------->",filePath.substring(filePath.lastIndexOf('/') + 1))
    const uploadUri =
      Platform.OS === 'ios' ? filePath.replace('file://', '') : filePath;
    setUploading(true);
    setTransferred(0);
    const task = storage()
      .ref('profileImage/' + filename)
      .putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    
    // const url = await storage().ref("profileImage/" + filename).getDownloadURL();
    // console.log("url data-----------------",url)
    setpUrl('profileImage/' + filename);
    setuploaded(true);
  };

  const storeData = () => {
    //console.log('Purl data-----------------', pUrl);
    param.append('name', name);
    param.append('email', email);
    param.append('password', password);
    param.append('tokenid', useruid);
    param.append('profileUrl', pUrl);
    param.append('isActive', false);
    param.append('lastSeen', new Date().getTime().toString());
    //console.log('api pass data', param);
    axios
      .post(baseUrl + '/createaccnt', param, {
        headers: {
          'content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(res => {
        props.navigation.navigate('Signin');
      })
      .catch(error => {
        //console.log(error);
      });
  };
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };
  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };
  const captureImage = async () => {
    let options = {
      maxWidth: 1600,
      maxHeight: 900,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setFilePath(response.assets[0].uri);
      });
    }
  };
  const chooseitem = () => {
    let options = {
      maxWidth: 1600,
      maxHeight: 900,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response.assets[0].uri);
    });
  };
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <Text
        style={{
          marginTop: 70,
          marginBottom: 70,
          fontSize: 20,
          fontWeight: 'bold',
          color: 'black',
          
        }}>
        Hey! Upload your profile photo here
      </Text>
      <View
        style={{
          padding: 2,
          backgroundColor: '#DCE6FF',
          borderRadius: 150,
          width: 250,
          height: 250,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 5,
        }}>
        {filePath ? (
          <Avatar
            size={240}
            rounded
            source={{
              uri: filePath,
            }}
            activeOpacity={1}
          />
        ) : (
          <Avatar
            size={240}
            rounded
            source={require('../assets/avater.jpg')}
            activeOpacity={1}
          />
        )}
      </View>
      {uploading ? (
        <View style={{marginTop: 5}}>
          <Progress.Bar progress={transferred} width={300} />
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          width: '70%',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginTop: 20,
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            backgroundColor: '#0276f1',
            borderRadius: 10,
            paddingStart: 30,
            paddingBottom: 10,
            paddingEnd: 30,
            paddingTop: 10,
          }}
          onPress={() => captureImage()}>
          <Icon name="camera" color="white" size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            backgroundColor: '#0276f1',
            borderRadius: 10,
            paddingStart: 30,
            paddingBottom: 10,
            paddingEnd: 30,
            paddingTop: 10,
          }}
          onPress={() => chooseitem()}>
          <Icon name="image" color="white" size={30} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => uploadImage()}
        style={{
          marginTop:30,
          padding:12,
          width:"45%",
          alignItems:"center",
          justifyContent:"center",
          backgroundColor:'#0276f1',
          borderRadius:10
        }}>
        <Text style={{fontSize:18,fontWeight:"500",color:"white"}}>Upload Image</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
    borderRadius: 100,
  },
});
