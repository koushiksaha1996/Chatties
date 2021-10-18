
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import axios from 'axios';
import { Header } from 'react-native-elements';
import LottieView from 'lottie-react-native'
import { baseUrl } from '../apiUrl/Url';

export default function Signup(props) {
    const area = useSafeArea()
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [error, seterror] = useState(null)
    const isfocused = useIsFocused()
    const param = new URLSearchParams();

    const handleSignup = () => {
        const auth = getAuth()
        createUserWithEmailAndPassword(auth, email, password).then(usercredential => {
            storeData(usercredential)
        }).catch(error => {
            seterror(error.message)
        })
    }

    const leftcomponents = () => {
        return (
            <>
                <TouchableOpacity activeOpacity={1} onPress={()=> props.navigation.goBack()}>
                    <LottieView
                        style={{ width: 40, height: 40 }}
                        source={require('./leftarrow.json')}
                        autoPlay
                        loop
                    />
                </TouchableOpacity>
            </>

        )
    }
    //apiKey createdAt lastLoginAt

    const storeData = (user) => {
        console.log("new user ", user._tokenResponse.idToken)

        param.append("name", name);
        param.append("email", email);
        param.append("tokenid", user._tokenResponse.idToken);

        axios.post(baseUrl+"/createaccnt", param, {
            headers: {
                'content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            console.log("create accnt ", res.data)
            setname("")
            setemail("")
            setpassword("")
            props.navigation.navigate("Signin")
        }).catch(error => {
            console.log(error)
        })


    }
    return (
        <View style={{ paddingTop: area.top, paddingBottom: area.bottom, width: '100%', height: "100%", alignItems: "center" }}>
            <Header
                containerStyle={{
                    backgroundColor: 'black',
                    justifyContent: 'space-around',
                }}
                leftComponent={leftcomponents()}
                centerComponent={{ text: 'Signup', style: { color: '#fff', fontSize: 28, fontWeight: "bold" } }}
            />

            {error &&
                <Text style={{ color: "red" }}>{error}</Text>
            }
            <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Name"
                onChangeText={name => setname(name)}
                value={name}
            />
            <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Email"
                onChangeText={email => setemail(email)}
                value={email}
            />
            <TextInput
                secureTextEntry
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Password"
                onChangeText={password => setpassword(password)}
                value={password}
            />
            <Button title="Signup" onPress={() => handleSignup()} />
            <Button
                title="have an account? Sign in"
                onPress={() => props.navigation.navigate("Signin")}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    textInput: {
        height: 40,
        width: "90%",
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 8
    }
});