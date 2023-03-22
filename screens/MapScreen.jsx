import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRecoilState } from 'recoil';
import tw from 'twrnc';
import { originAtom, selectedDestination, showDestinationAtom } from '../atoms/locationAtoms';
import { modalAtom } from '../atoms/modalAtom';
import { sesionAtom } from '../atoms/sesionAtom';
import { themeAtom } from '../atoms/themeAtom';
import Alert from '../components/Alert';
import ClientMenu from '../components/ClientMenu';
import Map from '../components/Map';
import Selector from '../components/Selector';
import { Motion } from '@legendapp/motion'
import * as Location from 'expo-location'

const MapScreen = ({ navigation }) => {
    //Accesing to actual location
    const [location, setLocation] = useState({})
    const [popUp, setPopUp] = useState(true)
    const [origin, setOrigin] = useRecoilState(originAtom)

    const getPermisions = async () => {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            await Location.requestPermissionsAsync();
        }

        let currentLocation = await Location.getCurrentPositionAsync({})
        setLocation(currentLocation)
        console.log(currentLocation.coords)
        setOrigin({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            description: '',
        })
        setTimeout(() => setOrigin({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            description: 'Ubicacion Actual',
        }), 1)
        setPopUp(false)
    }


    //states and globals
    const [selectDestination, setSelectDestination] = useRecoilState(selectedDestination)
    const [showDestination, setShowDestination] = useRecoilState(showDestinationAtom);
    const [theme, setTheme] = useRecoilState(themeAtom)
    const [modal, setModal] = useRecoilState(modalAtom)
    const [sesion, setSesion] = useRecoilState(sesionAtom)

    const [clearAutocomplete, setClearAutocomplete] = useState('')
    const [show, setShow] = useState(false)

    const Stack = createNativeStackNavigator();

    useEffect(() => {
        if (!sesion.name) {
            navigation.navigate('LoginScreen')
        }
    }, [sesion])

    //handling alerts
    const [alert, setAlert] = useState(false)
    const [alertText, setAlertText] = useState('')

    const handlingAlert = (text) => {
        setAlertText(text)
        setAlert(true)
        setTimeout(() => setAlert(false), 3500)
    }

    //Tabs for the map

    const NavTab = () => {
        {/* Navigation Buttons */ }
        return (
            <View style={tw`absolute bottom-2 right-2 flex flex-row `} >

                {selectDestination && <TouchableOpacity >
                    <Icon
                        style={tw`p-3 bg-white rounded-lg w-13 shadow-lg`}
                        type='antdesign' color='black' name='arrowleft'
                        onPress={() => { setSelectDestination(false); setClearAutocomplete('back') }}
                    />
                </TouchableOpacity>}

                <TouchableOpacity onPress={() => setPopUp(true)} >
                    <Icon
                        style={tw`p-3 bg-white rounded-lg ml-4 w-13 shadow-lg`}
                        type='foundation' color='black' name='marker' size={27}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShow(true)} >
                    <Icon
                        style={tw`p-3 bg-white rounded-lg w-13 mx-4 shadow-lg`}
                        type='ionicon' color='black' name='move'
                    />
                </TouchableOpacity>

                <TouchableOpacity>
                    {selectDestination ? <View>
                        {showDestination ? <Icon
                            style={tw`p-3 bg-white rounded-lg w-13 shadow-lg`}
                            type='ionicon' color='green' name='checkmark'
                            onPress={() => navigation.navigate('TripScreen')}
                        /> : <Icon
                            style={tw`p-3 bg-white rounded-lg w-13 shadow-lg`}
                            size={25}
                            type='materialcommunityicons' color='red' name='cancel'
                            onPress={() => handlingAlert('Debes de seleccionar una ubicacion de destino válida')}
                        />}
                    </View>
                        : <Icon
                            style={tw`p-3 bg-white rounded-lg w-13 shadow-lg`}
                            type='antdesign' color='black' name='arrowright'
                            onPress={origin.latitude ? () => { setSelectDestination(true); setClearAutocomplete('next') } : () => handlingAlert('Debes de seleccionar una ubicacion de origen valida')}

                        />}
                </TouchableOpacity>

            </View>
        )
    }
    const BtnTab = () => {
        return (
            <View style={tw`absolute bottom-1/3 right-0 flex`}>
                <TouchableOpacity style={tw`bg-white rounded-full shadow-lg`} onPress={() => setModal(true)}>
                    <Icon
                        style={tw`p-3 bg-white rounded-full w-13  shadow-lg`}
                        type='feather' color='black' name='menu'
                    />
                </TouchableOpacity>

                <TouchableOpacity >
                    {theme === 'black' ? <Icon
                        style={tw`p-3 bg-white rounded-full w-13 mt-4 shadow-lg`}
                        type='feather' color='black' name='sun'
                        onPress={() => setTheme('ligth')}
                    /> :
                        <Icon
                            style={tw`p-3 bg-white rounded-full w-13 mt-4 shadow-lg`}
                            type='feather' color='black' name='moon'
                            onPress={() => setTheme('black')}
                        />}
                </TouchableOpacity>
            </View>
        )
    }






    return (
        <View>
            {alert && <TouchableOpacity style={tw`absolute flex items-center justify-center top-0 w-full h-full left-0 right-0 z-20 bg-black/20`} onPress={() => setAlert(false)} >
                <Motion.View
                    initial={{ y: -50, opacity: 0, scale: .7 }}
                    transition={{ type: 'spring' }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    style={tw`bg-white p-7 pt-4 rounded-lg shadow-lg mx-6`} >

                    <Icon
                        type='entypo' color='black' name='emoji-sad' size={40}
                        style={tw`pb-3`}
                    />

                    <Text style={tw`text-center`} >
                        {alertText}
                    </Text>
                </Motion.View>
            </TouchableOpacity>}

            {show &&
                <TouchableOpacity style={tw`absolute flex items-center justify-center top-0 w-full h-full left-0 right-0 z-20 bg-black/20`} onPress={() => setShow(false)} >
                    <Motion.View
                        initial={{ y: -50, opacity: 0, scale: .7 }}
                        transition={{ type: 'spring' }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        style={tw`bg-white p-7 pt-4 rounded-lg shadow-lg mx-6`} >

                        <Icon
                            type='foundation' color='black' name='marker' size={40}
                            style={tw`pb-3`}
                        />

                        <Text style={tw`text-center`} >
                            Para Seleccionar el {selectDestination ? 'destino' : 'origen'} de su viaje puede presionar en cualquier parte del mapa lo cual lo seleccionará
                        </Text>
                    </Motion.View>
                </TouchableOpacity>}

            {popUp &&
                <Motion.View
                    initial={{ opacity: 0 }}
                    transition={{ type: 'spring' }}
                    animate={{ opacity: 1 }}
                    style={tw`absolute flex items-center justify-center top-0 w-full h-full left-0 right-0 z-20 bg-black/20`}>
                    <Motion.View
                        initial={{ y: -50, opacity: 0, scale: .7 }}
                        transition={{ type: 'spring' }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        style={tw`bg-white p-7 pt-4 rounded-lg shadow-lg mx-6`} >

                        <Icon
                            type='foundation' color='black' name='marker' size={40}
                            style={tw`pb-3`}
                        />

                        <Text style={tw`text-center  font-semibold `} >
                            Deseas que el punto de partida sea tu ubicación actual?
                        </Text>

                        <View style={tw`flex flex-row pt-7 items-center justify-between px-3`} >

                            <TouchableOpacity onPress={() => setPopUp(false)}><Text style={tw` px-4 py-3 text-[14px] text-white bg-black rounded-lg `} >Cancelar</Text></TouchableOpacity>
                            <TouchableOpacity onPress={getPermisions} ><Text style={tw` px-4 py-3 text-[14px] rounded-lg border border-[#000] font-semibold `} >Aceptar</Text></TouchableOpacity>

                        </View>

                    </Motion.View>
                </Motion.View>}

            <View style={tw`h-full z-0`}>
                <Map />
            </View>

            <Selector clearAutocomplete={clearAutocomplete} />

            <NavTab />
            <BtnTab />


            {/* Modal Atom */}

            {modal &&
                <Motion.View
                    initial={{ y: 500, opacity: 0 }}
                    transition={{ type: 'spring' }}
                    animate={{ y: 0, opacity: 1 }}
                    style={tw`absolute top-8 rounded-lg bg-white w-full h-full`}>
                    <Icon
                        style={tw`m-4 ml-2 w-10`}
                        type='ionicon' color='black' size={28} name='close'
                        onPress={() => setModal(false)}
                    />
                    <ClientMenu />
                </Motion.View>

            }



        </View>
    );
}

const styles = StyleSheet.create({})

export default MapScreen;
