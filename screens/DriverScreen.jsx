import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { useRecoilState } from 'recoil'
import tw from 'twrnc'
import { driverLocationatom } from '../atoms/DriverLocationAtom'
import { sesionAtom } from '../atoms/sesionAtom'
import Details from '../driver/Details'
import DriverHome from '../driver/DriverHome'
import DriverMap from '../driver/DriverMap'
import PendingTrips from '../driver/PendingTrips'
import TripDetail from '../driver/TripDetail'
import * as Location from 'expo-location'
import { useState } from 'react'
import { createDriverLocation, getDriverRecord, publishDriverLocation, updateDriverLocation } from '../services/graphql'

const DriverScreen = ({ navigation }) => {
  const [sesion, setSesion] = useRecoilState(sesionAtom)
  const Stack = createNativeStackNavigator();
  const [driverLocation, setDriverLocation] = useRecoilState(driverLocationatom)
  const [request, setRequest] = useState(false)

  useEffect(() => {
    if (!sesion.name) {
      navigation.navigate('LoginScreen')
      console.log('map')
    }
  }, [sesion])


  const getPermisions = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      await Location.requestPermissionsAsync();
    }

    let currentLocation = await Location.getCurrentPositionAsync({})
    setDriverLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    })
    getDriverRecord(sesion.id).then(data => {
      if (data.length === 0) {
        createDriverLocation(currentLocation.coords.latitude, currentLocation.coords.longitude, sesion.name, sesion.id)
          .then(data => publishDriverLocation(data.id).then(() => console.log('Entry Created')))
          .catch(e => console.log(e))
      } else {
        updateDriverLocation(data[0].id, currentLocation.coords.latitude, currentLocation.coords.longitude)
          .then((data) => publishDriverLocation(data.id).then(() => console.log('Entry updated')))
        setInterval(
          () => {
            updateDriverLocation(data[0].id, currentLocation.coords.latitude, currentLocation.coords.longitude)
              .then((data) => publishDriverLocation(data.id).then(() => console.log('Entry Updated')))
          }, 360000
        )
      }
    }).catch(e => console.log(e))
    setRequest(true)

  }


  useEffect(() => {
    getPermisions()
  }, [])

  return (

    <View style={tw`w-full h-full`} >


      <Stack.Navigator>
        {/* Drivers Screen */}
        <Stack.Screen
          name='DriverMap'
          component={DriverMap}
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name='DriverHome'
          component={DriverHome}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='TripDetail'
          component={TripDetail}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='PendingTrips'
          component={PendingTrips}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='Details'
          component={Details}
          options={{
            headerShown: false
          }} />

      </Stack.Navigator>
    </View>


  )
}

export default DriverScreen

const styles = StyleSheet.create({})