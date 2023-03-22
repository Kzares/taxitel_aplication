import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { useRecoilState } from 'recoil'
import tw from 'twrnc'
import { sesionAtom } from '../atoms/sesionAtom'
import LoginScreen from './LoginScreen'
import MapScreen from './MapScreen'
import DriverScreen from './DriverScreen'
import TripScreen from './TripScreen'
import DriverLogin from '../driver/DriverLogin'
import WaitScreen from '../driver/WaitScreen'
import AdminLogin from '../admin/AdminLogin'
import AdminScreen from './AdminScreen'
import { alertAtom } from '../atoms/alertAtom'
import Alert from '../components/Alert'

const HomeScreen = () => {
  const [sesion, setSesion] = useRecoilState(sesionAtom)
  const [alert, setAlert] = useRecoilState(alertAtom)
  const Stack = createNativeStackNavigator();
  

  return (

    <View style={tw`w-full h-full`} >
      {alert.show && <Alert text={alert.text} status={alert.type} />}


      <Stack.Navigator>
        {/* Drivers Screen */}


        {!sesion.name && <Stack.Screen
          name='LoginScreen'
          component={LoginScreen}
          options={{
            headerShown: false
          }} />}
          {!sesion.name && <Stack.Screen
          name='DriverLogin'
          component={DriverLogin}
          options={{
            headerShown: false
          }} />}
          {!sesion.name && <Stack.Screen
          name='AdminLogin'
          component={AdminLogin}
          options={{
            headerShown: false
          }} />}
        {sesion.type == 'user' && <Stack.Screen
          name='MapScreen'
          component={MapScreen}
          options={{
            headerShown: false
          }} />}
          {sesion.type == 'admin' && <Stack.Screen
          name='AdminScreen'
          component={AdminScreen}
          options={{
            headerShown: false
          }} />}
        {!sesion.checked && <Stack.Screen
          name='WaitScreen'
          component={WaitScreen}
          options={{
            headerShown: false
          }} />}
          {sesion.type == 'driver' &&<Stack.Screen
          name='DriverScreen'
          component={DriverScreen}
          options={{
            headerShown: false
          }} />}
        {sesion.type == 'user' &&
        <Stack.Screen
          name='TripScreen'
          component={TripScreen}
          options={{
            headerShown: false
          }} />}
        
        





      </Stack.Navigator>
    </View>


  )
}

export default HomeScreen

const styles = StyleSheet.create({})