import React from 'react';
import {View, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function ShortLoader() {
  return (
    <View
      style={{
        width: windowWidth / (1.8 * 2),
        height: windowWidth / (1.8 * 2),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <LottieView
        autoPlay={true}
        loop
        source={require('./short-loading.json')}
      />
    </View>
  );
}
