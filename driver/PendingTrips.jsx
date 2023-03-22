import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import { getDriverBalance, getDriverTrips } from '../services/graphql'
import { ActivityIndicator } from 'react-native'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/base'
import { useRecoilState } from 'recoil'
import { sesionAtom } from '../atoms/sesionAtom'
import { driverTripAtom } from '../atoms/driverTripAtom'
import moment from 'moment'

const PendingTrips = ({ navigation }) => {

    const [trips, setTrips] = useState([])
    const [sesion, setSesion] = useRecoilState(sesionAtom)
    const [driverTrip, setDriverTrip] = useRecoilState(driverTripAtom)
    const [request, setRequest] = useState(false)


    const getAllTravels = () => {
        getDriverTrips(sesion.id)
            .then(data => {
                setTrips(data)
                setRequest(true)
            })
            .catch((e) => {
                console.log(e)
                getAllTravels()
            })
    }


    useEffect(() => {
        if (request) return
        getAllTravels()
    }, [])
    const reload = () => {
        setRequest(false)
        setTrips([])
        getAllTravels()
        setBalance(null)
        getBalance()
    }
    //getting the balance
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



    return (
        <SafeAreaView style={tw`bg-white flex-1`} >

            <View style={tw`flex flex-row  justify-between relative items-center border-b border-[#eee] py-7 px-2 bg-gray-50 `} >
                <View>
                    <Text style={tw`text-[23px] font-bold`} > Historial de viajes </Text>
                </View>
                <View style={tw`text-[16px] items-center justify-center flex-row`}>
                    <Icon
                        type='antdesign' name='bank'
                        color='black' size={25}
                    />
                    {balance === null && <Text ><ActivityIndicator size="small" color="gray" /> </Text >}
                    <Text style={tw`font-bold`}> {balance} c/u </Text>
                </View>



            </View>
            <View style={tw`w-full items-center flex`} >
                <TouchableOpacity onPress={reload} style={tw` p-3 -mt-3 rounded-full bg-white shadow-lg z-20 border border-[#aaa] `} >
                    <Icon
                        type='antdesign' style={tw``} color='black' size={20} name='reload1'
                    />
                </TouchableOpacity>
            </View>



            {/* Rendering all the trips */}

            <View style={tw` flex-1 px-2  flex ${trips.length === 0 ? 'items-center justify-center' : 'pt-0'} `} >

                {trips.length === 0 ?

                    <View>
                        {!request ?
                            <View>
                                <ActivityIndicator size="large" style={tw`pb-5`} color="#000000" />
                                <Text>Los viajes que aceptes seran registrados aqui</Text>
                            </View> :
                            <View>
                                <Icon
                                    type='entypo' color='black' name='emoji-sad' size={40}
                                />
                                <Text style={tw`text-[16px] pt-2`} >No hay trabajos pendientes</Text>
                            </View>
                        }
                    </View>
                    :
                    <View>
                        <FlatList
                            data={trips}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => { setDriverTrip(item); setRequest(false); navigation.navigate('Details') }}
                                    style={tw`flex w-full  py-3 border-b border-[#eee] `} >
                                    <Text style={tw`text-gray-500`} > {moment(item.createdAt).fromNow()} </Text>


                                    <View style={tw`flex flex-row justify-between mt-2 items-center`} >
                                        <View style={tw`flex-row items-center`}>
                                            <Icon
                                                type='antdesign' color='black' name='clockcircleo' size={25}
                                                style={tw`pr-1`}
                                            />
                                            <View>
                                                <Text style={tw`text-[16px]`} > {item.travelType === 'Inmediato' ? 'Recojida Inmediata' : 'Recogida Programada'} </Text>
                                                {item.travelType !== 'Inmediato' && <Text style={tw`text-gray-500 `} > {moment(item.travelDate).format('DD MMM YYYY')} </Text>}
                                            </View>
                                        </View>

                                        <TouchableOpacity style={tw`p-3 
                                    ${item.travelStatus === 'Pendiente' ? 'bg-red-600' : ''} 
                                    ${item.travelStatus === 'Aceptado' ? 'bg-green-600' : ''}  
                                    ${item.travelStatus === 'Completado' ? 'bg-yellow-600' : ''}
                                    ${item.travelStatus === 'Cancelado' ? 'bg-black' : ''}  rounded-full shadow-md `} >
                                            <Text style={tw`text-white`} > {item.travelStatus} </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={tw`mt-4 items-center justify-between flex-row`}>
                                        <Text style={tw`text-[16px] font-bold`}>Tarifa: {item.cost} $ </Text>
                                        <Text style={tw`text-[16px] font-bold`}>Distancia: {item.distance}  </Text>
                                    </View>

                                    {/* 
                                     <View style={tw`flex flex-row items-center`} >
                                        <Icon
                                            type='foundation' color='black' name='marker' size={40}
                                            style={tw`pb-3`}
                                        />
                                        <Text style={tw`text-lg font-bold`} >Ahora</Text>
                                    </View>

                                    <View>
                                        <Text>Costo: {item.cost} $ </Text>
                                        <Text>Distancia: {item.distance}  </Text>
                                    </View>

                                    <TouchableOpacity style={tw`p-3 
                                    ${item.travelStatus === 'Pendiente' ? 'bg-red-600' : ''} 
                                    ${item.travelStatus === 'Aceptado' ? 'bg-green-600' : ''}  
                                    ${item.travelStatus === 'Completado' ? 'bg-yellow-600' : ''}
                                    ${item.travelStatus === 'Cancelado' ? 'bg-black' : ''}  rounded-full shadow-md `} >
                                        <Text style={tw`text-white`} > {item.travelStatus} </Text>
                                    </TouchableOpacity>
                                    */}

                                </TouchableOpacity>
                            )}
                        />

                    </View>
                }


            </View>
        </SafeAreaView>
    )
}

export default PendingTrips