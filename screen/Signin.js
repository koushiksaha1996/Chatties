import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TextInput, View, Button, BackHandler, Alert, TouchableOpacity } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Header } from 'react-native-elements'
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { baseUrl } from '../apiUrl/Url'
import { useDispatch } from 'react-redux'
import { authentication } from '../redux/actions/auth/Auth'

export default function Signin(props) {
  const area = useSafeArea()
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [lottieloading, setlottieloading] = useState(false)
  const [error, seterror] = useState(null)
  const isfocused = useIsFocused()
  const param = new URLSearchParams();

  const dispatch= useDispatch();
  
  
  const handleLogin = (props) => {
    setlottieloading(true)
    auth()
      .signInWithEmailAndPassword(email, password).then(userdata => {

      console.log("existing user", userdata)
      getData()
      
    }).catch(error => {
      setlottieloading(false)
      seterror(error.message)
    })
  }
  const getData = () => {
    param.append("email", email);
    axios.post(baseUrl + "/login", param, {
      headers: {
        'content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      console.log("login user",res.data.user.tokenid)
      if (res.data.errorMessage == 200) {
        AsyncStorage.setItem("userData", res.data.user.tokenid)
        // props.navigation.navigate("Dashboard")
        dispatch(authentication(true))
      }
    })
  }
  return (
    <View style={{  width: '100%', height: "100%", alignItems: "center" }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
          justifyContent: 'space-around',
        }}
        centerComponent={{ text: 'Signin', style: { color: '#fff', fontSize: 28, fontWeight: "bold" } }}
      />


      {error &&
        <Text style={{ color: "red" }}>{error}</Text>
      }
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
      

      <TouchableOpacity activeOpacity={1} onPress={() => handleLogin()} >
        {!lottieloading ?
          <LottieView
            source={require('./rightarrow.json')}
            style={{ width: 60, height: 60 }}
            autoPlay
            loopa
          />
          :
          <LottieView
            source={require('./loading.json')}
            style={{ width: 60, height: 60 }}
            autoPlay
            loopa
          />}
      </TouchableOpacity>
      {/* <Icon
        name="arrow-right"
        size={15}
        color="blue"
      /> */}
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => props.navigation.navigate("Signup")}
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