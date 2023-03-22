import { ActivityIndicator, StyleSheet, Text, ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { driverTripAtom } from '../atoms/driverTripAtom'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc'
import { TouchableOpacity } from 'react-native'
import { sesionAtom } from '../atoms/sesionAtom'
import { getDriverBalance, getSingleTrip, publishTravel, updateTrip, } from '../services/graphql'
import Alert from '../components/Alert'
import { themeAtom } from '../atoms/themeAtom'
import { darkMap } from '../services/map'
import { useRef } from 'react'
import moment from 'moment'
const TripDetail = ({ navigation }) => {
    const [trip, setTrip] = useRecoilState(driverTripAtom)
    const [sesion, setSesion] = useRecoilState(sesionAtom)

    const [loader, setLoader] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertText, setAlertText] = useState('')
    const [alertStatus, setAlertStatus] = useState('')
    //Dark theme global
    const [theme, setTheme] = useRecoilState(themeAtom)
    const mapRef = useRef()

    //Getting the balance
    const [balance, setBalance] = useState(null)

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

    //Alert
    const handlingAlert = (data, status) => {
        setAlertText(data)
        setAlertStatus(status)
        setAlert(true)
        setTimeout(() => {
            setAlert(false)
        }, 4000)
    }

    const acceptTrip = () => {

        if (balance === null) return
        if (balance < -100) {
            handlingAlert('No tiene balance suficiente para aceptar este viaje, contacte con los administradores para recargar su cuenta', false)
            return
        }

        setLoader(true)
        updateTrip(trip.id, sesion.name, sesion.number, sesion.id).then(() => publishTravel(trip.id).then(() => {
            handlingAlert('Viaje aceptado satisfactoriamente', true)
            setLoader(false)
            setTimeout(() => {
                navigation.navigate('DriverHome')
            }, 2500)
            return
        })).catch(e => {
            handlingAlert('Revise su conexion a internet e intentelo nuevamente', false)
            return
        })
        setTimeout(() => {
            setLoader(false)
            handlingAlert('Revise su conexion a internet e intentelo nuevamente', false)
        }, 7000)
    }
    const getTrip = () => {
        getSingleTrip(trip.id).then((data) => {
            if (data.length > 0) {
                setLoader(true)
                acceptTrip()
            } else {
                handlingAlert('Este Viaje ya fue aceptado, refresque su pagina principal para observar los cambios', false)
                setTimeout(() => navigation.navigate('DriverHome'), 4000)
            }
        }).catch(() => getTrip())

    }

    useEffect(() => {
        setTimeout(() => {
            mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
            })
        }, 500)
    }, [])



    return (
        <View style={tw`w-full h-full bg-white ${!trip.name ? 'flex items-center justify-center' : ''} `} >
            {alert && <Alert type={true} text={alertText} alertStatus={alertStatus} />}

            <View style={tw`flex-1`} >
                <View style={tw`h-3/5 w-full`} >
                    <MapView
                        ref={mapRef}
                        style={tw`flex-1 `}
                        customMapStyle={theme === 'black' ? darkMap : []}
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
                        <Text style={tw`text-[19px]`}> {trip.name}  </Text>
                    </View>

                    <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                        <Text style={tw`text-[19px] font-bold`} > Contacto: </Text>
                        <Text style={tw`text-[19px]`}>+53 {trip.phone} </Text>
                    </View>

                    <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                        <Text style={tw`text-[19px] font-bold`} > Recorrido: </Text>
                        <Text style={tw`text-[19px]`}> {trip.distance} </Text>
                    </View>

                    <View style={tw`w-full justify-between flex-row py-3 border-b border-[#eee] `} >
                        <Text style={tw`text-[19px] font-bold`} > Monto: </Text>
                        <Text style={tw`text-[19px]`}> {trip.cost} c/u </Text>
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

                    <TouchableOpacity style={tw`p-5 mb-3 flex items-center justify-center`} disabled={loader} onPress={getTrip} >
                        <Text style={tw`text-[18px] text-white rounded-lg shadow-md bg-black px-10 py-5`} >
                            {!loader ? 'Aceptar Viaje' : <ActivityIndicator size="large" color="white" />
                            }
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </View>
    )
}

export default TripDetail

const styles = StyleSheet.create({})