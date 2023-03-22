import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { sesionAtom } from '../atoms/sesionAtom'
import { useRecoilState } from 'recoil'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/base'

import tw from 'twrnc'
import { ActivityIndicator } from 'react-native'
import { getDriverBalance, getTravels } from '../services/graphql'
import { FlatList } from 'react-native'
import { driverTripAtom } from '../atoms/driverTripAtom'
import moment from 'moment'

const DriverHome = ({ navigation }) => {

  const [sesion, setSesion] = useRecoilState(sesionAtom)
  const [driverTrip, setDriverTrip] = useRecoilState(driverTripAtom)
  const [trips, setTrips] = useState([])
  const [request, setRequest] = useState(false)

  const reload = () => {
    console.log('reloading')
    setRequest(false)
    setTrips([])
    getAllTravels()
    setBalance(null)
    getBalance()
  }

  const getAllTravels = () => {
    getTravels()
      .then(data => {
        setTrips(data)
        setRequest(true)
      })
      .catch((e) => {
        getAllTravels()
        console.log(e)
      })
  }
  useEffect(() => {
    if (!request) getAllTravels()

  }, [])

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
    <SafeAreaView style={tw`px-3 pt-5 flex-1 bg-white`} >

      <View style={tw`absolute top-25 w-full items-center`}>
        <TouchableOpacity onPress={reload} style={tw` p-3 rounded-full bg-white shadow-lg z-20 border border-[#aaa] `} >
          <Icon
            type='antdesign' style={tw``} color='black' size={20} name='reload1'
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('PendingTrips')} style={tw`absolute bottom-0 z-10 left-0 right-0 bg-white border-t px-6 py-3 rounded-lg border-[#aaa] flex items-center flex-row justify-center `} >
        <Icon
          type='materialIcons' style={tw`pr-2t`} color='black' size={28} name='pending-actions'
        />
        <Text>Viajes Pendientes</Text>
      </TouchableOpacity>

      {/* Header Part */}

      <View style={tw`flex flex-row items-center justify-between w-full pb-5 border-b border-[#eee] `} >

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

      {/* balance and that things */}
      <Text style={tw`text-[16px] mt-6`}> Balance actual :
        {balance === null && <Text ><ActivityIndicator size="small" color="gray" /> </Text >}
        <Text style={tw`font-bold`}> {balance} c/u </Text>
      </Text>

      {/* Rendering the active trips */}

      <View style={tw`bg-white flex-1 pb-13  flex ${trips.length === 0 ? 'items-center justify-center' : ''} `} >

        {trips.length === 0 ?
          <View>
            {!request ?
              <ActivityIndicator size="large" style={tw`pb-5`} color="#000000" /> :
              <View>
                <Icon
                  type='entypo' color='black' name='emoji-sad' size={40}
                />
                <Text style={tw`text-[16px] pt-2`} >No hay trabajos por el momento</Text>
              </View>
            }
          </View>
          :
          <View>
            <FlatList
              style={tw`mt-5`}
              data={trips}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => { setDriverTrip(item); navigation.navigate('TripDetail') }}
                  style={tw`flex w-full  pt-3 pb-5 border-b border-[#aaa]  `} >
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

                    <View>
                      {item.originCity !== 'undefined' && <Text> {item.originCity} </Text>}
                      {item.originState !== 'undefined' && <Text> {item.originState} </Text>}
                    </View>
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



    </SafeAreaView>
  )
}

export default DriverHome

const styles = StyleSheet.create({})