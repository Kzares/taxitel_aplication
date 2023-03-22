import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { SafeAreaView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/base'
import { Image } from 'react-native'
import axios from 'axios'
import { useRecoilState } from 'recoil'
import { destinationAtom, originAtom } from '../atoms/locationAtoms'

"https://api.radar.io/v1/route/distance?origin=23.13302%2C-82.38304&destination=21.38083%2C-77.91694&modes=car&units=imperial"

const RideCard = ({ navigation }) => {


  const [origin, setOrigin] = useRecoilState(originAtom)
  const [destination, setDestination] = useRecoilState(destinationAtom)
  const [travelTime, setTravelTime] = useState(false)

  const getTravelTime = async () => {
    
      await axios.get(`https://api.radar.io/v1/route/distance?origin=${origin.latitude}%2C${origin.longitude}&destination=${destination.latitude}%2C${destination.longitude}&modes=car&units=metric`, {
        headers: {
          'Authorization': 'prj_test_pk_56b7b80783bb75bad408ff3ddaca23c9ecd609e2'
        }
      }).then(data => setTravelTime(data.data.routes.car.distance.text))
      .catch(function (error) {
        if (error.response) {
          // La respuesta fue hecha y el servidor respondió con un código de estado
          // que esta fuera del rango de 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }})
       }

  useEffect(() => {
    if (!origin || !destination) return
    getTravelTime()
  }, [origin, destination]);
  return (
    <SafeAreaView style={tw`flex-grow bg-white`} >

      <TouchableOpacity style={tw`absolute bottom-3 right-5 p-3 rounded-full flex flex-row items-center`}>
        <Text style={tw`text-[18px]`} >Publicar</Text>
        <Icon name='chevron-right' type='fontawesome' />
      </TouchableOpacity>

      <Text style={tw`text-center font-semibold py-5 text-xl`} >
        Buscar Conductor
      </Text>
      {travelTime && (
        <TouchableOpacity style={tw`flex-row justify-between items-center px-10`}>

          <View style={tw`flex flex-row items-center`} >
            <Image style={{ width: 100, height: 100, resizeMode: 'contain' }} source={{ uri: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_485,h_385/f_auto,q_auto/products/carousel/UberX.png' }} />
            <Text style={tw`-ml-5 pt-10`}> {travelTime} </Text>
          </View>
          <Text style={tw`text-xl`} > {(parseInt(travelTime) * 75)} MN </Text>




        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

export default RideCard

const styles = StyleSheet.create({})