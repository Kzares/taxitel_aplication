import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { getExistingTrips } from '../services/graphql' 
import { useEffect } from 'react'
import { useState } from 'react'
import { TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import moment from 'moment'
import { Icon } from '@rneui/base'
import { adminUserTripAtom } from '../atoms/admin'
import { useRecoilState } from 'recoil'

const AdminTrips = ({navigation}) => {

    const [trips,setTrips] = useState([])
    const [request, setRequest] = useState(false)
    const [userTrip, setUserTrip] = useRecoilState(adminUserTripAtom)
    const getTrips = () =>{
        console.log('call')
        getExistingTrips()
        .then((data) => {setTrips(data); setRequest(true)})
        .catch(err => console.log(err))
    }
    useEffect(() => {
        getTrips()
    }, []);
    const  reload = () =>{
        setRequest(false)
        setTrips([])
        getTrips()
    }

    return (
        <View style={tw`flex z-100 px-2 flex-1`}>
        <View style={tw`flex  flex-row items-center relative bg-white justify-between w-full pb-5 border-b border-[#eee] `} >

            <View>


                <View style={tw`flex flex-row items-center py-1`} >
                    <Icon
                        type='entypo' color='black' size={28} name='list'
                    />
                    <Text style={tw`text-[25px] font-semibold`} > Todos los viajes </Text>
                </View>

                <Text> {trips.length} viajes abiertos </Text>
            </View>

           


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
                            <Text style={tw`text-[16px] pt-2`} >No hay trabajos por el momento</Text>
                        </View> :
                        <View>
                            <ActivityIndicator size="large" style={tw`pb-5`} color="#000000" />

                            <Text>Los viajes que haz publicado se mostraran aqui, si la demora es prolongada intente refrescar</Text>
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

export default AdminTrips