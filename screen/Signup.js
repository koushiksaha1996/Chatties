
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Image, Platform, PermissionsAndroid, } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import axios from 'axios';
import { Avatar, Header } from 'react-native-elements';
import LottieView from 'lottie-react-native'
import { baseUrl } from '../apiUrl/Url';
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytes ,getDownloadURL} from "firebase/storage";



export default function Signup(props) {
    const storage = getStorage()

    const area = useSafeArea()
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [error, seterror] = useState(null)
    const [filePath, setFilePath] = useState([]);
    const [path, setpath] = useState("")
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
    console.log(path)
    useEffect(() => {
        if (filePath[0]?.uri) {
            const storageref = ref(storage, 'avater')
            uploadBytes(storageref, filePath[0]?.uri).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                download()
            });
            console.log("firebase ref ", storage)
        }
    }, [filePath[0]?.uri])

    const download = () => {
        getDownloadURL(ref(storage, 'ok.jpg'))
            .then((url) => {
                // `url` is the download URL for 'images/stars.jpg'

                // This can be downloaded directly:
                // const xhr = new XMLHttpRequest();
                // xhr.responseType = 'blob';
                // xhr.onload = (event) => {
                //     const blob = xhr.response;
                // };
                // xhr.open('GET', url);
                // xhr.send();

                // // Or inserted into an <img> element
                // const img = document.getElementById('myimg');
                // img.setAttribute('src', url);
                console.log("download link",url)
            })
            .catch((error) => {
                // Handle any errors
            });
    }
    const leftcomponents = () => {
        return (
            <>
                <TouchableOpacity activeOpacity={1} onPress={() => props.navigation.goBack()}>
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

        axios.post(baseUrl + "/createaccnt", param, {
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
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };
    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };
    const captureImage = async () => {
        let options = {
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            videoQuality: 'low',
            durationLimit: 30, //Video max duration in seconds
            saveToPhotos: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, (response) => {
                if (response.didCancel) {
                    alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                setFilePath(response.assets);
            });
        }
    };
    const chooseitem = () => {
        let options = {
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            setFilePath(response.assets);
        });

    };
    console.log(filePath)
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

            <View style={{ padding: 2, backgroundColor: "black", borderRadius: 100 }}>
                {filePath[0]?.uri ?
                    <Avatar
                        size="xlarge"
                        rounded
                        source={{
                            uri:
                                filePath[0]?.uri,
                        }}
                        activeOpacity={1}
                    />
                    :
                    <Avatar
                        size="xlarge"
                        rounded
                        source={require('./assets/avater.jpg')}
                        activeOpacity={1}
                    />
                }
            </View>

            <TouchableOpacity
                activeOpacity={0.5}

                onPress={() => captureImage()}>
                <Text >
                    Launch Camera for Image
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}

                onPress={() => chooseitem()}>
                <Text >Choose Image</Text>
            </TouchableOpacity>
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
    },
    imageStyle: {
        width: 200,
        height: 200,
        margin: 5,
        borderRadius: 100
    },
});









