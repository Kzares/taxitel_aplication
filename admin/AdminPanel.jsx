import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { getDriverPendingTrips, getDriverTrips } from '../services/graphql'
import { useRecoilState } from 'recoil'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/base';
import { selectedDriverAtom, driverAdminTrip } from '../atoms/admin'
import { Motion } from '@legendapp/motion'


const AdminPanel = ({ navigation }) => {
    const [driver, setDriver] = useRecoilState(selectedDriverAtom)
    const [trips, setTrips] = useState([])
    const [request, setRequest] = useState(false)
    const [driverTrip, setDriverTrip] = useRecoilState(driverAdminTrip)
    const [paymentAmount, setPaymentAmount] = useState(false)
    const [selected, setSelected] = useState(false)
    const [show, setShow] = useState(false)
    const getTrips = () => {
        setTrips([])
       if(!selected){
        getDriverTrips(driver.id).
        then(data => {
            setTrips(data)
            setRequest(true)
            let amount = 0
            data.map(({cost}) => amount += parseInt(cost)/10 )
            setPaymentAmount(parseInt(amount))
        })
        .catch(() => {
            console.log('Error is ocurred')
        })
       }else{
        getDriverPendingTrips(driver.id).
        then(data => {
            setTrips(data)
            setRequest(true)
            let amount = 0
            data.map(({cost}) => amount += parseInt(cost)/10 )
            setPaymentAmount(parseInt(amount))
        })
        .catch(() => {
            console.log('Error is ocurred')
        })
       }

    }
    useEffect(() => {
        if(request) return
        getTrips()
    }, [selected])

    const reload = () => {
        setRequest(false)
        setTrips([])
        getTrips()
    }
    const deleteTrips = () =>{
        if(!selected){

        }else{
            
        }
    }

    return (
        <View style={tw`flex z-100 px-2 bg-white flex-1`}>
             {show &&
                <Motion.View
                    initial={{ opacity: 0 }}
                    transition={{ type: 'spring' }}
                    animate={{ opacity: 1 }}
                    style={tw`absolute flex items-center justify-center top-0 w-full h-full left-0 right-0 z-20`}>
                    <Motion.View
                        initial={{ y: -50, opacity: 0, scale: .7 }}
                        transition={{ type: 'spring' }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        style={tw`bg-white p-7 pt-4 rounded-lg shadow-lg mx-6`} >

                        <Icon
                            type='antdesign' color='black' name='questioncircleo' size={40}
                            style={tw`pb-3`}
                        />

                        <Text style={tw`text-center  font-semibold `} >
                            {!selected? 'Al verificar todos los viajes elimará en los que el chofer está trabajando actualmente, desea continuar?' : 'Desea verificar todos los viajes? Esta acción no se puede desacer' }
                        </Text>

                        <View style={tw`flex flex-row pt-7 items-center justify-between px-3`} >

                            <TouchableOpacity onPress={() => setShow(false)}><Text style={tw` px-4 py-3 text-[14px] text-white bg-black rounded-lg `} >Cancelar</Text></TouchableOpacity>
                            <TouchableOpacity><Text style={tw` px-4 py-3 text-[14px] rounded-lg border border-[#000] font-semibold ` }  onPress={deleteTrips} >Aceptar</Text></TouchableOpacity>

                        </View>

                    </Motion.View>
                </Motion.View>}

            <View style={tw`flex flex-row  justify-between relative items-center border-b border-[#eee] py-5 bg-gray-50 `} >
                <View>
                    <Text style={tw`text-[25px] font-bold`} > {selected? 'Viajes Completados' : 'Todos los viajes'} </Text>
                    <Text style={tw`text-[16px] font-semibold`} >{driver.name} </Text>
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

            <View style={tw`w-full items-center flex-row py-3 justify-between`}>
                <Text style={tw`text-[16px]`}> Total a pagar : <Text style={tw`font-bold`}>{paymentAmount} c/u</Text> </Text>
                <TouchableOpacity style={tw`bg-black rounded-xl shadow-lg` }>
                    <Text style={tw`text-white px-3 py-2 font-bold`} onPress={() => {setRequest(false) ;setSelected(!selected)}} > {selected? 'Ver todos' : 'Viajes completados' } </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={tw`bg-black rounded-xl shadow-lg` } onPress={() => setShow(true)} >
                    <Text style={tw`text-white py-4 text-center text-[16px] font-bold`} > Verificar Todos </Text>
                </TouchableOpacity>

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

                                <Text>Los viajes de este usuario se mostrarán aquí</Text>
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
                                    onPress={() => { setDriverTrip(item); navigation.navigate('DriverTripDetails') }}
                                    style={tw`flex flex-row w-full items-center justify-between py-3 border-b border-[#eee] `} >
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
                                    ${item.travelStatus === 'Cancelado' ? 'bg-black' : ''}
                                     rounded-full shadow-md `} >
                                        <Text style={tw`text-white`} > {item.travelStatus} </Text>
                                    </TouchableOpacity>

                                </TouchableOpacity>
                            )}
                        />

                    </View>
                }


            </View>
        </View>
    )
}

export default AdminPanel

const styles = StyleSheet.create({})