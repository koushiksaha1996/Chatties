import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signin from './screen/Signin';
import Signup from './screen/Signup';
import Daskboard from './screen/Dashboard/Daskboard';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from './screen/splash/Splash';
import FingerPrintCheck from './screen/Fingerprint/FingerPrintCheck';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { authentication } from './redux/actions/auth/Auth';

const firebaseConfig = {
    apiKey: "AIzaSyC4DOwT2D2lx-rHDUwYTZilYK1PM9gHzX4",
    authDomain: "storage-d33cb.firebaseapp.com",
    projectId: "storage-d33cb",
    storageBucket: "storage-d33cb.appspot.com",
    messagingSenderId: "767146452632",
    appId: "1:767146452632:web:31a3fe772e8bc4fff7d2ed",
    measurementId: "G-RV6JXNXRRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


export default function Start() {
    const [isloading, setisloading] = useState(true)
    const state = useSelector(state => state)
    const dispatch= useDispatch()
    const auth = getAuth();
    
    console.log("------------------redux---------->", state)
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user)
                dispatch(authentication(true))
            } else {
                dispatch(authentication(false))
            }
        });
        setTimeout(() => {
            setisloading(false)
        }, 2000)
    }, [])
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {
                    isloading ? <Stack.Screen name="Splash" component={Splash} />
                        : state.Auth.authentication_status === true ? (
                            <>
                                <Stack.Screen name="FingerPrintCheck" component={FingerPrintCheck} />
                                <Stack.Screen name="Daskboard" component={Daskboard} />
                            </>
                        ) : (
                            <>
                                <Stack.Screen name="Signin" component={Signin} />
                                <Stack.Screen name="Signup" component={Signup} />
                            </>
                        )
                }


            </Stack.Navigator>
        </NavigationContainer>
    )
}
