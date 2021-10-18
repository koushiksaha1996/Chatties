import React from 'react'
import { Image, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';

export default function Splash() {
    return (
        <View style={{ backgroundColor: "#d1e7ff", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
            <Image
                source={require('../assets/splashicon.png')}
            />
        </View>
    )
}
