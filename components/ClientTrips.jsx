import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { getUserTravels } from '../services/graphql'
import { useRecoilState } from 'recoil'
import { sesionAtom } from '../atoms/sesionAtom'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/base';
import { userTripAtom } from '../atoms/userTripAtom'
import moment from 'moment'
import { alertAtom } from '../atoms/alertAtom'


const ClientTrips = ({ navigation }) => {
    const [sesion, setSesion] = useRecoilState(sesionAtom)
    const [userTrip, setUserTrip] = useRecoilState(userTripAtom)
    const [trips, setTrips] = useState([])
    const [request, setRequest] = useState(false)

    //get actual trips
    const getTrips = () => {
        console.log('call')
        getUserTravels(sesion.id).
            then(data => {
                setTrips(data)
                setRequest(true)
            })
            .catch(() => {
                getTrips()
                handlingAlert('Revise su conexión e inténtelo nuevamente', false)
            })

    }

    useEffect(() => {
        if (request) return
        getTrips()
    }, [request])


    //reload function
    const reload = () => {
        setRequest(false)
        setTrips([])
        getTrips()
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
        }, 2500)

    }

    return (
        <View style={tw`flex z-100 px-2 flex-1`}>
            <View style={tw`flex  flex-row items-center relative bg-white justify-between w-full pb-5 border-b border-[#eee] `} >

                <View>

                    <View style={tw`flex flex-row items-center py-1`} >
                        <Icon
                            type='antdesign' color='black' size={28} name='user'
                        />
                        <Text style={tw`text-[25px] font-semibold`} > {sesion.name} </Text>
                    </View>

                    <Text> +53 {sesion.number} </Text>
                </View>

                <TouchableOpacity onPress={() => {
                    setSesion({});
                }} >
                    <Icon
                        type='materialicons' color='black' size={28} name='logout'
                    />
                    <Text >Cerrar Sesion</Text>
                </TouchableOpacity>



            </View>
            <View style={tw`bg-white relative flex-1 flex ${trips.length === 0 ? 'items-center justify-center' : 'pt-3'} `} >
                <View style={tw`absolute -top-6 w-full items-center`}>
                    <TouchableOpacity onPress={reload} style={tw` p-3 rounded-full bg-white shadow-lg z-1000 border border-[#aaa] `} >
                        <Icon
                            type='antdesign' style={tw``} color='black' size={20} name='reload1'
                        />
                    </TouchableOpacity>
                </View>
                {trips.length === 0 ?
                    <View>
                        {request ?
                            <View>
                                <Icon
                                    type='entypo' color='black' name='emoji-sad' size={40}
                                />
                                <Text style={tw`text-[16px] pt-2`} >No hay viajes abiertos</Text>
                            </View> :
                            <View>
                                <ActivityIndicator size="large" style={tw`pb-5`} color="#000000" />

                                <Text>Los viajes que haz publicado se mostrarán aqui</Text>
                            </View>
                        }
                    </View>
                    :
                    <View>
                        <FlatList
                            data={trips}
                            style={tw`mb-8`}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => { setUserTrip(item); navigation.navigate('ClientTrip') }}
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



                                </TouchableOpacity>
                            )}
                        />

                    </View>
                }


            </View>
        </View>
    )
}

export default ClientTrips

const styles = StyleSheet.create({})