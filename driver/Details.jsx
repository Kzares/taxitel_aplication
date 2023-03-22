import { ActivityIndicator, StyleSheet, Text, ScrollView, View } from 'react-native'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { driverTripAtom } from '../atoms/driverTripAtom'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc'
import { TouchableOpacity } from 'react-native'
import { sesionAtom } from '../atoms/sesionAtom'
import { endTrip, getDriverBalance, publishDriver, publishTravel, updateDriverBalance } from '../services/graphql'
import { Icon } from '@rneui/base'
import Alert from '../components/Alert'
import { useEffect } from 'react'
import { darkMap } from '../services/map'
import { useRef } from 'react'
import { themeAtom } from '../atoms/themeAtom'
import moment from 'moment'

const Details = ({ navigation }) => {
    const [trip, setTrip] = useRecoilState(driverTripAtom)
    const [sesion, setSesion] = useRecoilState(sesionAtom)

    const [loader, setLoader] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertText, setAlertText] = useState('')
    const [alertStatus, setAlertStatus] = useState('')
    const [balance, setBalance] = useState(null)
    const mapRef = useRef()

    //Dark theme global
    const [theme, setTheme] = useRecoilState(themeAtom)


    const handlingAlert = (data, status) => {
        setAlertText(data)
        setAlertStatus(status)
        setAlert(true)
        setTimeout(() => {
            setAlert(false)
        }, 4500)

    }
    const getBalance = () => {
        getDriverBalance(sesion.id).then(data => {
            setBalance(data.balance)
            setRequest(true)
        })
            .catch(() => {
                getBalance()
            })



    }
    useEffect(() => {
        getBalance()
    }, [])

    const completeTrip = () => {
        endTrip(trip.id).then(() => publishTravel(trip.id).then(() => {
            handlingAlert(`Viaje completado satisfactoriamente, de su balance se ha descontado ${parseInt(parseInt(trip.cost) / 10)} c/u , refresque para ver los cambios`, true)
            setLoader(false)
            setTimeout(() => {
                navigation.navigate('PendingTrips')
            }, 4500)
            return
        })).catch(e => {
            completeTrip()
        })

    }
    const increaseBalance = () => {
        setLoader(true)
        updateDriverBalance(sesion.id, (parseInt(balance) - parseInt(parseInt(trip.cost) / 10))).then(data => {
            publishDriver(sesion.id).then(() => {
                setBalance(data.balance)
                completeTrip()
            }).catch(e => console.log(e))

        })
            .catch(() => {
                increaseBalance()
            })
    }
    useEffect(() => {
        setTimeout(() => {
            mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
            })
        }, 500)
    }, [])

    return (
        <View style={tw`w-full h-full bg-white`} >
            {alert && <Alert type={true} text={alertText} alertStatus={alertStatus} />}

            <View style={tw`h-3/5 w-full`} >
                <MapView
                    ref={mapRef}
                    customMapStyle={theme === 'black' ? darkMap : []}
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
                    <Text style={tw`text-[19px]`}>  {moment(trip.createdAt).fromNow()}  </Text>
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
                    <Text style={tw`text-[19px]`}> {trip.name}</Text>
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

                {trip.travelStatus !== 'Cancelado' ?
                    <TouchableOpacity style={tw`my-3 mb-10 flex flex-row items-center flex-1 px-5 border rounded-lg shadow-sm `} >

                        {trip.travelStatus === 'Aceptado' ?
                            <Text style={tw`text-center flex-1 py-3`} onPress={increaseBalance} >
                                {!loader ? 'Marcar como realizado' : <ActivityIndicator size="large" color="black" />}
                            </Text> :
                            <Text style={tw`text-center flex-1 py-3`} >Viaje completado </Text>
                        }

                    </TouchableOpacity> :
                    <View style={tw` flex flex-row items-center justify-center py-5 my-5 px-5 bg-[#333] rounded-lg shadow-lg `} >


                        <Text style={tw`text-white text-[17px] `} >Viaje Cancelado </Text>

                    </View>

                }



            </ScrollView>
        </View>
    )
}

export default Details

const styles = StyleSheet.create({})