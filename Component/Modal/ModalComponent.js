import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Image} from 'react-native';
import {View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import ShortLoader from '../Loader/ShortLoader';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {baseUrl} from '../../apiUrl/Url';
import {adduser} from '../../redux/actions/profiledata/Userdata';
import LinearGradient from 'react-native-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ModalComponent(props) {
  const {UserData, Auth} = useSelector(state => state);
  const {visible, notvisible, from, navigation} = props;
  const param = new URLSearchParams();
  const param1 = new URLSearchParams();
  const param2 = new URLSearchParams();
  const dispatch = useDispatch();
  const goTo = screen => {
    navigation(screen);
  };
  const switchmode = () => {
    if (!UserData.isactive) {
      onLine(UserData.email);
    } else {
      offLine(UserData.email);
    }
  };
  const onLine = async uemail => {
    param.append('email', uemail);
    param.append('isActive', true);
    param.append('lastSeen', new Date().getTime().toString());
    axios
      .post(baseUrl + '/loginWhenForeground', param, {
        headers: {
          'content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(res => {
        if (res.data.errorMessage == 200) {
          dispatch(adduser(res.data.user));
        }
      });
  };
  const offLine = async uemail => {
    if (uemail) {
      param1.append('email', uemail);
      param1.append('isActive', false);
      param1.append('lastSeen', new Date().getTime().toString());
      let res = await axios.post(baseUrl + '/logoutWhenBackground', param1, {
        headers: {
          'content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (res.data.errorMessage == 200) {
        dispatch(adduser(res.data.user));
      }
    }
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
    param2.append('email', UserData.email);
    param2.append('isActive', false);
    param2.append('lastSeen', new Date().getTime().toString());
    axios
      .post(baseUrl + '/logout', param2, {
        headers: {
          'content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(res => {
        dispatch(adduser(res.data.user));
        notvisible;
      });
  };
  return (
    <ReactNativeModal
      isVisible={visible}
      style={{margin: 0}}
      onBackdropPress={notvisible}
      onBackButtonPress={notvisible}
      animationInTiming={500}
      animationOutTiming={800}
      animationIn="slideInLeft"
      animationOut="slideOutLeft">
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}
        colors={['#0575E6', '#65C7F7']}
        style={{
          backgroundColor: 'white',
          width: windowWidth / 1.8,
          height: windowHeight / 1.1,
          borderTopRightRadius: 50,
          borderBottomRightRadius: 50,
          paddingTop: 50,
          paddingBottom: 50,
          backgroundColor: '#3a8cfd',
        }}>
        <ScrollView
          style={{
            paddingTop: 15,
            paddingEnd: 15,
            paddingStart: 15,
            width: '100%',
            backgroundColor: 'white',
            paddingBottom: 15,
          }}>
          <View style={styles.imagecontainer}>
            {UserData.profile_pic ? (
              <Image
                source={{uri: UserData.profile_pic}}
                style={styles.profileimage}
              />
            ) : (
              // <Image
              //   source={require('../assets/avater.jpg')}
              //   style={{width: 200, height: 200}}
              // />
              <ShortLoader />
            )}
          </View>
          <View style={styles.namecontainer}>
            <Text style={styles.nameField}>{UserData.user_name}</Text>
            {UserData.isactive ? (
              <View style={styles.activestate}></View>
            ) : (
              <View style={styles.offlinestatue}></View>
            )}
          </View>
          <View style={styles.editbtncontainer}>
            <TouchableOpacity style={styles.editbtn} activeOpacity={0.8}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.editbtncontainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.switchontooff}
              onPress={() => switchmode()}>
              {UserData.isactive ? (
                <Text style={styles.navText}>Switch Offline Mode</Text>
              ) : (
                <Text style={styles.navText}>Switch Online Mode</Text>
              )}
              {!UserData.isactive ? (
                <View style={styles.activestate1}></View>
              ) : (
                <View style={styles.offlinestatue1}></View>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderWidth: 1,
              width: '100%',
              marginTop: 20,
              marginBottom: 25,
              borderColor: '#0276f1',
            }}></View>
          {from != 'Profile' ? (
            <TouchableOpacity
              style={styles.navContainer}
              activeOpacity={1}
              onPress={() => goTo('Profile')}>
              <View style={styles.navImageContainer}>
                <Icon
                  name="account"
                  color={'#0276f1'}
                  size={23}
                  onPress={() => setModalon(true)}
                />
              </View>
              <View style={styles.navTextcontainer}>
                <Text style={styles.navText}>Profile</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navContainer, {backgroundColor: '#bee5f7'}]}
              activeOpacity={1}
              onPress={() => goTo('Daskboard')}>
              <View style={styles.navImageContainer}>
                <Icon
                  name="account"
                  color={'#0276f1'}
                  size={23}
                  onPress={() => setModalon(true)}
                />
              </View>
              <View style={styles.navTextcontainer}>
                <Text style={styles.navText}>Profile</Text>
              </View>
            </TouchableOpacity>
          )}
          {from != 'Daskboard' ? (
            <TouchableOpacity
              style={styles.navContainer}
              activeOpacity={1}
              onPress={() => goTo('Daskboard')}>
              <View style={styles.navImageContainer}>
                <Icon
                  name="message"
                  color={'#0276f1'}
                  size={23}
                  onPress={() => setModalon(true)}
                />
              </View>
              <View style={styles.navTextcontainer}>
                <Text style={styles.navText}>Messages</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navContainer, {backgroundColor: '#bee5f7'}]}
              activeOpacity={1}
              onPress={() => goTo('Daskboard')}>
              <View style={styles.navImageContainer}>
                <Icon
                  name="message"
                  color={'#0276f1'}
                  size={23}
                  onPress={() => setModalon(true)}
                />
              </View>
              <View style={styles.navTextcontainer}>
                <Text style={styles.navText}>Messages</Text>
              </View>
            </TouchableOpacity>
          )}
          <View
            style={{
              borderWidth: 1,
              width: '100%',
              marginTop: 30,
              marginBottom: 30,
              borderColor: '#0276f1',
            }}></View>
          <TouchableOpacity
            style={[styles.navContainer, {backgroundColor: '#bee5f7'}]}
            activeOpacity={1}
            onPress={() => logout()}>
            <View style={styles.navImageContainer}>
              <Icon1
                name="logout"
                color={'#0276f1'}
                size={23}
                onPress={() => setModalon(true)}
              />
            </View>
            <View style={styles.navTextcontainer}>
              <Text style={styles.navText}>Logout</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.versioncontainer}>
            <Text style={styles.versionField}>Version: </Text>
            <Text style={styles.versionField}>1.0.0</Text>
          </View>
          <View style={styles.versioncontainer}>
            <Text style={styles.versionField}>© 2022 </Text>
            <Text style={styles.versionField}>Chattiez</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  imagecontainer: {
    width: windowWidth / (1.8 * 2.2),
    height: windowWidth / (1.8 * 2.2),
    justifyContent: 'center',
    borderRadius: 100,
    padding: 2,
    backgroundColor: '#0276f1',
    alignItems: 'center',
  },
  profileimage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  namecontainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  nameField: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0276f1',
  },
  navContainer: {
    flexDirection: 'row',
    paddingStart: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingEnd: 5,
    justifyContent: 'flex-start',
    marginEnd: 5,
    borderRadius: 18,
    marginTop: 3,
    marginBottom: 3,
  },
  navText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0276f1',
  },
  navTextcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 5,
  },
  navImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activestate: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#6bd43d',
    marginTop: 5,
    marginStart: 5,
  },
  offlinestatue: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#f71515',
    marginTop: 5,
    marginStart: 5,
  },
  editbtncontainer: {
    width: '100%',
    justifyContent: 'center',
    marginTop: 10,
  },
  editbtn: {
    width: '70%',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#0276f1',
  },
  editText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  switchontooff: {
    flexDirection: 'row',
    width: '100%',
    padding: 5,
    backgroundColor: '#bee5f7',
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  activestate1: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#6bd43d',
    marginTop: 2,
  },
  offlinestatue1: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#f71515',
    marginTop: 2,
  },
  versionField: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0276f1',
    alignSelf: 'center',
  },
  versioncontainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
