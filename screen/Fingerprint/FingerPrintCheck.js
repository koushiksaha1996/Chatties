
import LottieView from 'lottie-react-native'
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import ReactNativeBiometrics from 'react-native-biometrics'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function FingerPrintCheck(props) {
    let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
    let payload = epochTimeSeconds + 'some message'
    useEffect(() => {
        ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
            .then((resultObject) => {
                const { success } = resultObject

                if (success) {
                    console.log('successful biometrics provided', resultObject)
                    props.navigation.replace("Daskboard")
                } else {
                    console.log('user cancelled biometric prompt')
                }
            })
            .catch(() => {
                console.log('biometrics failed')
            })
    }, [])
    const click = () => {
          ReactNativeBiometrics.isSensorAvailable()
        .then((resultObject) => {
          const { available, biometryType } = resultObject

          if (available && biometryType === ReactNativeBiometrics.TouchID) {
            console.log('TouchID is supported')
          } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
            console.log('FaceID is supported')
          } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
            console.log('Biometrics is supported',available,biometryType)
          } else {
            console.log('Biometrics not supported')
          }
        })



        // ReactNativeBiometrics.createKeys('Confirm fingerprint')
        // .then((resultObject) => {
        //   const { publicKey } = resultObject
        //   console.log("public key",publicKey)
        //   //sendPublicKeyToServer(publicKey)
        // })
        // ReactNativeBiometrics.biometricKeysExist()
        // .then((resultObject) => {
        //   const { keysExist } = resultObject

        //   if (keysExist) {
        //     console.log('Keys exist')
        //   } else {
        //     console.log('Keys do not exist or were deleted')
        //   }
        // })


        // ReactNativeBiometrics.createSignature({
        //     promptMessage: 'Sign in',
        //     payload: payload
        //   })
        //   .then((resultObject) => {
        //     const { success, signature } = resultObject

        //     if (success) {
        //       console.log(signature)
        //       //verifySignatureWithServer(signature, payload)
        //     }
        //   })

        ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
            .then((resultObject) => {
                const { success } = resultObject

                if (success) {
                    console.log('successful biometrics provided', resultObject)
                    props.navigation.replace("Daskboard")
                } else {
                    console.log('user cancelled biometric prompt')
                }
            })
            .catch(() => {
                console.log('biometrics failed')
            })

    }
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

            <TouchableOpacity onPress={() => click()}>
                <LottieView
                    style={{ width: 200, height: 200 }}
                    source={require('./finger.json')}
                    autoPlay
                    loop
                />
            </TouchableOpacity>

            {/* <Button
                title="Solid Button"
            />

            <Button
                title="Outline button"
                type="outline"
            />

            <Button
                title="Clear button"
                type="clear"
            />

            <Button
                icon={
                    <Icon name="rocket" size={30} color="#900" />
                }
                title="Button with icon component"
            />

            <Button
                icon={{
                    name: "arrow-right",
                    size: 15,
                    color: "white"
                }}
                title="Button with icon object"
            />

            <Button
                icon={
                    <Icon
                        name="arrow-right"
                        size={15}
                        color="white"
                    />
                }
                iconRight
                title="Button with right icon"
            />

            <Button
                title="Loading button"
                loading
            />
            <Icon.Button
                name="facebook"
                backgroundColor="#3b5998"
            >
                Login with Facebook
            </Icon.Button> */}
        </View>
    )
}
