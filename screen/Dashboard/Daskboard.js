import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {Header} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {authentication} from '../../redux/actions/auth/Auth';
import storage from '@react-native-firebase/storage';
import axios from 'axios';
import {baseUrl} from '../../apiUrl/Url';
import {addProfilePic, adduser} from '../../redux/actions/profiledata/Userdata';
import Camera from '../camera/Camera';
import {RNCamera} from 'react-native-camera';
import ShortLoader from '../../Component/Loader/ShortLoader';
import ModalComponent from '../../Component/Modal/ModalComponent';
import Icon from 'react-native-vector-icons/MaterialIcons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Daskboard(props) {
  const {UserData} = useSelector(state => state);
  const [barcode, setBarcode] = useState(null);
  const [gbarcode, setgBarcode] = useState(null);
  const [dpic, setdpic] = useState('');
  const [modalon, setModalon] = useState(false);
  const dispatch = useDispatch();
  const param = new URLSearchParams();
  useEffect(() => {
    AsyncStorage.getItem('userData').then(data => {
      //console.log(data);
    });
    downloadprofilepic();
  });
  const downloadprofilepic = async () => {
    const url = await storage().ref(UserData.display_pic).getDownloadURL();
    setdpic(url);
    dispatch(addProfilePic(url));
  };
  const nav=(screen)=>{
    props.navigation.navigate(screen)
    setModalon(false);
  }
  const modalClose = () => {
    setModalon(false);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <View style={styles.header}>
        <Icon
          name="menu"
          color={'#0276f1'}
          size={35}
          onPress={() => setModalon(true)}
        />
        <View style={styles.innerHeader}>
          <Text style={styles.innerText}>Messages</Text>
        </View>
        <Icon
          name="search"
          color={'#0276f1'}
          size={35}
          onPress={() => alert("search")}
        />
      </View>
      
        <Text>Messages</Text>
      
      <ModalComponent visible={modalon} notvisible={() => modalClose()} from={"Daskboard"} navigation={nav}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    paddingTop: 8,
    paddingStart: 20,
    paddingEnd: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    elevation:5,
    ...Platform.select({
      ios:{
        paddingTop:40
      },
      android:{
        paddingTop:10
      }
    }),
    justifyContent:"space-between"
  },
  innerHeader:{
    justifyContent:"center",
    alignSelf:'center',
  },
  innerText:{
    alignSelf:"center",
    fontSize:20,
    fontWeight:"bold",
    color:"#0276f1"
  }
});
