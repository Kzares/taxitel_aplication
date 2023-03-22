import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc'
import { useRecoilState } from 'recoil';
import { themeAtom } from '../atoms/themeAtom';
import { darkMap } from '../services/map.js';
import { getDriverBalance, getTravels } from '../services/graphql';
import { FlatList } from 'react-native';
import { driverTripAtom } from '../atoms/driverTripAtom';
import { Icon } from '@rneui/base';
import { sesionAtom } from '../atoms/sesionAtom';
import { driverLocationatom } from '../atoms/DriverLocationAtom';
import moment from 'moment';

const pinColors = ['red', 'green', 'orange', 'pink', 'blue', 'yellow' ,'purple']

const DriverMap = ({ navigation }) => {

    const [sesion, setSesion] = useRecoilState(sesionAtom)
    const [theme, setTheme] = useRecoilState(themeAtom)
    const [request, setRequest] = useState(false)
    const [trips, setTrips] = useState([])
    const [driverTrip, setDriverTrip] = useRecoilState(driverTripAtom)
    const [balance, setBalance] = useState(null)
    
    const [driverLocation, setDriverLocation ] = useRecoilState(driverLocationatom)



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

    const selectMarker = (item) => {
        setDriverTrip(item)
        setTimeout(() => navigation.navigate('TripDetail'), 2000)

    }
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
    const reload = () => {
        setTrips([])
        setBalance(null)
        getBalance()
        setRequest(true)
        getAllTravels()
    }


    


    return (
        <View style={tw`flex-1`}>

            <TouchableOpacity onPress={() => navigation.navigate('DriverHome')} style={tw` absolute top-10 z-100 right-1 left-1 py-1 bg-white flex-row rounded-r-full items-center justify-between rounded-l-full shadow-lg`}>
                <Text style={tw`text-[18px] font-bold pl-3 `} > {sesion.name} </Text>

                <View style={tw`text-[16px] items-center justify-center flex-row`}>
                    <Icon
                        type='antdesign' name='bank'
                        color='black' size={25}
                    />
                    {balance === null && <Text ><ActivityIndicator size="small" color="gray" /> </Text >}
                    <Text style={tw`font-bold`}> {balance} c/u </Text>
                </View>

                <Icon
                    style={tw`p-3 bg-white rounded-full w-13  shadow-lg `}
                    type='feather' color='black' name='menu'
                />

            </TouchableOpacity>

            <View style={tw`absolute bottom-1/3 right-0 flex z-100`}>
                <TouchableOpacity style={tw`bg-white rounded-full shadow-lg`} onPress={reload}>
                    {trips.length > 0 ? <Icon
                        style={tw`p-3 bg-white rounded-full w-13  shadow-lg`}
                        type='antdesign' color='black' name='reload1'
                    /> : <ActivityIndicator style={tw`py-4`} size="small" color="gray" />
                    }
                </TouchableOpacity>
                <TouchableOpacity >
                    {theme === 'black' ? <Icon
                        style={tw`p-3 bg-white rounded-full w-13 mt-4 shadow-lg`}
                        type='feather' color='black' name='sun'
                        onPress={() => setTheme('ligth')}
                    /> :
                        <Icon
                            style={tw`p-3 bg-white rounded-full w-13 mt-4 shadow-lg`}
                            type='feather' color='black' name='moon'
                            onPress={() => setTheme('black')}
                        />}



                </TouchableOpacity>
            </View>

            {!driverLocation.latitude? <MapView
                customMapStyle={theme === 'black' ? darkMap : []}
                style={tw`flex-1`}
                initialRegion={{
                    latitude: 23.138952,
                    longitude: -82.355315,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                {trips.length > 0 && trips.map((item, index) => (
                    <Marker
                        title='Viaje disponible, recojida inmediata'
                        description={`${item.name} | +53 ${item.phone} | ${item.distance} | ${item.cost} c/u `}
                        key={index}
                        coordinate={{
                            latitude: parseFloat(item.originLatitude),
                            longitude: parseFloat(item.originLongitude),
                        }}
                        pinColor={pinColors[index]}
                        onPress={() => selectMarker(item)}
                    />
                ))}
            </MapView> : <MapView
                customMapStyle={theme === 'black' ? darkMap : []}
                style={tw`flex-1`}
                initialRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                {trips.length > 0 && trips.map((item, index) => (
                    <Marker
                        title={`${item.travelType === 'Inmediato' ? 'Recogida inmediata' : 'Recogida programada' } || ${item.travelType !== 'Inmediato' ? moment(item.travelDate).format('DD MMM YYY') : 'publicado:' + moment(item.createdAt).fromNow()  }`}
                        description={`${item.name} | +53 ${item.phone} | ${item.distance} | ${item.cost} c/u `}
                        key={index}
                        coordinate={{
                            latitude: parseFloat(item.originLatitude),
                            longitude: parseFloat(item.originLongitude),
                        }}
                        pinColor={ index > pinColors.length? pinColors[index%pinColors.length] : pinColors[index] }
                        onPress={() => selectMarker(item)}
                    />
                ))}
            </MapView>   }

        </View>
    )
}

export default DriverMap

const styles = StyleSheet.create({})