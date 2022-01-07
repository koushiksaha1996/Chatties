import LottieView from 'lottie-react-native';
import React from 'react';
import {
  StatusBar,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';

export default function Loader(props) {
  const {isVisible} = props;
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  return (
    <ReactNativeModal isVisible={state.Loader.isVisible} style={{backgroundColor:'white',margin:0}}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={'white'} />
        <LottieView autoPlay={true} loop source={require('./loading.json')} />
      </View>
    </ReactNativeModal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
