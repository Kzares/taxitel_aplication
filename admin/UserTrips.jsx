import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { getUserTravels } from '../services/graphql'
import { useRecoilState } from 'recoil'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/base';
import { adminUserId, adminUserTripAtom } from '../atoms/admin'
import moment from 'moment'


const ClientTrips = ({ navigation }) => {
    const [user, setUser] = useRecoilState(adminUserId)
    const [trips, setTrips] = useState([])
    const [request, setRequest] = useState(false)
    const [userTripAtom, setUserTrip] = useRecoilState(adminUserTripAtom)
    const getTrips = () => {
        getUserTravels(user.id).
            then(data => {
                setTrips(data)
                setRequest(true)
            })
            .catch((err) => {
                console.log(err)
            })

    }

    useEffect(() => {
        if (request) return
        getTrips()
    }, [request])

    const reload = () => {
        setRequest(false)
        setTrips([])
        getTrips()
    }

    return (
        <View style={tw`flex z-100 px-2 bg-white flex-1`}>

            <View style={tw`flex flex-row  justify-between relative items-center border-b border-[#eee] py-5 bg-gray-50 `} >
                <View>
                    <Text style={tw`text-[25px] font-bold`} > {user.name} </Text>
                    <Text style={tw`text-[16px] font-semibold`} >+53 {user.phone} </Text>
                </View>
                {trips.length > 0 && <Text style={tw`text-20px py-2 px-3 bg-gray-200 rounded-lg`}> {trips.length} </Text>}


            </View>
            <View style={tw` -mt-6 w-full items-center `} >
                <TouchableOpacity style={tw` p-3 rounded-full bg-white shadow-lg z-20 border border-[#aaa] `} onPress={reload} >
                    <Icon
                        type='antdesign' color='black' size={20} name='reload1'
                    />
                </TouchableOpacity>
            </View>

            <View style={tw`bg-white flex-1 flex ${trips.length === 0 ? 'items-center justify-center' : 'pt-3'} `} >

                {trips.length === 0 ?
                    <View>
                        {request ?
                            <View>
                                <Icon
                                    type='entypo' color='black' name='emoji-sad' size={40}
                                />
                                <Text style={tw`text-[16px] pt-2`} >No hay viajes de momento</Text>
                            </View> :
                            <View>
                                <ActivityIndicator size="large" style={tw`pb-5`} color="#000000" />

                                <Text>Los viajes de este usuario se mostrarán aquí, presione refrescar si tarda mucho </Text>
                            </View>
                        }
                    </View>
                    :
                    <View>
                        <FlatList
                            data={trips}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => { setUserTrip(item); navigation.navigate('UserTripDetail') }}
                                    style={tw`flex w-full  py-3 border-b border-[#eee] `} >
                                    <Text style={tw`text-gray-500`} > {moment(item.createdAt).fromNow()} </Text>


                                    <View style={tw`flex flex-row justify-between mt-2 items-center`} >
                                        <View style={tw`flex-row items-center`}>
                                            <Icon
                                                type='antdesign' color='black' name='clockcircleo' size={25}
                                                style={tw`pr-1`}
                                            />
                                             <View>
                                                <Text style={tw`text-[16px]`} > {item.travelType === 'Inmediato' ? 'Recogida Inmediata' : 'Recogida Programada'} </Text>
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