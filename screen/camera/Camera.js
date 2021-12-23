import React, { PureComponent, useState } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera'
import { SafeAreaView } from 'react-native-safe-area-context';

function Camera() {
  const [barcode, setBarcode] = useState(null);
  const [cam, setcam] = useState(false);
  return (
    <View style={styles.screen}>
      {barcode ? (
        <View style={[styles.rnCamera, styles.rmCameraResult]}>
          <Text style={styles.rmCameraResultText}>{barcode.data}</Text>
          <Text style={styles.rmCameraResultText}>{barcode.type}</Text>
        </View>
      ) : null }
        <RNCamera
          style={styles.rnCamera}
          onBarCodeRead={setBarcode}
        />
      

      <View style={styles.cameraControl}>
        <TouchableOpacity style={styles.btn} onPress={() => setBarcode(null)}>
          <Text style={styles.btnText}>New QR Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    height: 50,
    backgroundColor: '#62d1bc', // green
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitleText: {
    color: '#ffffff', // white
    fontSize: 20,
  },
  caption: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionTitleText: {
    color: '#121B0D', // black
    fontSize: 16,
    fontWeight: '600'
  },
  rnCamera: {
    flex: 1,
    width: 500,
    height:500,
    alignSelf: 'center',
  }
});
export default Camera;