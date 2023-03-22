import { FlatList, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Icon } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import {selectOrigin} from '../slices/navSlice'
const data = [
    {
        id: '123',
        title: 'No encuentra su ubicacion? Seleccionela manualmente',
        image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_485,h_385/f_auto,q_auto/products/carousel/UberX.png',
        screen: 'MapScreen',
    },
    
]

const NavOptions = ({navigation}) => {
    const origin = useSelector(selectOrigin)

    return (
        <FlatList
            data={data}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    disabled={!origin}
                    style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-100 m-2 ml-1 w-40 rounded-xl`}
                    onPress={() => navigation.navigate(item.screen)}                >
                    <View style={tw`${!origin && 'opacity-20'}`}>

                        <Image source={{ uri: item.image }}
                            style={{ width: 120, height: 120, resizeMode: 'contain' }}
                        />


                        <Text style={tw`mt-2 text-lg font-semibold`} > {item.title} </Text>
                        <Icon 
                        style={tw`p-2 bg-black rounded-full w-10 mt-4`}
                        type='antdesign' color='white' name='arrowright'
                        />
                    </View>
                </TouchableOpacity>
            )} />
    )
}

export default NavOptions

