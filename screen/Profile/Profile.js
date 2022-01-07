import React, {useState} from 'react';
import {Text, StyleSheet, Dimensions, Platform} from 'react-native';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import ModalComponent from '../../Component/Modal/ModalComponent';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StatusBar} from 'react-native';

export default function Profile(props) {
  const [modalon, setModalon] = useState(false);
  const {UserData} = useSelector(state => state);

  const nav = screen => {
    props.navigation.navigate(screen);
    setModalon(false);
  };
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
          <Text style={styles.innerText}>Profile</Text>
        </View>
        <Icon
          name="search"
          color={'#0276f1'}
          size={35}
          onPress={() => alert('search')}
        />
      </View>
      <Text>profile</Text>
      <ModalComponent
        visible={modalon}
        notvisible={() => modalClose()}
        from={'Profile'}
        navigation={nav}
      />
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
    elevation: 5,
    ...Platform.select({
      ios: {
        paddingTop: 40,
      },
      android: {
        paddingTop: 10,
      },
    }),
    justifyContent: 'space-between',
  },
  innerHeader: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  innerText: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0276f1',
  },
});
