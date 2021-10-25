import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Header } from 'react-native-elements'
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth'
import { useDispatch } from 'react-redux';
import { authentication } from '../../redux/actions/auth/Auth';

export default function Daskboard(props) {
    const dispatch = useDispatch()
    useEffect(() => {
        AsyncStorage.getItem("userData").then(data => {
            console.log(data)
        })
    }, [])
    const rightcomponents = () => {
        return (
            <>
                <TouchableOpacity style={{ backgroundColor: "white", borderRadius: 40, padding: 2 }} activeOpacity={1} onPress={() => logout()}>
                    <LottieView
                        style={{ width: 40, height: 40 }}
                        source={require('./logout.json')}
                        autoPlay
                        loop
                    />
                </TouchableOpacity>
            </>

        )
    }
    const logout = () => {
        auth()
            .signOut().then(() => {
                dispatch(authentication(false))

            }).catch((error) => {
                // An error happened.
            });
        AsyncStorage.removeItem("userData")
    }
    return (
        <View>
            <Header
                containerStyle={{
                    backgroundColor: 'black',
                    justifyContent: 'space-around',
                }}
                centerComponent={{ text: 'Dashboard', style: { color: '#fff', fontSize: 28, fontWeight: "bold" } }}
                rightComponent={rightcomponents()}
            />

        </View>
    )
}
