import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRecoilState } from 'recoil'
import tw from 'twrnc'
import AdminDriver from '../admin/AdminDriver'
import AdminDriversRequests from '../admin/AdminDriversRequests'
import AdminHome from '../admin/AdminHome'
import AdminPanel from '../admin/AdminPanel'
import AdminTrips from '../admin/AdminTrips'
import AdminUsers from '../admin/AdminUsers'
import DriverDetail from '../admin/DriverDetail'
import DriverStatus from '../admin/DriverStatus'
import DriverTripDetails from '../admin/DriverTripDetails'
import UserTripDetail from '../admin/UserTripDetail'
import UserTrips from '../admin/UserTrips'
import { sesionAtom } from '../atoms/sesionAtom'


const AdminScreen = ({ navigation }) => {
  const [sesion, setSesion] = useRecoilState(sesionAtom)

  const Stack = createNativeStackNavigator();
  useEffect(() => {
    if (!sesion.name) {
      navigation.navigate('AdminLogin')
    }
  }, [sesion])


  return (

    <SafeAreaView style={tw`w-full bg-white h-full`} >


      <Stack.Navigator>
        {/* Drivers Screen */}


        <Stack.Screen
          name='AdminHome'
          component={AdminHome}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='AdminUsers'
          component={AdminUsers}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='UserTrips'
          component={UserTrips}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='UserTripDetail'
          component={UserTripDetail}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='AdminDriverRequests'
          component={AdminDriversRequests}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='DriverDetail'
          component={DriverDetail}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='AdminDriver'
          component={AdminDriver}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='DriverStatus'
          component={DriverStatus}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='DriverTripDetails'
          component={DriverTripDetails}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='AdminPanel'
          component={AdminPanel}
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name='AdminTrips'
          component={AdminTrips}
          options={{
            headerShown: false
          }} />
      </Stack.Navigator>
    </SafeAreaView>


  )
}

export default AdminScreen

const styles = StyleSheet.create({})