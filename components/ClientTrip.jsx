import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { userTripAtom } from '../atoms/userTripAtom'
import { ScrollView } from 'react-native'
import tw from 'twrnc'
import MapView, { Marker } from 'react-native-maps'
import { TouchableOpacity } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { Icon } from '@rneui/base'
import { cancelTrip, endTrip, publishTravel } from '../services/graphql'
import Alert from './Alert'
import moment from 'moment'
import { useRef } from 'react'
import { useEffect } from 'react'
import { alertAtom } from '../atoms/alertAtom'

const ClientTrip = ({ navigation }) => {

    const [trip, setTrip] = useRecoilState(userTripAtom)
    const [loader, setLoader] = useState(false)
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


    const cancel = () => {
        setLoader(true)
        cancelTrip(trip.id).then(() => publishTravel(trip.id).then(() => {
            handlingAlert('Viaje cancelado satisfactoriamente', true)
            setLoader(false)
            setTimeout(() => {
                navigation.navigate('ClientTrips')
            }, 2500)
            return
        })).catch(e => {
            console.log(e)
            handlingAlert('Algo falló, inténtelo nuevamente', false)
            return
        })
    }

    const mapRef = useRef()
    useEffect(() => {
        setTimeout(() => {
            mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
            })
        }, 500)
    }, [])

    return (
        <View style={tw`flex-1 bg-white `} >

            <View style={tw`w-full h-[300px]`} >
                <MapView
                    ref={mapRef}
                    style={tw`flex-1`}
                    initialRegion={{
                        latitude: parseFloat(trip.originLatitude),
                        longitude: parseFloat(trip.originLongitude),
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: parseFloat(trip.originLatitude),
                            longitude: parseFloat(trip.originLongitude),
                        }}
                        title='Recojida de cliente'
                        identifier='origin'
                        pinColor='green'
                    />
                    <Marker
                        coordinate={{
                            latitude: parseFloat(trip.destinationLatitude),
                            longitude: parseFloat(trip.destinationLongitude),
                        }}
                        title='Destino del Viaje'
                        identifier='destination'
                        pinColor='red'
                    />
                </MapView>
            </View>

            <ScrollView style={tw`flex-1 px-6 py-4 `} >
                <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Publicado: </Text>
                    <Text style={tw`text-[15px]`}>  {moment(trip.createdAt).fromNow()}</Text>
                </View>

                {trip.travelType !== 'Inmediato' &&
                    <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                        <Text style={tw`text-[19px] font-bold`} > Recogida: </Text>
                        <Text style={tw`text-[15px]`}>  {moment(trip.travelDate).format('DD MMM YYYY')}</Text>
                    </View>
                }
                {trip.travelType !== 'Inmediato' &&
                    <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                        <Text style={tw`text-[19px] font-bold`} > Hora: </Text>
                        <Text style={tw`text-[15px]`}>  {trip.travelTime}</Text>
                    </View>
                }

                {trip.driver && <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Conductor: </Text>
                    <Text style={tw`text-[19px]`}> {trip.driver} </Text>
                </View>}

                {trip.driverPhone && <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Contacto: </Text>
                    <Text style={tw`text-[19px]`}>+53 {trip.driverPhone} </Text>
                </View>}

                <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Recorrido: </Text>
                    <Text style={tw`text-[19px]`}> {trip.distance} </Text>
                </View>

                <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Monto: </Text>
                    <Text style={tw`text-[19px]`}> {trip.cost} c/u </Text>
                </View>
                <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Duracion: </Text>
                    <Text style={tw`text-[19px]`}> {trip.time} </Text>
                </View>


                {trip.originState !== 'undefined' && <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Provincia: </Text>
                    <Text style={tw`text-[19px]`}> {trip.originState} </Text>
                </View>}

                {trip.originCity !== 'undefined' && <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Ciudad: </Text>
                    <Text style={tw`text-[19px]`}> {trip.originCity} </Text>
                </View>}
                {trip.originAdress !== 'undefined' && <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Origen: </Text>
                    <Text style={tw`text-[15px]`}> {trip.originAdress} </Text>
                </View>}
                {trip.destinationAdress !== 'undefined' && <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Hasta: </Text>
                    <Text style={tw`text-[14px]`}> {trip.destinationAdress} </Text>
                </View>}


                <View style={tw`my-3 mb-10 flex flex-row items-center flex-1  `} >

                    {trip.travelStatus === 'Aceptado' &&
                        <Text style={tw`text-center bg-green-400 flex-1 py-3 rounded-lg shadow-sm border border-[#aaa]`}  >
                            Viaje Aceptado
                        </Text>
                    }
                    {trip.travelStatus === 'Pendiente' &&
                        <Text style={tw`text-center flex-1 bg-red-300 py-3 rounded-lg shadow-sm border border-[#aaa]`}  > Pendiente </Text>
                    }
                    {trip.travelStatus === 'Completado' &&
                        <Text style={tw`text-center bg-yellow-400 flex-1 py-3 mb-6 rounded-lg shadow-sm border border-[#aaa]`}  > Viaje completado </Text>
                    }
                    {trip.travelStatus === 'Cancelado' &&
                        <Text style={tw`text-center bg-black flex-1 py-3 mb-6 rounded-lg shadow-sm border border-[#aaa] text-white`}  > Viaje Cancelado </Text>
                    }

                </View>



                {trip.travelStatus !== 'Completado' && trip.travelStatus !== 'Cancelado' &&
                    <View style={tw`mb-17`} >
                        {!loader ? <TouchableOpacity style={tw` flex flex-row items-center py-3 justify-center  px-5 bg-[#333] rounded-lg shadow-lg `} onPress={cancel} >

                            <Icon
                                size={30}
                                type='materialcommunityicons' color='red' name='cancel'
                            />
                            <Text style={tw`text-white ml-3`} >Cancelar Viaje </Text>
                        </TouchableOpacity> : <ActivityIndicator style={tw` flex flex-row items-center py-3 justify-center mb-7 px-5 bg-[#333] rounded-lg shadow-lg `} size="large" color="white" />}
                    </View>
                }
                


            </ScrollView>


        </View>
    )
}

export default ClientTrip

const styles = StyleSheet.create({})