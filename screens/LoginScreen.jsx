import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import { TextInput } from 'react-native'
import { createUser, getUserLogin, publishUser } from '../services/graphql'
import { useRecoilState, useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE } from 'recoil';
import { sesionAtom } from '../atoms/sesionAtom'
import { Image } from 'react-native'
import MapView from 'react-native-maps'
import { darkMap } from '../services/map'
import { Icon } from '@rneui/base'

import Alert from '../components/Alert'
import { themeAtom } from '../atoms/themeAtom'
import { Touchable } from 'react-native'
import { alertAtom } from '../atoms/alertAtom'

const LoginScreen = ({ navigation }) => {

    const [sesion, setSesion] = useRecoilState(sesionAtom)


    {/* Setting up the basics variables and references*/ }
    const [login, setLogin] = useState(true)
    const [loader, setLoader] = useState(false)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [number, setNumber] = useState('')
    const [theme, setTheme] = useRecoilState(themeAtom)

    {/* Cheking if the user is login */ }
    

    const [alert, setAlert] = useRecoilState(alertAtom)

    //alert handler
    const handlingAlert = (data, status) => {
        setAlert({
            text: data,
            type: status,
            show: true,
        })
        setTimeout(() => {
            setAlert(false)
        }, 2500)

    }
   

    {/* Requesting new user */ }
    const newUser = () => {
        if (!name || !password || !number) return
        setAlert(false)
        createUser(name, number, password).then(data => {
            publishUser(data.id).then(() => {
                setSesion({
                    name: data.name,
                    number: data.phone,
                    password: data.password,
                    id: data.id,
                    type: data.type
                })
                setLoader(false)
                handlingAlert('Cuenta creada correctamente', true)
                setTimeout(() => navigation.navigate('MapScreen'), 1500)
                return
            })
        }).catch(function (error) {
            setLoader(false)
            handlingAlert('Compruebe su conexion a internet e intentelo nuevamente', false)
            return
        });
    }



    {/* function to login user */ }
    const loginUser = () => {
        if (!number || !password) return
        setLoader(true)
        getUserLogin(number, password).then(data => {
            setLoader(false)
            if(data.length === 0) {
                handlingAlert('Este usuario no existe', false)
                return
            }
            setSesion({
                name: data[0].name,
                number: data[0].phone,
                password: data[0].password,
                id: data[0].id,
                type: data[0].type
            })
            handlingAlert('Cuenta cargada correctamente', true)
            setTimeout(() => navigation.navigate('MapScreen'), 1500)
            return
        }).catch(function (error) {
           handlingAlert('Un error ha ocurrido, inténtelo nuevamente', false)
        });
        

    }
    return (
        <View style={tw`w-full h-full bg-white flex  items-center `}>
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
            <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}><Image style={tw`w-[140px] h-[140px] -mt-[80px] rounded-full `} source={require('../assets/logo.jpg')} /></TouchableOpacity >

            <ScrollView style={tw`flex p-5 h-4/6 left-2 right-2 flex-1 z-10 bg-white pt-5  `} >



                <Text style={tw`text-left  w-full font-bold text-[30px] pl-2`}>
                    {login ? 'Iniciar Sesión' : 'Crear Cuenta '}
                </Text>


                <View style={tw`pt-2`}>
                    {!login &&
                        <View style={tw`flex-row items-center`} >
                            <Icon
                                type='antdesign' color='black' size={20} name='user'
                            />

                            <TextInput
                                value={name}
                                onChangeText={text => setName(text)}
                                editable
                                maxLength={40}
                                placeholder='Nombre Completo'
                                style={tw`min-w-[300px] p-2 text-[18px] border-b border-[#eee] `}
                            />
                        </View>}

                    <View style={tw`flex-row items-center`} >
                        <Icon
                            type='antdesign' color='black' size={20} name='phone'
                        />

                        <TextInput
                            value={number}
                            onChangeText={text => setNumber(text)}
                            editable
                            maxLength={8}
                            placeholder='Número de Teléfono'
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

                    <TouchableOpacity onPress={() => setLogin(!login)} style={tw` flex-row items-center font-semibold rounded-lg border px-4 `} >

                        <Icon
                            style={tw` rounded-lg mr-3 py-3 `}
                            type='antdesign' color='black' size={30} name={login ? 'addusergroup' : 'login'}
                        />

                        <Text style={tw`text-black `} > {login ? 'Crear cuanta' : 'Iniciar Sesión'} </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={login ? loginUser : newUser} style={tw` flex flex-row items-center  px-4 bg-[#333] rounded-lg `} >

                        {!loader ? <View style={tw` flex flex-row items-center `}>
                            <Text style={tw`text-[14px] text-white `} > Continuar</Text>


                            <Icon
                                style={tw`p-3 pl-1 pr-0 `}
                                type='materialicons' color='white' background='white' size={30} name='navigate-next'
                            />
                        </View> : <ActivityIndicator size="large" color="white" />
                        }

                    </TouchableOpacity>

                </View>

                <TouchableOpacity style={tw`my-4 p-3 pl-0 items-center flex-row rounded-md  `} onPress={() => navigation.navigate('DriverLogin')}>
                    <Icon
                        type='fontisto' color='black' size={30} name='car'
                    />
                    <Text style={tw`font-bold pl-2 text-[18px]`} >Iniciar sesión como chofer</Text>
                </TouchableOpacity>

            </ScrollView>








        </View>
    )
}

export default LoginScreen

