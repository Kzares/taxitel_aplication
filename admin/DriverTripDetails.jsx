import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { ScrollView } from 'react-native'
import tw from 'twrnc'
import MapView, { Marker } from 'react-native-maps'
import { TouchableOpacity } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { Icon } from '@rneui/base'
import { deleteTrip, } from '../services/graphql'
import { driverAdminTrip } from '../atoms/admin'
import moment from 'moment'
import { alertAtom } from '../atoms/alertAtom'

const DriverTripDetails = ({ navigation }) => {

    //states and globals

    const [trip, setTrip] = useRecoilState(driverAdminTrip)
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

    //delete travel function
    const deleteTravel = () => {
        setLoader(true)
        deleteTrip(trip.id).then(() => {
            handlingAlert('Viaje eliminado satisfactoriamente', true)
            setLoader(false)
            setTimeout(() => {
                navigation.navigate('DriverStatus')
            }, 2500)
            return
        }).catch(e => {
            console.log(e)
            handlingAlert('Algo falló, inténtelo nuevamente', false)
            return
        })
       
    }

    return (
        <View style={tw`flex-1 bg-white `} >

            <View style={tw`w-full h-2/5`} >
                <MapView
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
                    <Text style={tw`text-[19px]`}>  {moment(trip.createdAt).fromNow()}</Text>
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
                <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Cliente: </Text>
                    <Text style={tw`text-[19px]`}> {trip.name} </Text>
                </View>

                <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Contacto: </Text>
                    <Text style={tw`text-[19px]`}>+53 {trip.phone} </Text>
                </View>

                <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Recorrido: </Text>
                    <Text style={tw`text-[19px]`}> {trip.distance} </Text>
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
                    <Text style={tw`text-[19px] font-bold`} > Desde: </Text>
                    <Text style={tw`text-[14px]`}> {trip.originAdress} </Text>
                </View>}

                {trip.destinationAdress !== 'undefined' && <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Hasta: </Text>
                    <Text style={tw`text-[14px]`}> {trip.destinationAdress} </Text>
                </View>}
                <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Monto: </Text>
                    <Text style={tw`text-[19px]`}> {trip.cost} c/u </Text>
                </View>
                <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                    <Text style={tw`text-[19px] font-bold`} > Importe: </Text>
                    <Text style={tw`text-[19px]`}> {parseInt(parseInt(trip.cost) / 10)} c/u </Text>
                </View>

                <View style={tw` flex flex-row items-center flex-1  `} >

                    {trip.travelStatus === 'Aceptado' &&
                        <Text style={tw`text-center bg-green-400 flex-1 py-4 rounded-lg mb-3 shadow-md border border-[#aaa]`}  >
                            Viaje Aceptado
                        </Text>
                    }
                    {trip.travelStatus === 'Pendiente' &&
                        <Text style={tw`text-center flex-1 bg-red-300 py-4 rounded-lg mb-3 shadow-md border border-[#aaa]`}  > Pendiente </Text>
                    }
                    {trip.travelStatus === 'Completado' &&
                        <Text style={tw`text-center bg-yellow-400 flex-1 py-4 mb-3 rounded-lg shadow-md border border-[#aaa]`}  > Viaje completado </Text>
                    }
                    {trip.travelStatus === 'Cancelado' &&
                        <Text style={tw`text-center bg-black flex-1 py-4 mb-3 rounded-lg shadow-md border border-[#aaa] text-white`}  > Viaje Cancelado </Text>
                    }

                </View>



                {!loader ? <TouchableOpacity style={tw` flex flex-row items-center py-3 justify-center mb-7 px-5 bg-[#333] rounded-lg shadow-lg `} onPress={deleteTravel} >

                    <Icon
                        size={30}
                        type='antdesign' color='red' name='delete'
                    />
                    <Text style={tw`text-white ml-3 text-[18px] `} >Eliminar Viaje </Text>
                </TouchableOpacity> : <ActivityIndicator style={tw` flex flex-row items-center py-3 justify-center mb-7 px-5 bg-[#333] rounded-lg shadow-lg `} size="large" color="white" />}

            </ScrollView>


        </View>
    )
}

export default DriverTripDetails

const styles = StyleSheet.create({})