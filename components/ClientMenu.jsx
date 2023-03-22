import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ClientTrip from './ClientTrip'
import { StyleSheet, View,  } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import ClientTrips from './ClientTrips'

const ClientMenu = () => {

    const Stack = createNativeStackNavigator();


    return (

        <View style={tw`flex-1 bg-white `} >

            {/* Client Info */}
            
            {/* Making all the functionality of the posts rendering*/}
            <Stack.Navigator>


                <Stack.Screen
                    name='ClientTrips'
                    component={ClientTrips}
                    options={{
                        headerShown: false
                    }} />
                <Stack.Screen
                    name='ClientTrip'
                    component={ClientTrip}
                    options={{
                        headerShown: false
                    }} />


                {/** */}
            </Stack.Navigator>


        </View>

    )
}

export default ClientMenu

const styles = StyleSheet.create({})