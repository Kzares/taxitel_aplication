import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import { TextInput } from 'react-native'
import { loginAdmin  } from '../services/graphql'
import { useRecoilState } from 'recoil';
import { sesionAtom } from '../atoms/sesionAtom'
import { Image } from 'react-native'
import MapView from 'react-native-maps'
import { darkMap } from '../services/map'
import { Icon } from '@rneui/base'

import Alert from '../components/Alert'
import { themeAtom } from '../atoms/themeAtom'

const AdminLogin = ({ navigation }) => {

    const [sesion, setSesion] = useRecoilState(sesionAtom)


    {/* Setting up the basics variables and references*/ }
    const [loader, setLoader] = useState(false)
    const [password, setPassword] = useState('')
    const [number, setNumber] = useState('')
    const [alert, setAlert] = useState(false)
    const [alertText, setAlertText] = useState('')
    const [theme, setTheme] = useRecoilState(themeAtom)
    const [alertStatus, setAlertStatus] = useState(false)



    //Handling Alert

    const handlingAlert = (data, status) => {
        setAlertText(data)
        setAlertStatus(status)
        setAlert(true)
        setTimeout(() => {
            setAlert(false)
        }, 2500)

    }

    //admin Login
    const login = () => {
        if (!number || !password) return
        setLoader(true)
      
        loginAdmin(number, password).then(data => {
            console.log(data)
            setSesion({
                name: data.name,
                number: data.phone,
                password: data.password,
                id: data.id,
                type: 'admin',
            })
            console.log('all god')
            handlingAlert('Cuenta cargada correctamente', true)
            setTimeout(() => navigation.navigate('AdminScreen'), 1000)
            return       
         }).catch(function (error) {
            if (error.response) {
                setLoader(false)
                handlingAlert('Compruebe su conexion a internet e intentelo nuevamente',false)
                console.log(error.response)
            } else if (error.request) {
                setLoader(false)
                handlingAlert('Compruebe su conexion a internet e intentelo nuevamente', false)
                console.log(error.request)

            } else {
                setLoader(false)
                handlingAlert('Usuario no existente', false)
                console.log(error)

            }

        });
        setTimeout(() => {
            setLoader(false)
            handlingAlert('Compruebe su conexion a internet e intentelo nuevamente', false)
            return
        }, 7000) 
    }


 
    return (
        <View style={tw`w-full h-full bg-white flex  items-center `}>

            {alert && <Alert alertStatus={alertStatus} text={alertText} />}

            <MapView
                customMapStyle={theme === 'black' ? darkMap : []}
                style={tw` w-full h-2/6 `}
                initialRegion={{
                    latitude: 23.13302,
                    longitude: -82.38304,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            />
            <Image style={tw`w-[140px] h-[140px] -mt-[80px] rounded-full `} source={require('../assets/logo.jpg')} />

            <ScrollView style={tw`flex p-5 h-4/6 left-2 right-2 flex-1 z-10 bg-white pt-5  `} >



                <Text style={tw`text-left  w-full font-bold text-[25px] pl-2`}>
                    Logear como admin
                </Text>


                <View style={tw`pt-2`}>

                    <View style={tw`flex-row items-center`} >
                        <Icon
                            type='antdesign' color='black' size={20} name='phone'
                        />

                        <TextInput
                            value={number}
                            onChangeText={text => setNumber(text)}
                            editable
                            maxLength={8}
                            placeholder='Numero de Telefono'
                            keyboardType="numeric"
                            style={tw`min-w-[300px] p-2 text-[18px] border-b border-[#eee] `}
                        />
                    </View>

                    <View style={tw`flex-row items-center`} >
                        <Icon
                            type='antdesign' color='black' size={20} name='unlock'
                        />

                        <TextInput
                            value={password}
                            onChangeText={text => setPassword(text)}
                            editable
                            maxLength={40}
                            placeholder='Contraseña'
                            style={tw`min-w-[300px] p-2 text-[18px] border-b border-[#eee] `}

                        />
                    </View>

                </View>


                <View style={tw`flex flex-row justify-between  pt-4`} >

                    
                    <TouchableOpacity style={tw` py-4 flex flex-row items-center justify-center w-full px-4 bg-[#333] rounded-lg `} onPress={login} >

                        {!loader ? <View style={tw` flex flex-row items-center `}>
                            <Text style={tw`text-[14px] text-white `} > Continuar</Text>


                            <Icon
                                style={tw` pl-1 pr-0 `}
                                type='materialicons' color='white' background='white' size={30} name='navigate-next'
                            />
                        </View> : <ActivityIndicator size="large" color="white" />
                        }

                    </TouchableOpacity>

                </View>

                <TouchableOpacity style={tw`my-4 p-3 pl-0 items-center flex-row rounded-md  `} onPress={() => navigation.navigate('LoginScreen')}>
                    <Icon
                        type='entypo' color='black' size={30} name='user'
                    />
                    <Text style={tw`font-bold pl-2 text-[18px]`} >Iniciar sesion como cliente</Text>
                </TouchableOpacity>

            </ScrollView>








        </View>
    )
}

export default AdminLogin

