import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/base'
import { Image } from 'react-native'
import axios from 'axios'
import { useRecoilState } from 'recoil'
import { destinationAtom, destinationDescriptionAtom, originAtom, originDescriptionAtom, selectedDestination, showDestinationAtom } from '../atoms/locationAtoms'
import { postTravel, publishTravel } from '../services/graphql'
import { sesionAtom } from '../atoms/sesionAtom'
import Alert from '../components/Alert'
import { themeAtom } from '../atoms/themeAtom'
import MapView, { Marker } from 'react-native-maps'
import { darkMap } from '../services/map.js';
import { useRef } from 'react'
import CalendarPicker, { Calendar } from 'react-native-calendar-picker';
import moment from 'moment'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { TextInput } from 'react-native'
import { alertAtom } from '../atoms/alertAtom'

const TripScreen = ({ navigation }) => {

    //Setting up the navigator
    const Stack = createNativeStackNavigator();


    {/* States and globals */ }
    const [origin, setOrigin] = useRecoilState(originAtom)
    const [destination, setDestination] = useRecoilState(destinationAtom)
    const [sesion, setSesion] = useRecoilState(sesionAtom)
    const [originDescription, setOriginDescription] = useRecoilState(originDescriptionAtom)
    const [destinationDescription, setDestinationDescription] = useRecoilState(destinationDescriptionAtom)
    const [selectDestination, setSelectDestination] = useRecoilState(selectedDestination)
    const [showDestination, setShowDestination] = useRecoilState(showDestinationAtom);
    const [theme, setTheme] = useRecoilState(themeAtom)
    const [calendarDay, setCalendarDay] = useState(null)


    const [travel, setTravel] = useState(false)
    const [open, setOpen] = useState(false)
    const [loader, setLoader] = useState(false)

    {/* Getting the travel info */ }
    const getTravelTime = async () => {
        try {
            await axios.get(`https://api.radar.io/v1/route/distance?origin=${origin.latitude}%2C${origin.longitude}&destination=${destination.latitude}%2C${destination.longitude}&modes=car&units=metric`, {
                headers: {
                    'Authorization': 'prj_test_pk_56b7b80783bb75bad408ff3ddaca23c9ecd609e2'
                }
            }).then(data => setTravel(data.data.routes))
        } catch (e) {
            getTravelTime()
        }
    }


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
        }, 4500)

    }

    //Getting the trabvel information
    useEffect(() => {
        if (!origin || !destination) return
        getTravelTime()
    }, []);
    {/* Submiting a inmediate Post */ }
    const submitPost = () => {
        setLoader(true)
        setAlert(false)
        postTravel(sesion.name, sesion.number, sesion.id, destination.latitude, destination.longitude, origin.latitude, origin.longitude, (parseInt((travel.car.distance.value / 1000) * 75)), travel.car.distance.text, travel.car.duration.text, 'Pendiente', originDescription.city, originDescription.state, originDescription.formattedAddress, destinationDescription.formattedAddress, 'Inmediato', null,null )
            .then((data) => {
                publishTravel(data.id).then(() => {
                    handlingAlert('Viaje Correctamente Publicado', true)
                    setLoader(false)
                    setOrigin({})
                    setDestination({})
                    setOriginDescription({})
                    setDestinationDescription({})
                    setShowDestination(false)
                    setSelectDestination(false)
                    setTimeout(() => navigation.navigate('MapScreen'), 2500)
                }).catch((err) => {
                    handlingAlert('Compruebe su conexión a internet e inténtelo nuevamente', false)
                    setLoader(false)

                })

            })
            .catch(function (error) {
                handlingAlert('Compruebe su conexión a internet e inténtelo nuevamente', false)
                setLoader(false)
                return
            });
        

    }

    //Reserving a designed Trip
    const reservPost = () => {
        setLoader(true)
        setAlert(false)
        postTravel(sesion.name, sesion.number, sesion.id, destination.latitude, destination.longitude, origin.latitude, origin.longitude, (parseInt((travel.car.distance.value / 1000) * 75)), travel.car.distance.text, travel.car.duration.text, 'Pendiente', originDescription.city, originDescription.state, originDescription.formattedAddress, destinationDescription.formattedAddress, 'Reserva', calendarDay, ` ${hours} : ${minutes} ${amPm}` )
            .then((data) => {
                publishTravel(data.id).then(() => {
                    handlingAlert('Viaje Correctamente Publicado', true)
                    setLoader(false)
                    setDestination({})
                    setOrigin({})
                    setOriginDescription({})
                    setDestinationDescription({})
                    setShowDestination(false)
                    setSelectDestination(false)
                    setTimeout(() => navigation.navigate('MapScreen'), 2500)
                    return
                }).catch((err) => {
                    handlingAlert('Compruebe su conexión a internet e inténtelo nuevamente', false)
                    setLoader(false)
                    return

                })

            })
            .catch(function (error) {
                handlingAlert('Compruebe su conexión a internet e inténtelo nuevamente', false)
                setLoader(false)
                return
            });
        

    }

    const mapRef = useRef()
    useEffect(() => {
        setTimeout(() => {
            mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
            })
        }, 500)
    }, [])

    ///////////////////////////////////** render components **///////////////////////////

    const onDateChange = date => {
        setCalendarDay(date)
        navigation.navigate('TimePicker')
    }

    const MainData = ({ navigation }) => {
        return (
            <View style={tw`h-2/5 `} >
                <Text style={tw`text-center text-lg pt-3 `} >Cuando Partimos?</Text>

                <View style={tw`flex flex-row items-center justify-evenly`} >

                    <View style={tw`flex items-center flex-1`} >
                        <Image style={{ width: 80, height: 80, resizeMode: 'contain' }} source={{ uri: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_485,h_385/f_auto,q_auto/products/carousel/UberX.png' }} />
                        <Text style={tw`font-semibold text-[15px] `}> {travel.car.distance.text} </Text>
                    </View>

                    <View style={tw`flex items-center flex-1`}  >
                        <Icon
                            style={tw`p-3 `}
                            type='antdesign' color='black' size={30} name='clockcircleo'
                        />
                        <Text style={tw`font-semibold text-[15px] mt-2`}> Estmado: {travel.car.duration.text} </Text>

                    </View>

                    <View style={tw`flex items-center flex-1 mt-5`}  >
                        <Icon
                            style={tw`p-3`}
                            type='fontawesome' size={30} color='black' name='attach-money'
                        />
                        <Text style={tw`font-semibold text-[15px] mt-2`}> {parseInt((travel.car.distance.value / 1000) * 75)} $ </Text>

                    </View>

                </View>


                <View style={tw`flex flex-row justify-between p-4`} >

                    <TouchableOpacity style={tw` flex flex-row items-center  px-5 bg-[#333] rounded-full shadow-lg `} onPress={() => navigation.navigate('DatePicker')} >

                        <Icon
                            style={tw` rounded-lg mr-3 py-3 `}
                            type='antdesign' color='white' size={30} name='calendar'
                        />
                        <Text style={tw`text-white`} >Reserva </Text>

                    </TouchableOpacity>


                    {!loader ?
                        <TouchableOpacity onPress={submitPost} style={tw` flex-row items-center font-semibold`} >

                            <Text style={tw`text-[14px] `} > Solicitar Conductor</Text>


                            <Icon
                                style={tw`p-3 pl-1 `}
                                type='materialicons' color='black' background='white' size={30} name='navigate-next'
                            />

                        </TouchableOpacity> :
                        <ActivityIndicator size="large" style={tw`pr-5`} color="#000000" />
                    }

                </View>


            </View>
        )
    }

    const DatePicker = () => {
        return (
            <ScrollView>
                <CalendarPicker style={tw`w-full h-full`}
                    onDateChange={onDateChange}
                    previousTitle="Anterior"
                    nextTitle="Próximo"
                />
            </ScrollView>
        )
    }
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [amPm, setAmPm] = useState('AM');

    const TimePicker = () => {

        const increaseHours = () => {
            if (hours < 12) {
                setHours(hours + 1);
            }
        };

        const decreaseHours = () => {
            if (hours > 0) {
                setHours(hours - 1);
            }
        };

        const increaseMinutes = () => {
            if (minutes < 59) {
                setMinutes(minutes + 1);
            }
        };

        const decreaseMinutes = () => {
            if (minutes > 0) {
                setMinutes(minutes - 1);
            }
        };

        const toggleAmPm = () => {
            if (amPm === 'AM') {
                setAmPm('PM');
            } else {
                setAmPm('AM');
            }
        };

        return (
            <ScrollView style={tw`bg-white flex-1 `} >
                <View style={tw`mt-6`} >
                    <Text style={tw`text-lg text-center font-bold py-4 border border-b border-[#eee] `} >{hours} : {minutes} {amPm}</Text>
                </View>
                <View >

                    <View style={tw`mt-5 flex-row justify-between items-center px-3`} >
                        <View style={tw`items-center flex-row`}>
                            <TouchableOpacity style={tw`bg-black px-4 py-1 rounded-full mr-3`} onPress={increaseHours}>
                                <Text style={tw`text-[35px] text-white `} >+</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={tw`bg-black px-5 py-1 rounded-full`} onPress={decreaseHours}>
                                <Text style={tw`text-[35px] text-white `} >-</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={tw`flex-row justify-between items-center px-3`} >
                            <TouchableOpacity style={tw`bg-black px-4 py-1 rounded-full mr-3`} onPress={increaseMinutes}>
                                <Text style={tw`text-[35px] text-white `} >+</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={tw`bg-black px-5 py-1 rounded-full`} onPress={decreaseMinutes}>
                                <Text style={tw`text-[35px] text-white `} >-</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={toggleAmPm}>
                            <Text style={tw`font-bold text-lg`} >AM/PM</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={tw`mt-5 mx-5 shadow-sm rounded-xl py-3`} onPress={() => navigation.navigate('ConfirmTrip')} >
                        <Text style={tw`text-center font-semibold text-lg `} >Continuar</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        )
    }

    const ConfirmTrip = () => {
        return (
            <View style={tw`h-2/5 `} >
                <Text style={tw`text-center text-lg pt-3 `} >Programado para: <Text style={tw`font-bold text-[16px] `} >{moment(calendarDay).format('DD MMM YYYY')}</Text> </Text>

                <View style={tw`flex flex-row items-center justify-evenly`} >

                    <View style={tw`flex items-center flex-1`} >
                        <Image style={{ width: 80, height: 80, resizeMode: 'contain' }} source={{ uri: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_485,h_385/f_auto,q_auto/products/carousel/UberX.png' }} />
                        <Text style={tw`font-semibold text-[15px] `}> {travel.car.distance.text} </Text>
                    </View>

                    <View style={tw`flex items-center flex-1`}  >
                        <Icon
                            style={tw`p-3 `}
                            type='antdesign' color='black' size={30} name='clockcircleo'
                        />
                        <View style={tw`font-semibold text-[15px] `}>
                            <Text>Recogida</Text>
                            <Text style={tw`font-bold text-center`} > {hours} : {minutes} {amPm}</Text>
                        </View>

                    </View>

                    <View style={tw`flex items-center flex-1 mt-5`}  >
                        <Icon
                            style={tw`p-3`}
                            type='fontawesome' size={30} color='black' name='attach-money'
                        />
                        <Text style={tw`font-semibold text-[15px] mt-2`}> {parseInt((travel.car.distance.value / 1000) * 75)} $ </Text>

                    </View>

                </View>


                <View style={tw`flex flex-row justify-between p-4`} >

                    <TouchableOpacity style={tw` flex flex-row items-center  px-5 bg-[#333] rounded-full shadow-lg `} onPress={() => navigation.navigate('MainData')} >

                        <Icon
                            style={tw` rounded-lg mr-3 py-3 `}
                            type='antdesign' color='white' size={20} name='left'
                        />
                        <Text style={tw`text-white`} >Cancelar </Text>

                    </TouchableOpacity>


                    {!loader ?
                        <TouchableOpacity onPress={reservPost} style={tw` flex-row items-center font-semibold`} >

                            <Text style={tw`text-[14px] `} > Solicitar Conductor</Text>


                            <Icon
                                style={tw`p-3 pl-1 `}
                                type='materialicons' color='black' background='white' size={30} name='navigate-next'
                            />

                        </TouchableOpacity> :
                        <ActivityIndicator size="large" style={tw`pr-5`} color="#000000" />
                    }

                </View>


            </View>
        )
    }


    /////////////////////////////////////////////////Main component/////////////////

    return (
        <View style={tw`h-full w-full bg-white`} >


            {travel ?
                <>

                    <View style={tw`h-3/5 z-0`}>
                        <MapView
                            ref={mapRef}
                            customMapStyle={theme === 'black' ? darkMap : []}
                            style={tw`flex-1`}
                            initialRegion={{
                                latitude: origin.latitude,
                                longitude: origin.longitude,
                                latitudeDelta: 0.003,
                                longitudeDelta: 0.003,
                            }}

                        >
                            <Marker
                                coordinate={{
                                    latitude: destination.latitude,
                                    longitude: destination.longitude,
                                }}
                                title='Destino'
                                description={destination.description}
                                identifier='destination'
                                pinColor='green'
                            />


                            <Marker
                                title='Origen'
                                description={origin.description}
                                identifier='origin'
                                coordinate={{
                                    latitude: origin.latitude,
                                    longitude: origin.longitude,
                                }}

                            />

                        </MapView>
                    </View>

                    <Stack.Navigator>
                        <Stack.Screen
                            name='MainData'
                            component={MainData}
                            options={{
                                headerShown: false
                            }} />
                        <Stack.Screen
                            name='DatePicker'
                            component={DatePicker}
                            options={{
                                headerShown: false
                            }} />
                        <Stack.Screen
                            name='TimePicker'
                            component={TimePicker}
                            options={{
                                headerShown: false
                            }} />
                        <Stack.Screen
                            name='ConfirmTrip'
                            component={ConfirmTrip}
                            options={{
                                headerShown: false
                            }} />
                    </Stack.Navigator>


                </> : <View style={tw`flex-1 justify-center items-center`} >
                    <ActivityIndicator size="large" color="#000000" />
                </View>}


        </View>
    )
}

export default TripScreen


