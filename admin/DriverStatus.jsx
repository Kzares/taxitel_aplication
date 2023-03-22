import { StyleSheet, Text, View, ActivityIndicator, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { deleteAllTrips, deleteFinishedTrips, getDriverBalance, getDriverPendingTrips, getDriverTrips, publishDriver, updateDriverBalance } from '../services/graphql'
import { useRecoilState } from 'recoil'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/base';
import { selectedDriverAtom, driverAdminTrip } from '../atoms/admin'
import { Motion } from '@legendapp/motion'
import moment from 'moment'
import { alertAtom } from '../atoms/alertAtom'


const DriverStatus = ({ navigation }) => {

    //states and globals

    const [driver, setDriver] = useRecoilState(selectedDriverAtom)
    const [trips, setTrips] = useState([])
    const [request, setRequest] = useState(false)
    const [driverTrip, setDriverTrip] = useRecoilState(driverAdminTrip)
    const [selected, setSelected] = useState(true)
    const [show, setShow] = useState(false)
    const [modal, setModal] = useState(false)
    const [loader, setLoader] = useState(false)
    const [balance, setBalance] = useState(null)
    const [number, setNumber] = useState(0)

    //geting the driver trips

    const getTrips = () => {
        if (request) return
        setTrips([])
        if (!selected) {
            getDriverTrips(driver.id).
                then(data => {
                    setTrips(data)
                    setRequest(true)
                })
                .catch((e) => {
                    handlingAlert('Revise su conexión a internet e inténtelo de nuevo', false)
                    console.log(e)
                })
        } else {
            getDriverPendingTrips(driver.id).
                then(data => {
                    setTrips(data)
                    setRequest(true)
                })
                .catch((e) => {
                    handlingAlert('Revise su conexión a internet e inténtelo de nuevo', false)
                    console.log(e)
                })
        }

    }
    useEffect(() => {
        if (request) return
        getTrips()
    }, [selected])

    //reload function

    const reload = () => {
        setRequest(false)
        setTrips([])
        getTrips()
    }

    //delete trps function
    const deleteTrips = () => {
        if (selected) {
            deleteFinishedTrips(driver.id).then(data => {
                reload()
                setRequest(false)
                setTrips([])
                setShow(false)
                getTrips()
                handlingAlert(`Se han eliminado ${data.count} viajes `, true)
            })
                .catch((e) => {
                    console.log(e)
                })
        } else {
            deleteAllTrips(driver.id).then(data => {
                reload()
                setShow(false)
                getTrips()
                handlingAlert(`Se han eliminado ${data.count} viajes `, true)
            })
                .catch((e) => {
                    handlingAlert('Revise su conexión a internet e inténtelo de nuevo', false)
                    console.log(e)
                })

        }
    }


    //increase balance function

    const increaseBalance = () => {
        setLoader(true)
        updateDriverBalance(driver.id, (parseInt(balance) + parseInt(number))).then(data => {
            publishDriver(driver.id).then(() => {
                console.log(data)
                setModal(false)
                setLoader(false)
                setBalance(data.balance)
                handlingAlert(`El balance de este usuario ha sido incrementado ${number} c/u `, true)
                return

            }).catch(e => console.log(e))

        })
        .catch((e) => {
            console.log(e)
                
        })
    }

    //getting the actual balance

    const getBalance = () => {
        getDriverBalance(driver.id).then(data => {
            setBalance(data.balance)
            setRequest(true)
        })
            .catch((e) => {
                console.log(e)
            })



    }
    useEffect(() => {
        getBalance()
    }, [])
    //handling the alert
    const [alert, setAlert] = useRecoilState(alertAtom)

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
                            {!selected ? 'Al verificar todos los viajes elimará en los que el chofer está trabajando actualmente, desea continuar?' : 'Desea verificar todos los viajes? Esta acción no se puede desacer'}
                        </Text>

                        <View style={tw`flex flex-row pt-7 items-center justify-between px-3`} >

                            <TouchableOpacity onPress={() => setShow(false)}><Text style={tw` px-4 py-3 text-[14px] text-white bg-black rounded-lg `} >Cancelar</Text></TouchableOpacity>
                            <TouchableOpacity onPress={deleteTrips} disabled={loader}>
                                {loader ? <ActivityIndicator size="large" color="#000000" />
                                    : <Text style={tw` px-4 py-3 text-[14px] rounded-lg border border-[#000] font-semibold `} >Aceptar</Text>
                                }
                            </TouchableOpacity>

                        </View>

                    </Motion.View>
                </Motion.View>}

            {modal &&
                <Motion.View
                    initial={{ opacity: 0 }}
                    transition={{ type: 'spring' }}
                    animate={{ opacity: 1 }}
                    style={tw`absolute flex items-center justify-center top-0 w-full h-full left-0 right-0 z-100`}>
                    <Motion.View
                        initial={{ y: -50, opacity: 0, scale: .7 }}
                        transition={{ type: 'spring' }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        style={tw`bg-white p-7 pt-4 rounded-lg shadow-lg mx-6`} >

                        <Icon
                            type='fontisto' color='black' name='wallet' size={40}
                            style={tw`pb-6`}
                        />

                        <TextInput
                            value={number}
                            onChangeText={text => setNumber(text)}
                            editable
                            placeholder='Incrementear balance'
                            keyboardType="numeric"
                            style={tw`p-2 text-[18px] border-b border-[#eee] `}
                        />

                        <View style={tw`flex flex-row pt-7 items-center justify-between px-3`} >

                            <TouchableOpacity onPress={() => setModal(false)}><Text style={tw` px-4 py-3 text-[14px] text-white bg-black rounded-lg mr-4 `} >Cancelar</Text></TouchableOpacity>
                            <TouchableOpacity onPress={increaseBalance} disabled={loader}>
                                {loader ? <ActivityIndicator size="large" color="#000000" />
                                    : <Text style={tw` px-4 py-3 text-[14px] rounded-lg border border-[#000] font-semibold ml-4`} >Aceptar</Text>
                                }
                            </TouchableOpacity>

                        </View>

                    </Motion.View>
                </Motion.View>}

            <View style={tw`flex flex-row  justify-between relative items-center border-b border-[#eee] py-5 bg-gray-50 `} >
                <View>
                    <Text style={tw`text-[25px] font-bold`} > {selected ? 'Viajes Completados' : 'Todos los viajes'} </Text>
                    <Text style={tw`text-[16px] font-semibold`} >{driver.name} </Text>
                </View>
                <TouchableOpacity onPress={() => setModal(true)} style={tw`p-3 shadow-md mr-2 bg-white rounded-full `}
                >
                    <Icon
                        type='fontisto' color='black' name='wallet' size={30}
                    />
                </TouchableOpacity>



            </View>
            <View style={tw` -mt-6 w-full items-center `} >
                <TouchableOpacity style={tw` p-3 rounded-full bg-white shadow-lg z-20 border border-[#aaa] `} onPress={reload} >
                    <Icon
                        type='antdesign' color='black' size={20} name='reload1'
                    />
                </TouchableOpacity>
            </View>

            <View style={tw`w-full items-center flex-row py-3 justify-between`}>
                <Text style={tw`text-[16px] `}> Balance actual :
                    {balance === null && <Text ><ActivityIndicator size="small" color="gray" /> </Text >}
                    <Text style={tw`font-bold`}> {balance} c/u </Text>
                </Text>
                <TouchableOpacity style={tw`bg-black rounded-xl shadow-lg`}>
                    <Text style={tw`text-white px-3 py-2 font-bold`} onPress={() => { setRequest(false); setSelected(!selected) }} > {selected ? 'Ver todos' : 'Viajes completados'} </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={tw`bg-black rounded-xl shadow-lg`} onPress={() => setShow(true)} >
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

                                <Text>Los viajes de este usuario se mostrarán aquí, en caso que la espera sea prolongada intente refrescar </Text>
                            </View>
                        }
                    </View>
                    :
                    <View>
                        <FlatList
                            data={trips}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => { setDriverTrip(item); navigation.navigate('DriverTripDetails') }}
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

                                    <View style={tw`mt-4 items-center justify-between flex-row`}>
                                        <Text style={tw`text-[16px] font-bold`}>Tarifa: {item.cost} $ </Text>
                                        <Text style={tw`text-[16px] font-bold`}>Distancia: {item.distance}  </Text>
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

export default DriverStatus

const styles = StyleSheet.create({})