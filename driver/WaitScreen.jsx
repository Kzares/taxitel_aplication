import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { sesionAtom } from '../atoms/sesionAtom'
import { useRecoilState } from 'recoil'
import { checkDiver } from '../services/graphql'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'

const WaitScreen = ({ navigation }) => {
    const [sesion, setSesion] = useRecoilState(sesionAtom)
    const [status, setStatus] = useState(false)
    console.log(sesion)


    const fetchUser = () => {
        checkDiver(sesion.id)
            .then((data) => {
                console.log(data)
                if (data) {
                    setSesion({
                        name: data.name,
                        number: data.phone,
                        password: data.password,
                        id: data.id,
                        type: 'driver',
                        checked: true
                    })
                    navigation.navigate('DriverScreen')
                    return
                } else {
                    setStatus(true)
                }
            })
            .catch((err) => {
                console.log(err)
                fetchUser()
            }
            )
    }


    useEffect(() => {
        fetchUser()
    }, []);

    const closeSesion = () => {
        setSesion({})
        setTimeout(() => navigation.navigate('DriverLogin'), 500
        )
    }
    return (
        <SafeAreaView style={tw`flex-1 items-center bg-white justify-center`} >

            {status ? <Text style={tw`text-[17px] font-semibold text-center`} >Su solicitud todavia no ha sido aceptada, intentelo mas tarde</Text> : <View>
                <Text style={tw`text-[20px] font-bold mb-8`} >Su solicitud esta siendo procesada</Text>
                <ActivityIndicator size="large" color="black" />
            </View>}

            <TouchableOpacity style={tw`absolute top-8 left-3 flex-row items-center`} onPress={() => closeSesion()} >
                <Icon
                    type='antdesign' color='black' name='arrowleft' size={16} style={tw`mr-1`}
                />
                <Text>Regresar</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default WaitScreen

