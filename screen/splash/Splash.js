import React from 'react'
import { Image, Text, View } from 'react-native';
import { StatusBar } from 'react-native';

export default function Splash() {
    return (
        <View style={{  width: "100%", height: "100%", alignItems: "center", justifyContent: "center" ,backgroundColor:"#DCE6FF"}}>
            <StatusBar barStyle='dark-content' backgroundColor={"#DCE6FF"}/>
            <Image style={{width:"50%",height:"50%",resizeMode:"contain"}}
                source={require('./splash.jpg')}
            />
        </View>
    )
}
